const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const expectedSubcats = [
  'bangles.html',
  'bracelets.html',
  'chains.html',
  'earrings.html',
  'fancy-chains.html',
  'necklaces.html',
  'rings.html',
  'studs.html'
];

let allPassed = true;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const issues = [];

  // 1. Top bar
  if (!content.includes('class="top-bar"')) issues.push('Missing .top-bar');
  if (!content.includes('COMPLIMENTARY INSURED WORLDWIDE')) issues.push('Missing top-bar text');
  if (!content.includes('Book Concierge')) issues.push('Missing Book Concierge');
  if (!content.includes('Store Locator')) issues.push('Missing Store Locator');
  if (content.match(/href="\/contact"/)) issues.push('Root relative /contact in static HTML');

  // 2. Header tag
  if (!content.includes('<header class="site-header" id="home">')) {
    issues.push('Header missing id="home" or class="site-header"');
  }

  // 3. Logo
  if (!content.includes('src="assets/logo-header.png"')) issues.push('Missing assets/logo-header.png');
  if (!content.includes('class="site-brand-logo"')) issues.push('Missing class="site-brand-logo"');
  if (!content.includes('href="index.html"')) issues.push('Logo does not link to index.html');

  // 4. Nav Menu
  if (!content.includes('class="nav-menu"')) issues.push('Missing .nav-menu');
  if (!content.includes('href="index.html">Home</a>')) issues.push('Missing Home link');
  if (!content.includes('href="about.html">About Us</a>')) issues.push('Missing About Us link');
  if (!content.includes('href="gold-rates.html">Gold Rates</a>')) issues.push('Missing Gold Rates link');
  if (!content.includes('href="contact.html">Contact</a>')) issues.push('Missing Contact link');
  if (!content.includes('class="nav-item-dropdown"')) issues.push('Missing .nav-item-dropdown');
  if (!content.includes('class="dropdown-menu"')) issues.push('Missing .dropdown-menu');

  // 5. Dropdown items
  expectedSubcats.forEach(sub => {
    if (!content.includes(`href="${sub}"`)) {
      issues.push(`Missing dropdown link for ${sub}`);
    }
  });

  // 6. Mobile toggle
  if (!content.includes('class="mobile-toggle"')) issues.push('Missing .mobile-toggle');

  if (issues.length > 0) {
    allPassed = false;
    console.error(`❌ ${f}:`, issues);
  } else {
    console.log(`✅ ${f}: All header checks PASSED`);
  }
});

console.log('\n--- Checking CSS Rules for Sticky Header & Mobile Nav ---');
const catCss = fs.readFileSync('css/category.css', 'utf8');
const pagesCss = fs.readFileSync('css/pages.css', 'utf8');

const cssChecks = [
  { name: 'category.css .site-header sticky', pass: catCss.includes('position: sticky;') && catCss.includes('z-index: 999;') },
  { name: 'category.css mobile-toggle @media', pass: catCss.includes('.mobile-toggle.active') },
  { name: 'pages.css .site-header sticky', pass: pagesCss.includes('position: sticky;') && pagesCss.includes('z-index: 999;') },
  { name: 'pages.css mobile-toggle @media', pass: pagesCss.includes('.mobile-toggle.active') },
  { name: 'pages.css mobile site-header 60px', pass: pagesCss.includes('height: 60px !important;') }
];

cssChecks.forEach(c => {
  if (c.pass) {
    console.log(`✅ CSS: ${c.name}`);
  } else {
    allPassed = false;
    console.error(`❌ CSS: ${c.name}`);
  }
});

if (allPassed) {
  console.log('\n🎉 ALL AUDIT CHECKS PASSED PERFECTLY!');
} else {
  console.log('\n⚠️ Some checks failed.');
}
