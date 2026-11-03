# Rahul Jewellers Legacy - Node.js Express Application

A complete luxury Indian jewellery multi-page website and dynamic product catalog built with **Node.js**, **Express**, and **EJS**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Server
```bash
# Production mode
npm start

# Development mode with hot-reloading (Node.js 18+)
npm run dev
```

The application will start at:
👉 **http://localhost:3000**

### 3. Run Automated Test Suite
```bash
npm test
```

---

## 💎 Features

- **Full Multi-Page Architecture**:
  - Landing Page (`/`): Hero, Live Gold Rates, Curated Collections Mosaic, Diamond Choker Banner, Marks of Excellence, Swarn Sanchay Scheme, 8 Featured Cards Carousel, Social Video Reels, Testimonials, Store Map, and Grand Palace Line-Art Footer.
  - About Us Page (`/about`): Heritage narrative, two-column story grids with high-resolution imagery, brand values, and royal journey timeline.
  - Contact Us Page (`/contact`): Flagship showroom details, Nilmatha Bazar address, direct WhatsApp chat, opening hours, interactive inquiry form (`POST /api/inquiry`), and full-width satellite map.
  - Product Detail Page (`/product`): The Royal Noor Polki & Zambian Emerald Choker with interactive image gallery switcher, 22KT Royal Gold vs 18KT Rose Gold metal selector, Bespoke Commission Enquiry modal, and trust assurance grid.
  - 8 Dedicated Category Pages (`/collections/:category`): Bangles, Bracelets, Chains, Earrings, Fancy Chains, Necklaces, Rings, Studs.
- **100% Mobile Optimized**: Fully responsive layout matching modern mobile viewports (390px+), including mobile navigation drawer, vertical hero stacking, floating translucent trust badge pill, 2-column product grid, and side-by-side vertical reels.
- **1:1 Design Parity**: Built to exactly match reference designs down to typography, 44px emerald top bar, 76px sticky nav, 1440x577 hero banners, 8-icon gold subnav bar, 3-column 1px border card grid, and hover "VIEW ITEM →" button.
- **Quick-View Product Modal**: Real-time product details popup with BIS Hallmark specifications, diamond certification (VVS-EF), weight, and one-click WhatsApp concierge inquiry (`+91 96169 05999`).
- **Dynamic Catalog & Live Rates**: Centralized in `data/catalog.js` and `data/rates.js`.
- **RESTful API**: JSON endpoints for catalog data, single category products, live rates, and customer inquiry submissions.

---

## 🌐 Routes & Endpoints

### HTML Pages & Views
| Route | Static File | Description |
| :--- | :--- | :--- |
| `GET /` | `index.html` | Home / Landing Page |
| `GET /about` | `about.html` | About Us & Brand Heritage |
| `GET /contact` | `contact.html` | Contact Showroom, Store Address & Form |
| `GET /product` | `product.html` | The Royal Noor Polki Choker Detail Page |
| `GET /collections/bracelets` | `bracelets.html` | Handcrafted Bracelets (15 authentic designs) |
| `GET /collections/bangles` | `bangles.html` | Royal Heritage Bangles & Kadas |
| `GET /collections/necklaces` | `necklaces.html` | Heirloom Necklaces & Chokers |
| `GET /collections/rings` | `rings.html` | Solitaires & Statement Rings |
| `GET /collections/earrings` | `earrings.html` | Handcrafted Earrings & Jhumkas |
| `GET /collections/studs` | `studs.html` | Diamond & Gold Daily Studs |
| `GET /collections/chains` | `chains.html` | Classic & Heavy Gold Chains |
| `GET /collections/fancy-chains` | `fancy-chains.html` | Designer Italian & Fancy Chains |

### Friendly Aliases & Backwards Compatibility
- Direct slugs: `GET /about.html` &rarr; `301 /about`
- `GET /contact.html` &rarr; `301 /contact`
- `GET /product.html` &rarr; `301 /product`
- `GET /bracelets` &rarr; `301 /collections/bracelets`
- `GET /bracelets.html` &rarr; `301 /collections/bracelets`

### REST API Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/catalog` | `GET` | Returns all 8 categories and full product list |
| `/api/catalog/:category` | `GET` | Returns products and specifications for a given category |
| `/api/rates` | `GET` | Returns current gold (24K, 22K, 18K) and silver market rates |
| `/api/inquiry` | `POST` | Submits a customer concierge product inquiry |
| `/health` | `GET` | Health check and server uptime |

---

## 📂 Project Structure

```
├── server.js              # Express app setup, routes, static middleware, and API
├── package.json           # Dependencies and npm scripts
├── test-server.js         # Automated end-to-end HTTP test suite
├── data/
│   ├── catalog.js         # Centralized product catalog (8 categories, 78+ products)
│   └── rates.js           # Live gold and silver rates
├── views/
│   ├── index.ejs          # Main landing page template
│   ├── category.ejs       # Dynamic category catalog template
│   └── partials/
│       ├── top-bar.ejs    # 44px top announcement bar
│       ├── header.ejs     # Sticky navigation & Collection dropdown
│       ├── subnav.ejs     # 8 gold vector icon filter bar
│       ├── product-card.ejs # 1px border card with VIEW ITEM button
│       ├── modal.ejs      # Quick View detail popup
│       └── footer.ejs     # Grand palace line-art footer
├── assets/                # Banners, logos, icons, and product photos
├── css/                   # Stylesheets (category.css)
└── js/                    # Client-side scripts (modal and filter logic)
```

