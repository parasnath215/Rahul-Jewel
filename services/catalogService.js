// services/catalogService.js
// Rahul Jewellers Legacy - Product Catalog Management Service
// Persistent JSON storage, product ID mapping, image uploads, and admin CRUD

const fs = require('fs');
const path = require('path');
const { categories } = require('../data/catalog');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Category ID prefix map
const PREFIX_MAP = {
  bracelets: 'RJ-BR',
  bangles: 'RJ-BG',
  necklaces: 'RJ-NC',
  rings: 'RJ-RG',
  earrings: 'RJ-ER',
  studs: 'RJ-ST',
  chains: 'RJ-CH',
  'fancy-chains': 'RJ-FC'
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read products from disk
function readProductsFromFile() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return initializeProductsFromCatalog();
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[CATALOG SERVICE] Error reading products file:', err);
    return initializeProductsFromCatalog();
  }
}

// Initial populate from data/catalog.js
function initializeProductsFromCatalog() {
  const allProducts = [];
  const now = new Date().toISOString();

  for (const [catKey, cat] of Object.entries(categories)) {
    if (cat.products && Array.isArray(cat.products)) {
      cat.products.forEach((prod, idx) => {
        const prefix = PREFIX_MAP[catKey] || 'RJ-PROD';
        const numStr = String(idx + 1).padStart(2, '0');
        const id = prod.id || `${prefix}-${numStr}`;

        allProducts.push({
          id,
          categoryKey: catKey,
          categoryHeading: cat.heading,
          title: prod.title || 'Fine Jewellery Design',
          purity: prod.purity || '22K BIS Hallmarked Gold',
          diamonds: prod.diamonds || 'Natural Gemstones',
          weight: prod.weight || '14.50 gms',
          cert: prod.cert || 'BIS 100% Certified & SGL Verified',
          image: prod.image || '',
          tags: Array.isArray(prod.tags) ? prod.tags : (prod.tags ? String(prod.tags).split(' ') : ['all']),
          createdAt: now,
          updatedAt: now
        });
      });
    }
  }

  writeProductsToFile(allProducts);
  return allProducts;
}

// Write products array to JSON file
function writeProductsToFile(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    syncInMemoryCatalog(products);
    return true;
  } catch (err) {
    console.error('[CATALOG SERVICE] Error writing products file:', err);
    return false;
  }
}

// Synchronize in-memory catalog object used by Express category routes
function syncInMemoryCatalog(products) {
  // Clear existing product lists
  for (const key of Object.keys(categories)) {
    categories[key].products = [];
  }

  products.forEach(p => {
    if (categories[p.categoryKey]) {
      categories[p.categoryKey].products.push({
        id: p.id,
        title: p.title,
        purity: p.purity,
        diamonds: p.diamonds,
        weight: p.weight,
        cert: p.cert,
        image: p.image,
        tags: p.tags
      });
    }
  });

  for (const key of Object.keys(categories)) {
    categories[key].count = categories[key].products.length;
  }
}

// Initialize on boot
let cachedProducts = readProductsFromFile();
syncInMemoryCatalog(cachedProducts);

