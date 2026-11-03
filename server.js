/**
 * Rahul Jewellers Legacy - Node.js Express Application Server
 */
const express = require('express');
const path = require('path');
const { categories, categoryList } = require('./data/catalog');
const rates = require('./data/rates');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static asset folders
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// ==========================================
// ROUTES
// ==========================================

// 1. Home / Landing Page
app.get('/', (req, res) => {
  res.render('index', {
    activePage: 'home',
    categories,
    categoryList,
    rates
  });
});

// Backwards compatibility for index.html
app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
});

// 2. About Us Page
app.get('/about', (req, res) => {
  res.render('about', {
    activePage: 'about',
    categories,
    categoryList,
    rates
  });
});
app.get('/about.html', (req, res) => {
  res.redirect(301, '/about');
});

// 3. Contact Us Page
app.get('/contact', (req, res) => {
  res.render('contact', {
    activePage: 'contact',
    categories,
    categoryList,
    rates
  });
});
app.get('/contact.html', (req, res) => {
  res.redirect(301, '/contact');
});

// 4. Product Detail Page
app.get('/product', (req, res) => {
  res.render('product', {
    activePage: 'product',
    categories,
    categoryList,
    rates
  });
});
app.get('/product/:slug', (req, res) => {
  res.render('product', {
    activePage: 'product',
    categories,
    categoryList,
    rates,
    productSlug: req.params.slug
  });
});
app.get('/product.html', (req, res) => {
  res.redirect(301, '/product');
});

// 2. Dynamic Category Collection Page: /collections/:category
app.get('/collections/:category', (req, res, next) => {
  const catKey = req.params.category.toLowerCase();
  const category = categories[catKey];

  if (!category) {
    return next(); // pass to 404
  }

  res.render('category', {
    activePage: 'category',
    activeCategory: catKey,
    category,
    categories,
    categoryList,
    rates
  });
});

// 3. Short URL Aliases (e.g. /bracelets -> /collections/bracelets)
// and .html backwards compatibility (e.g. /bracelets.html -> /collections/bracelets)
app.get('/:slug', (req, res, next) => {
  const rawSlug = req.params.slug.toLowerCase().replace(/\.html$/, '');
  
  if (categories[rawSlug]) {
    return res.redirect(301, `/collections/${rawSlug}`);
  }

  next();
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Get entire catalog
app.get('/api/catalog', (req, res) => {
  res.json({
    success: true,
    totalCategories: categoryList.length,
    categories: categoryList
  });
});

// Get single category items
app.get('/api/catalog/:category', (req, res) => {
  const catKey = req.params.category.toLowerCase();
  const category = categories[catKey];

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  res.json({
    success: true,
    category: category.heading,
    count: category.count,
    products: category.products
  });
});

// Get metal rates
app.get('/api/rates', (req, res) => {
  res.json({
    success: true,
    data: rates
  });
});

// Handle concierge inquiries
app.post('/api/inquiry', (req, res) => {
  const { name, phone, email, productTitle, productId, message } = req.body;
  
  // Here inquiry can be saved to DB or forwarded to WhatsApp / CRM
  console.log(`[INQUIRY RECEIVED] From: ${name || 'Anonymous'} (${phone || 'N/A'}) for product: ${productTitle || productId || 'General'}`);

  res.json({
    success: true,
    message: 'Thank you for your inquiry. Our royal concierge will connect with you shortly.',
    inquiryId: `RJ-${Date.now().toString().slice(-6)}`
  });
});

// System Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 404 & ERROR HANDLING
// ==========================================
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>404 - Page Not Found | Rahul Jewellers Legacy</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Instrument+Sans:wght@500&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Instrument Sans', sans-serif; background: #0a2a23; color: #f7f1e7; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .box { max-width: 500px; padding: 40px; border: 1px solid rgba(183,138,61,0.4); border-radius: 4px; background: rgba(15, 61, 50, 0.4); }
        h1 { font-family: 'Cormorant Garamond', serif; font-size: 48px; color: #d8b26e; margin: 0 0 16px; }
        p { color: #bfcec8; margin-bottom: 28px; line-height: 1.6; }
        a { display: inline-block; background: #b78a3d; color: #0a2a23; padding: 12px 28px; text-decoration: none; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-size: 13px; border-radius: 2px; }
        a:hover { background: #d8b26e; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>404</h1>
        <p>The magnificent heirloom page you are searching for could not be found or has moved.</p>
        <a href="/">Return to Grand Gallery</a>
      </div>
    </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ success: false, error: 'Internal server error occurred.' });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Rahul Jewellers Legacy Node.js Server is running!`);
    console.log(`  Local URL:   http://localhost:${PORT}`);
    console.log(`  Collections: http://localhost:${PORT}/collections/bracelets`);
    console.log(`  API:         http://localhost:${PORT}/api/catalog`);
    console.log(`=======================================================`);
  });
}

module.exports = app;

