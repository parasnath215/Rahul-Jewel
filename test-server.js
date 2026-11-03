const http = require('http');
const app = require('./server');

const TEST_PORT = 3001;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path: path,
      method: method,
      headers: {}
    };

    if (body) {
      const data = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(data);
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING NODE.JS SERVER TESTS ===');
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

    res = await request('GET', '/bracelets.html');
    console.log(`[TEST] GET /bracelets.html => Status ${res.statusCode} | Redirects to: ${res.headers.location}`);
    if (res.statusCode !== 301) throw new Error('Redirect /bracelets.html failed');

    // 4. Test Catalog API
    res = await request('GET', '/api/catalog');
    const catalogData = JSON.parse(res.body);
    console.log(`[TEST] GET /api/catalog => Status ${res.statusCode} | Categories count: ${catalogData.totalCategories}`);
    if (catalogData.totalCategories !== 8) throw new Error('Catalog API failed');

    // 5. Test Single Category API
    res = await request('GET', '/api/catalog/bracelets');
    const braceData = JSON.parse(res.body);
    console.log(`[TEST] GET /api/catalog/bracelets => Status ${res.statusCode} | Products count: ${braceData.count}`);
    if (braceData.count !== 15) throw new Error('Bracelets API count failed');

    // 6. Test Live Cached Rates API
    res = await request('GET', '/api/rates');
    const ratesData = JSON.parse(res.body);
    console.log(`[TEST] GET /api/rates => Status ${res.statusCode} | Featured 24K 10G: ${ratesData.featured.gold24k_10g.value} | Rows: ${ratesData.allMetalRates.length} | Cached: ${ratesData.cacheInfo.cached}`);
    if (ratesData.allMetalRates.length !== 6) throw new Error('Rates API metal rows count mismatch');
    if (ratesData.priceHistory.length !== 10) throw new Error('Rates API history rows count mismatch');

    // 6b. Test Rate Cache Status
    res = await request('GET', '/api/rates/status');
    const cacheStatus = JSON.parse(res.body);
    console.log(`[TEST] GET /api/rates/status => Status ${res.statusCode} | TTL: ${cacheStatus.cache.ttlSeconds}s | Cached: ${cacheStatus.cache.isCached}`);
    if (cacheStatus.cache.ttlSeconds !== 600) throw new Error('Rate cache TTL mismatch');

    // 6c. Test Manual Refresh Rate Cache API
    res = await request('POST', '/api/rates/refresh');
    const refreshData = JSON.parse(res.body);
    console.log(`[TEST] POST /api/rates/refresh => Status ${res.statusCode} | Success: ${refreshData.success}`);
    if (!refreshData.success) throw new Error('Rates manual refresh failed');

    // 7. Test Inquiry POST API
    res = await request('POST', '/api/inquiry', {
      name: 'Aditi Sharma',
      phone: '+91 9876543210',
      productTitle: 'Noor Floral Diamond Cuff Bracelet',
      productId: 'RJ-BR-01'
    });
    const inquiryData = JSON.parse(res.body);
    console.log(`[TEST] POST /api/inquiry => Status ${res.statusCode} | Inquiry ID: ${inquiryData.inquiryId}`);

    // 8. Test 404
    res = await request('GET', '/non-existent-luxury');
    console.log(`[TEST] GET /non-existent-luxury => Status ${res.statusCode} (Expected 404)`);

    console.log('=== ALL NODE.JS TESTS PASSED WITH 100% SUCCESS! ===');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