// Helper to save base64 image to disk
function saveBase64Image(base64String, categoryKey = 'products') {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let ext = '.png';
    let dataBuffer;

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('png')) ext = '.png';
      dataBuffer = Buffer.from(matches[2], 'base64');
    } else {
      dataBuffer = Buffer.from(base64String, 'base64');
    }

    const folderName = categoryKey.toLowerCase();
    const targetDir = path.join(ASSETS_DIR, 'products', folderName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filename = `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, dataBuffer);

    return `/assets/products/${folderName}/${filename}`;
  } catch (err) {
    console.error('[CATALOG SERVICE] Image save error:', err);
    throw new Error('Failed to save image file.');
  }
}

// Generate new ID for a category
function generateNextId(categoryKey) {
  const prefix = PREFIX_MAP[categoryKey] || 'RJ-PR';
  const products = readProductsFromFile();
  const catProducts = products.filter(p => p.categoryKey === categoryKey);
  
  let maxNum = 0;
  catProducts.forEach(p => {
    const parts = (p.id || '').split('-');
    const num = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });

  return `${prefix}-${String(maxNum + 1).padStart(2, '0')}`;
}

// Public API
module.exports = {
  PREFIX_MAP,

  getAllProducts({ categoryKey, search } = {}) {
    let list = readProductsFromFile();
    if (categoryKey && categoryKey !== 'all') {
      list = list.filter(p => p.categoryKey.toLowerCase() === categoryKey.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => 
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.purity && p.purity.toLowerCase().includes(q)) ||
        (p.diamonds && p.diamonds.toLowerCase().includes(q)) ||
        (p.categoryKey && p.categoryKey.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  getProductById(id) {
    const list = readProductsFromFile();
    return list.find(p => p.id === id) || null;
  },

  createProduct({ id, categoryKey, title, purity, diamonds, weight, cert, image, imageBase64, tags }) {
    const list = readProductsFromFile();
    const cat = categoryKey || 'earrings';
    const finalId = (id && id.trim()) ? id.trim().toUpperCase() : generateNextId(cat);

    // Verify duplicate ID
    if (list.some(p => p.id.toUpperCase() === finalId)) {
      throw new Error(`Product with ID "${finalId}" already exists.`);
    }

    let finalImage = (image || '').trim();
    if (imageBase64 && imageBase64.startsWith('data:image/')) {
      finalImage = saveBase64Image(imageBase64, cat);
    }

    if (!finalImage) {
      finalImage = '/assets/products/bracelets/bracelet_01.jpg'; // fallback
    }

    let parsedTags = ['all'];
    if (Array.isArray(tags)) {
      parsedTags = tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
    }
    if (!parsedTags.includes('all')) parsedTags.unshift('all');

    const catHeading = categories[cat] ? categories[cat].heading : 'Fine Jewellery';
    const now = new Date().toISOString();

    const newProduct = {
      id: finalId,
      categoryKey: cat,
      categoryHeading: catHeading,
      title: (title || 'New Showroom Creation').trim(),
      purity: (purity || '22K BIS Hallmarked Gold').trim(),
      diamonds: (diamonds || 'Uncut Natural Polki & Diamonds').trim(),
      weight: (weight || '15.00 gms Approx').trim(),
      cert: (cert || 'BIS 100% Certified & SGL Verified').trim(),
      image: finalImage,
      tags: parsedTags,
      createdAt: now,
      updatedAt: now
    };

    list.unshift(newProduct);
    writeProductsToFile(list);
    return newProduct;
  },

  updateProduct(id, updates) {
    const list = readProductsFromFile();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const prod = list[idx];
    const cat = updates.categoryKey || prod.categoryKey;

    if (updates.imageBase64 && updates.imageBase64.startsWith('data:image/')) {
      updates.image = saveBase64Image(updates.imageBase64, cat);
    }

    if (updates.title !== undefined) prod.title = updates.title.trim();
    if (updates.categoryKey !== undefined) {
      prod.categoryKey = updates.categoryKey;
      prod.categoryHeading = categories[updates.categoryKey] ? categories[updates.categoryKey].heading : prod.categoryHeading;
    }
    if (updates.purity !== undefined) prod.purity = updates.purity.trim();
    if (updates.diamonds !== undefined) prod.diamonds = updates.diamonds.trim();
    if (updates.weight !== undefined) prod.weight = updates.weight.trim();
    if (updates.cert !== undefined) prod.cert = updates.cert.trim();
    if (updates.image !== undefined && updates.image.trim()) prod.image = updates.image.trim();

    if (updates.tags !== undefined) {
      let parsedTags = ['all'];
      if (Array.isArray(updates.tags)) {
        parsedTags = updates.tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
      } else if (typeof updates.tags === 'string') {
        parsedTags = updates.tags.split(/[\s,]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
      }
      if (!parsedTags.includes('all')) parsedTags.unshift('all');
      prod.tags = parsedTags;
    }

    prod.updatedAt = new Date().toISOString();
    list[idx] = prod;
    writeProductsToFile(list);
    return prod;
  },

  deleteProduct(id) {
    let list = readProductsFromFile();
    const initialLen = list.length;
    list = list.filter(p => p.id !== id);
    if (list.length !== initialLen) {
      writeProductsToFile(list);
      return true;
    }
    return false;
  },

  syncStaticHtmlFiles(specificCategory = null) {
    const fileMap = {
      bracelets: 'bracelets.html',
      bangles: 'bangles.html',
      necklaces: 'necklaces.html',
      rings: 'rings.html',
      earrings: 'earrings.html',
      studs: 'studs.html',
      chains: 'chains.html',
      'fancy-chains': 'fancy-chains.html'
    };

    const categoryHeadings = {
      bracelets: 'Handcrafted Bracelets',
      bangles: 'Artisan Royal Bangles & Kadas',
      necklaces: 'Royal Heritage Necklaces',
      rings: 'Bespoke Rings & Solitaires',
      earrings: 'Handcrafted Earrings & Jhumkas',
      studs: 'Diamond & Gold Daily Studs',
      chains: 'Pure Gold & Devotional Chains',
      'fancy-chains': 'Contemporary Fancy Chains'
    };

    const rootDir = path.join(__dirname, '..');
    const results = {};

    const targets = specificCategory ? { [specificCategory]: fileMap[specificCategory] } : fileMap;

    for (const [catKey, filename] of Object.entries(targets)) {
      if (!filename) continue;
      const fullPath = path.join(rootDir, filename);
      if (!fs.existsSync(fullPath)) continue;

      let content = fs.readFileSync(fullPath, 'utf-8');
      const products = readProductsFromFile().filter(p => p.categoryKey === catKey);
      const heading = categoryHeadings[catKey] || 'Fine Jewellery';

      let cardsHtml = '';
      products.forEach((p, idx) => {
        let imgSrc = p.image.startsWith('/') ? p.image.slice(1) : p.image;
        let tagsStr = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || 'all');
        if (!tagsStr.includes('all')) tagsStr = 'all ' + tagsStr;

        const firstBtnStyle = (idx === 0 && catKey === 'bracelets') 
          ? ' style="opacity: 1; transform: translateY(0); pointer-events: auto;"' 
          : '';

        cardsHtml += `        <div class="product-card" \n` +
                     `             data-id="${p.id}"\n` +
                     `             data-title="${p.title}" \n` +
                     `             data-category="${heading}" \n` +
                     `             data-purity="${p.purity}" \n` +
                     `             data-diamonds="${p.diamonds}" \n` +
                     `             data-weight="${p.weight}"\n` +
                     `             data-cert="${p.cert || 'BIS 100% Certified'}"\n` +
                     `             data-tags="${tagsStr}">\n` +
                     `          <img class="product-img" src="${imgSrc}" alt="${p.title}" loading="lazy">\n` +
                     `          <button class="view-item-btn"${firstBtnStyle} type="button" aria-label="View details for ${p.title}">\n` +
                     `            <span>VIEW ITEM</span>\n` +
                     `            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>\n` +
                     `          </button>\n` +
                     `        </div>\n`;
      });

      let loadMoreHtml = '';
      if (products.length > 12) {
        loadMoreHtml = `\n      <!-- Load More Button -->\n` +
                       `      <div class="load-more-wrap" id="loadMoreWrap">\n` +
                       `        <button class="load-more-btn" id="loadMoreBtn" type="button" aria-label="Load more ${catKey} designs">\n` +
                       `          <span>Load More Designs</span>\n` +
                       `          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>\n` +
                       `        </button>\n` +
                       `      </div>\n`;
      }

      const regex = /<div class="products-grid">[\s\S]*?<\/div>[\s\S]*?<\/main>/;
      const replacement = `<div class="products-grid">\n${cardsHtml}      </div>${loadMoreHtml}    </div>\n  </main>`;

      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(fullPath, content, 'utf-8');
        results[filename] = products.length;
      }
    }
    return results;
  },

  saveBase64Image,
  syncInMemoryCatalog,
  readProductsFromFile
};
