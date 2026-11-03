/**
 * Rahul Jewellers Legacy - Node.js Express Application Server
 */
const express = require('express');
const path = require('path');
const { categories, categoryList } = require('./data/catalog');
const rates = require('./data/rates');
const rateService = require('./services/rateService');
const adminService = require('./services/adminService');

// Initialize background scheduled rate service (10-minute caching cycle)
rateService.initRateService();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight Native Cookie Parser Helper
function getCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    list[name] = decodeURIComponent(rest.join('=').trim());
  });
  return list;
}

// Admin Authentication Middleware
function requireAdmin(req, res, next) {
  const cookies = getCookies(req);
  const token = cookies.rj_admin_token || req.headers.authorization?.replace(/^Bearer\s+/, '');

  if (adminService.validateSessionToken(token)) {
    return next();
  }

  if (req.path.startsWith('/admin/api/')) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Admin session expired.' });
  }

  return res.redirect('/admin/login');
}

// Static asset folders
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// ==========================================
// PUBLIC STOREFRONT ROUTES
// ==========================================

// 1. Home / Landing Page
app.get('/', (req, res) => {
  res.render('index', {
    activePage: 'home',
    categories,
    categoryList,
    rates: rateService.getCachedRatesSync()
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
    rates: rateService.getCachedRatesSync()
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
    rates: rateService.getCachedRatesSync()
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
    rates: rateService.getCachedRatesSync()
  });
});
app.get('/product/:slug', (req, res) => {
  res.render('product', {
    activePage: 'product',
    categories,
    categoryList,
    rates: rateService.getCachedRatesSync(),
    productSlug: req.params.slug
  });
});
app.get('/product.html', (req, res) => {
  res.redirect(301, '/product');
});

// 5. Gold & Precious Metal Rates Page (Indian Market Live Rates with 10-min Cache or Manual Override)
app.get('/gold-rates', async (req, res) => {
  const currentRates = await rateService.getRates();
  res.render('gold-rates', {
    activePage: 'gold-rates',
    categories,
    categoryList,
    rates: currentRates
  });
});
app.get('/gold-rates.html', (req, res) => {
  res.redirect(301, '/gold-rates');
});

// 6. Dynamic Category Collection Page: /collections/:category
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
    rates: rateService.getCachedRatesSync()
  });
});

// 7. Short URL Aliases (e.g. /bracelets -> /collections/bracelets)
// and .html backwards compatibility (e.g. /bracelets.html -> /collections/bracelets)
app.get('/:slug', (req, res, next) => {
  const rawSlug = req.params.slug.toLowerCase().replace(/\.html$/, '');

  // Protect admin paths from being treated as category slugs
  if (rawSlug === 'admin' || rawSlug.startsWith('admin/')) {
    return next();
  }
  
  if (categories[rawSlug]) {
    return res.redirect(301, `/collections/${rawSlug}`);
  }

  next();
});

// ==========================================
// ADMIN PANEL AUTH & DASHBOARD ROUTES
// ==========================================

// Admin Login Page
app.get('/admin/login', (req, res) => {
  const cookies = getCookies(req);
  if (adminService.validateSessionToken(cookies.rj_admin_token)) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: null });
});

