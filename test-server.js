const http = require('http');
const app = require('./server');

const TEST_PORT = 3001;

function request(method, path, body = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path: path,
      method: method,
      headers: { ...customHeaders }
    };

    let postData = null;
    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
      }
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING RAHUL JEWELLERS FULL TEST SUITE ===');
  const server = app.listen(TEST_PORT);

  try {
    // 1. Test Home page
    let res = await request('GET', '/');
    console.log(`[TEST 1] GET / => Status ${res.statusCode} | Contains RAHUL JEWELLERS: ${res.body.includes('RAHUL JEWELLERS')}`);
    if (res.statusCode !== 200) throw new Error('Home page failed');

    // 2. Test Category Pages
    const categories = ['bracelets', 'bangles', 'necklaces', 'rings', 'earrings', 'studs', 'chains', 'fancy-chains'];
    for (const cat of categories) {
      res = await request('GET', `/collections/${cat}`);
      console.log(`[TEST] GET /collections/${cat} => Status ${res.statusCode} | Contains VIEW ITEM: ${res.body.includes('VIEW ITEM')}`);
      if (res.statusCode !== 200) throw new Error(`Category ${cat} failed`);
    }

    // 2b. Test About Us page
    res = await request('GET', '/about');
    console.log(`[TEST] GET /about => Status ${res.statusCode} | Contains About Us: ${res.body.includes('About Us')}`);
    if (res.statusCode !== 200) throw new Error('About page failed');

    res = await request('GET', '/about.html');
    console.log(`[TEST] GET /about.html => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /about.html failed');

    // 2c. Test Contact Us page
    res = await request('GET', '/contact');
    console.log(`[TEST] GET /contact => Status ${res.statusCode} | Contains Store Address: ${res.body.includes('Store Address')}`);
    if (res.statusCode !== 200) throw new Error('Contact page failed');

    res = await request('GET', '/contact.html');
    console.log(`[TEST] GET /contact.html => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /contact.html failed');

    // 2d. Test Product Detail page
    res = await request('GET', '/product');
    console.log(`[TEST] GET /product => Status ${res.statusCode} | Contains The Royal Noor: ${res.body.includes('The Royal Noor')}`);
    if (res.statusCode !== 200) throw new Error('Product page failed');

    res = await request('GET', '/product.html');
    console.log(`[TEST] GET /product.html => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /product.html failed');

    res = await request('GET', '/product/the-royal-noor-polki-choker');
    console.log(`[TEST] GET /product/:slug => Status ${res.statusCode} | Contains Hallmarked 916: ${res.body.includes('Hallmarked 916')}`);
    if (res.statusCode !== 200) throw new Error('Product slug page failed');

    // 2e. Test Gold Rates page
    res = await request('GET', '/gold-rates');
    console.log(`[TEST] GET /gold-rates => Status ${res.statusCode} | Contains ALL METAL RATES: ${res.body.includes('ALL METAL RATES')}`);
    if (res.statusCode !== 200) throw new Error('Gold Rates page failed');

    res = await request('GET', '/gold-rates.html');
    console.log(`[TEST] GET /gold-rates.html => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /gold-rates.html failed');

    // 3. Test Redirect Aliases
    res = await request('GET', '/bracelets');
    console.log(`[TEST] GET /bracelets => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /bracelets failed');

    // 4. Test Catalog API
    res = await request('GET', '/api/catalog');
    const catalogData = JSON.parse(res.body);
    console.log(`[TEST] GET /api/catalog => Status ${res.statusCode} | Categories count: ${catalogData.totalCategories}`);
    if (catalogData.totalCategories !== 8) throw new Error('Catalog API failed');

    // 5. Test Live Cached Rates API
    res = await request('GET', '/api/rates');
    const ratesData = JSON.parse(res.body);
    console.log(`[TEST] GET /api/rates => Status ${res.statusCode} | Featured 24K 10G: ${ratesData.featured.gold24k_10g.value} | Rows: ${ratesData.allMetalRates.length}`);
    if (ratesData.allMetalRates.length !== 6) throw new Error('Rates API metal rows count mismatch');

    // ==========================================
    // ADMIN PANEL & AUTHENTICATION TESTS
    // ==========================================
    console.log('\n--- ADMIN AUTHENTICATION TESTS ---');

    // 6. Test Unauthenticated /admin -> Redirects to /admin/login
    res = await request('GET', '/admin');
    console.log(`[ADMIN TEST 1] GET /admin (unauthenticated) => Status ${res.statusCode} | Location: ${res.headers.location}`);
    if (res.statusCode !== 302 || res.headers.location !== '/admin/login') {
      throw new Error('Unauthenticated /admin did not redirect to /admin/login');
    }

    // 7. Test GET /admin/login
    res = await request('GET', '/admin/login');
    console.log(`[ADMIN TEST 2] GET /admin/login => Status ${res.statusCode} | Contains Showroom Admin: ${res.body.includes('Showroom Admin')}`);
    if (res.statusCode !== 200) throw new Error('GET /admin/login failed');

    // 8. Test POST /admin/login with invalid password
    res = await request('POST', '/admin/login', { username: 'admin', password: 'wrongpassword' }, { 'Accept': 'application/json' });
    console.log(`[ADMIN TEST 3] POST /admin/login (bad password) => Status ${res.statusCode}`);
    if (res.statusCode !== 401) throw new Error('Bad login should return 401');

    // 9. Test POST /admin/login with valid credentials
    res = await request('POST', '/admin/login', { username: 'admin', password: 'rahul1989' }, { 'Accept': 'application/json' });
    console.log(`[ADMIN TEST 4] POST /admin/login (valid) => Status ${res.statusCode}`);
    if (res.statusCode !== 200) throw new Error('Valid login failed');
    const loginJson = JSON.parse(res.body);
    if (!loginJson.token) throw new Error('No token returned in login');

    // Extract cookie from Set-Cookie header
    const setCookie = res.headers['set-cookie'];
    const adminCookie = setCookie ? setCookie[0].split(';')[0] : `rj_admin_token=${loginJson.token}`;
    console.log(`[ADMIN AUTH] Received cookie: ${adminCookie.substring(0, 30)}...`);

    // 10. Test GET /admin with valid cookie -> Should return 200 and dashboard HTML
    res = await request('GET', '/admin', null, { 'Cookie': adminCookie });
    console.log(`[ADMIN TEST 5] GET /admin (authenticated) => Status ${res.statusCode} | Contains Board Rates: ${res.body.includes('Board Rates Configuration')}`);
    if (res.statusCode !== 200 || !res.body.includes('Board Rates Configuration')) {
      throw new Error('Authenticated GET /admin failed to load dashboard');
    }

    // ==========================================
    // ADMIN INQUIRIES API TESTS
    // ==========================================
    console.log('\n--- ADMIN INQUIRIES MANAGEMENT TESTS ---');

    // 11. Test Public POST /api/inquiry (Submitting a customer lead)
    const testCustomer = {
      name: 'Princess Ananya Singh',
      phone: '+91 9988776655',
      email: 'ananya.singh@royalheirloom.in',
      productTitle: 'The Noor Polki Choker Suite',
      message: 'Requesting a private VIP preview at the Hazratganj showroom.'
    };
    res = await request('POST', '/api/inquiry', testCustomer);
    const inqRes = JSON.parse(res.body);
    console.log(`[ADMIN TEST 6] POST /api/inquiry => Status ${res.statusCode} | Inquiry ID: ${inqRes.inquiryId}`);
    if (!inqRes.success || !inqRes.inquiryId) throw new Error('Customer inquiry creation failed');
    const createdId = inqRes.inquiryId;

    // 12. Test GET /admin/api/inquiries (Verify lead appears in Admin Console)
    res = await request('GET', '/admin/api/inquiries', null, { 'Cookie': adminCookie });
    const inqListRes = JSON.parse(res.body);
    console.log(`[ADMIN TEST 7] GET /admin/api/inquiries => Status ${res.statusCode} | Total Inquiries: ${inqListRes.count}`);
    const foundInq = inqListRes.inquiries.find(i => i.id === createdId);
    if (!foundInq) throw new Error(`Created inquiry ${createdId} not found in admin list`);
    console.log(`[ADMIN TEST 7b] Verified newly submitted lead in Admin: ${foundInq.name} (${foundInq.productTitle})`);

    // 13. Test PUT /admin/api/inquiries/:id (Update lead status and notes)
    res = await request('PUT', `/admin/api/inquiries/${createdId}`, {
      status: 'contacted',
      notes: 'VIP concierge appointment scheduled for Saturday 4 PM.'
    }, { 'Cookie': adminCookie });
    const updateRes = JSON.parse(res.body);
    console.log(`[ADMIN TEST 8] PUT /admin/api/inquiries/:id => Status ${res.statusCode} | New Status: ${updateRes.inquiry.status}`);
    if (updateRes.inquiry.status !== 'contacted' || !updateRes.inquiry.notes.includes('VIP concierge')) {
      throw new Error('Inquiry status update failed');
    }

    // 14. Test GET /admin/api/inquiries/export (CSV export)
    res = await request('GET', '/admin/api/inquiries/export', null, { 'Cookie': adminCookie });
    console.log(`[ADMIN TEST 9] GET /admin/api/inquiries/export => Status ${res.statusCode} | Content-Type: ${res.headers['content-type']}`);
    if (res.statusCode !== 200 || !res.body.includes('Princess Ananya Singh')) {
      throw new Error('CSV export failed or missing customer lead');
    }

    // ==========================================
    // ADMIN LIVE GOLD RATES MANAGEMENT TESTS
    // ==========================================
    console.log('\n--- ADMIN LIVE GOLD RATES TESTS ---');

    // 15. Test POST /admin/api/rates with Manual Override Rates
    const testManualGold1g = 13500; // Yields 1,35,000 for 10g
    const testManualSil1g = 175;     // Yields 1,75,000 for 1kg
    const testManualPlat1g = 5200;
    const testNotice = 'Diwali Exclusive Festive Rate';

    res = await request('POST', '/admin/api/rates', {
      mode: 'manual',
      gold24k_1g: testManualGold1g,
      silver_1g: testManualSil1g,
      platinum_1g: testManualPlat1g,
      customDateDisplay: testNotice
    }, { 'Cookie': adminCookie });
    const manualRatesRes = JSON.parse(res.body);
    console.log(`[ADMIN TEST 10] POST /admin/api/rates (manual) => Status ${res.statusCode} | Mode: ${manualRatesRes.config.mode} | 24K 10G: ${manualRatesRes.rates.featured.gold24k_10g.value}`);
    if (manualRatesRes.rates.featured.gold24k_10g.value !== '1,35,000') {
      throw new Error('Manual rates calculation mismatch');
    }

    // 16. Verify Public /api/rates now serves the Showroom Manual Override instantly
    res = await request('GET', '/api/rates');
    const publicRates = JSON.parse(res.body);
    console.log(`[ADMIN TEST 11] GET /api/rates (public check) => 24K 10G: ${publicRates.featured.gold24k_10g.value} | Mode: ${publicRates.mode} | Title Date: ${publicRates.pageTitleDate}`);
    if (publicRates.featured.gold24k_10g.value !== '1,35,000' || publicRates.pageTitleDate !== testNotice) {
      throw new Error('Public rates did not reflect showroom manual override');
    }

    // 17. Reset to Automatic Live Market Feed
    res = await request('POST', '/admin/api/rates', { mode: 'auto' }, { 'Cookie': adminCookie });
    const resetRes = JSON.parse(res.body);
    console.log(`[ADMIN TEST 12] POST /admin/api/rates (reset to auto) => Status ${res.statusCode} | Mode: ${resetRes.config.mode}`);
    if (resetRes.config.mode !== 'auto') throw new Error('Failed to reset to auto mode');

    // 18. Verify Public /api/rates reflects auto live feed
    res = await request('GET', '/api/rates');
    const autoPublicRates = JSON.parse(res.body);
    console.log(`[ADMIN TEST 13] GET /api/rates after reset => Mode: ${autoPublicRates.mode}`);
    if (autoPublicRates.mode !== 'auto') throw new Error('Public rates mode is not auto after reset');

    // 19. Cleanup: Delete test inquiry
    res = await request('DELETE', `/admin/api/inquiries/${createdId}`, null, { 'Cookie': adminCookie });
    console.log(`[ADMIN TEST 14] DELETE /admin/api/inquiries/:id => Status ${res.statusCode}`);
    if (res.statusCode !== 200) throw new Error('Inquiry deletion failed');

    // 20. Test GET /admin/logout
    res = await request('GET', '/admin/logout');
    console.log(`[ADMIN TEST 15] GET /admin/logout => Status ${res.statusCode} | Location: ${res.headers.location}`);
    if (res.statusCode !== 302 || res.headers.location !== '/admin/login') {
      throw new Error('Logout failed to redirect to /admin/login');
    }

    console.log('\n=======================================================');
    console.log('  ALL TESTS (STOREFRONT + ADMIN PANEL + RATES) PASSED!  ');
    console.log('=======================================================');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