// Admin Login Handler
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (adminService.verifyCredentials(username, password)) {
    const token = adminService.createSessionToken();
    res.setHeader('Set-Cookie', `rj_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, token, redirect: '/admin' });
    }
    return res.redirect('/admin');
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }

  res.status(401).render('admin/login', {
    error: 'Invalid showroom admin credentials. Please try again.',
    username
  });
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'rj_admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.redirect('/admin/login');
});

// Admin Main Dashboard
app.get('/admin', requireAdmin, async (req, res) => {
  const inquiries = adminService.getInquiries();
  const ratesConfig = adminService.getRateConfig();
  const currentRates = await rateService.getRates();

  res.render('admin/dashboard', {
    inquiries,
    ratesConfig,
    rates: currentRates
  });
});

// ==========================================
// ADMIN REST API (INQUIRIES & RATES)
// ==========================================

// Get all inquiries (with optional search and status filter)
app.get('/admin/api/inquiries', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  const inquiries = adminService.getInquiries({ status, search });
  res.json({
    success: true,
    count: inquiries.length,
    inquiries
  });
});

// Update inquiry (status, notes, etc.)
app.put('/admin/api/inquiries/:id', requireAdmin, (req, res) => {
  const updated = adminService.updateInquiry(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }
  res.json({
    success: true,
    message: 'Inquiry updated successfully',
    inquiry: updated
  });
});

// Delete inquiry
app.delete('/admin/api/inquiries/:id', requireAdmin, (req, res) => {
  const success = adminService.deleteInquiry(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }
  res.json({
    success: true,
    message: 'Inquiry deleted successfully'
  });
});

// Export inquiries as CSV
app.get('/admin/api/inquiries/export', requireAdmin, (req, res) => {
  const list = adminService.getInquiries();
  const csvRows = [
    ['ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Source', 'Product/Topic', 'Status', 'Notes', 'Message']
  ];

  list.forEach(i => {
    csvRows.push([
      i.id,
      i.dateDisplay,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.source || '').replace(/"/g, '""')}"`,
      `"${(i.productTitle || '').replace(/"/g, '""')}"`,
      i.status,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);
  });

  const csvContent = csvRows.map(r => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="rahul_jewellers_leads_${Date.now()}.csv"`);
  res.send(csvContent);
});

// Get rate configuration
app.get('/admin/api/rates', requireAdmin, async (req, res) => {
  const config = adminService.getRateConfig();
  const rates = await rateService.getRates();
  res.json({
    success: true,
    config,
    rates
  });
});

// Save rate configuration (mode: 'auto' | 'manual', manual rates)
app.post('/admin/api/rates', requireAdmin, async (req, res) => {
  try {
    const { mode, gold24k_1g, silver_1g, platinum_1g, customDateDisplay } = req.body;

    if (mode === 'auto') {
      const liveRates = await rateService.resetToAuto('admin');
      return res.json({
        success: true,
        message: 'Precious metal rates reset to 10-minute automatic live market feed.',
        config: adminService.getRateConfig(),
        rates: liveRates
      });
    }

    // Manual showroom override
    const manualRates = rateService.applyManualRates({
      gold24k_1g,
      silver_1g,
      platinum_1g
    }, customDateDisplay, 'admin');

    res.json({
      success: true,
      message: 'Showroom board rates saved and published to the live website.',
      config: adminService.getRateConfig(),
      rates: manualRates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger live spot fetch test for admin
app.post('/admin/api/rates/refresh', requireAdmin, async (req, res) => {
  try {
    const freshRates = await rateService.refreshRates(true);
    res.json({
      success: true,
      message: 'Market spot rates fetched successfully',
      data: freshRates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// PUBLIC REST API ENDPOINTS
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

// Get live cached metal rates (serves from in-memory cache with 10-minute TTL or manual override)
app.get('/api/rates', async (req, res) => {
  try {
    const cachedRates = await rateService.getRates();
    res.json({
      success: true,
      data: rates,
      ...cachedRates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Refresh metal rates manually (cache invalidation)
app.post('/api/rates/refresh', async (req, res) => {
  try {
    const freshRates = await rateService.refreshRates(true);
    res.json({
      success: true,
      message: 'Rates refreshed successfully from bullion feeds',
      data: freshRates,
      cache: rateService.getCacheStatus()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cache status endpoint
app.get('/api/rates/status', (req, res) => {
  res.json({
    success: true,
    cache: rateService.getCacheStatus()
  });
});

// Handle concierge inquiries (Persists to inquiries store for showroom admin)
app.post('/api/inquiry', (req, res) => {
  const { name, phone, email, productTitle, productId, message, source } = req.body;

  const saved = adminService.createInquiry({
    name,
    phone,
    email,
    source: source || 'Website Concierge Form',
    productTitle: productTitle || productId || 'General Showroom Collection',
    message
  });

  console.log(`[INQUIRY RECORDED] Ref: ${saved.id} | From: ${saved.name} (${saved.phone || 'No phone'}) for: ${saved.productTitle}`);

  res.json({
    success: true,
    message: 'Thank you for your inquiry. Our royal concierge will connect with you shortly.',
    inquiryId: saved.id
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
    console.log(`  Gold Rates:  http://localhost:${PORT}/gold-rates`);
    console.log(`  Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`  API:         http://localhost:${PORT}/api/catalog`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
