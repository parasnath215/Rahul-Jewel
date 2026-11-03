// Rahul Jewellers - Product Catalog Data
const categories = {
  bracelets: {
    key: 'bracelets',
    title: 'Bracelets Collection | Rahul Jewellers Legacy',
    heading: 'Handcrafted Bracelets',
    banner: '/assets/Banners/Bracelets.png',
    description: 'Timeless gold and diamond bracelets crafted for unforgettable moments. BIS hallmarked purity with certified natural diamonds.',
    count: 15,
    products: [
      {
        id: 'RJ-BR-01',
        title: 'Noor Floral Diamond Cuff Bracelet',
        purity: '18K Rose Gold',
        diamonds: '0.85 ct VVS-EF Natural Diamonds',
        weight: '16.20 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_01.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-BR-02',
        title: 'Symphony Delicate Rose Gold Bangle-Bracelet',
        purity: '18K Rose Gold',
        diamonds: '0.45 ct Brilliant Diamonds',
        weight: '14.85 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_02.jpg',
        tags: ['gold', 'diamond', 'daily']
      },
      {
        id: 'RJ-BR-03',
        title: 'Aura Solitaire Diamond Station Bracelet',
        purity: '18K Yellow Gold',
        diamonds: '1.20 ct Certified Solitaires',
        weight: '18.40 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_03.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-BR-04',
        title: 'Imperial Gold Link Tennis Bracelet',
        purity: '22K BIS Hallmarked Gold',
        diamonds: '1.75 ct VVS Clarity Diamonds',
        weight: '21.10 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_04.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-BR-05',
        title: 'Celestial Multi-Diamond Bypass Bracelet',
        purity: '18K Rose Gold',
        diamonds: '0.90 ct VVS-EF Diamonds',
        weight: '15.60 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_05.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-BR-06',
        title: 'Heritage Filigree Hinged Gold Bracelet',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Plain 916 Antique Finished Gold',
        weight: '24.30 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_06.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-BR-07',
        title: 'Eternity Baguette & Round Diamond Cuff',
        purity: '18K White Gold',
        diamonds: '2.10 ct Baguette & Brilliant Diamonds',
        weight: '19.80 gms',
        cert: 'BIS 100% Certified & IGI Verified',
        image: '/assets/products/bracelets/bracelet_07.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-BR-08',
        title: 'Lattice Openwork Gold Bangle Bracelet',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Hand-chiseled 916 Pure Gold',
        weight: '26.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_08.jpg',
        tags: ['gold', 'gifting']
      },
      {
        id: 'RJ-BR-09',
        title: 'Radiant Channel Diamond Wide Bracelet',
        purity: '18K Rose Gold',
        diamonds: '1.65 ct Precision Channel Set Diamonds',
        weight: '22.50 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_09.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-BR-10',
        title: 'Royal Kundan Beaded Gold Bracelet',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Natural Uncut Polki & Emerald Beads',
        weight: '27.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_10.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-BR-11',
        title: 'Zeenat Marquise Diamond Bracelet',
        purity: '18K Rose Gold',
        diamonds: '1.35 ct Marquise Cut Diamonds',
        weight: '17.20 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_11.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-BR-12',
        title: 'Gilded Ribbon Twisted Rose Gold Bracelet',
        purity: '18K Rose Gold',
        diamonds: '0.60 ct Diamond Pave Highlights',
        weight: '13.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_12.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-BR-13',
        title: 'Pavé Diamond Infinity Knot Bracelet',
        purity: '18K Yellow Gold',
        diamonds: '0.85 ct Micro-Pavé Diamonds',
        weight: '16.20 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bracelets/bracelet_13.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-BR-14',
        title: 'Cascading Brilliance Wave Bracelet',
        purity: '18K White Gold',
        diamonds: '1.80 ct Brilliant Wave Diamonds',
        weight: '18.75 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_14.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-BR-15',
        title: 'Vintage Heirloom 22K Gold Bracelet',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Handmade Solid Link 916 Gold',
        weight: '25.30 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bracelets/bracelet_15.jpg',
        tags: ['gold', 'gifting']
      }
    ]
  },
  bangles: {
    key: 'bangles',
    title: 'Royal Bangles Collection | Rahul Jewellers Legacy',
    heading: 'Royal Heritage Bangles & Kadas',
    banner: '/assets/Banners/Bangles.png',
    description: 'Heritage kadas, polki temple bangles, and meenakari gold artisan cuffs crafted with heirloom finesse.',
    count: 9,
    products: [
      {
        id: 'RJ-BG-01',
        title: 'Polki Temple Royal Kada Bangle',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Uncut Natural Polki & Rubies',
        weight: '34.20 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_01.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-BG-02',
        title: 'Imperial Rose Gold Diamond Bangle',
        purity: '18K Rose Gold',
        diamonds: '1.50 ct Certified Diamonds',
        weight: '28.50 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bangles/bangles_02.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-BG-03',
        title: 'Heritage 22K Navratna Gold Bangle',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Natural Certified Gemstones & Gold',
        weight: '31.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_03.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-BG-04',
        title: 'Aura Dual Tone Geometric Bangle',
        purity: '18K Dual-Tone Gold',
        diamonds: '0.75 ct VVS-EF Diamonds',
        weight: '22.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_04.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-BG-05',
        title: 'Nizam Kundan Jadau Bangle Pair',
        purity: '22K Antique Finish Gold',
        diamonds: 'Traditional Jadau Polki Work',
        weight: '42.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_05.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-BG-06',
        title: 'Meenakari Handcrafted Gold Kada',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Handmade Enamel & Floral Filigree',
        weight: '38.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_06.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-BG-07',
        title: 'Classic Filigree Wirework Gold Bangle',
        purity: '22K BIS Hallmarked Gold',
        diamonds: '916 Solid Gold Craft',
        weight: '26.10 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_07.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-BG-08',
        title: 'Regal Fluted 22K Antique Bangle',
        purity: '22K Antique Finish Gold',
        diamonds: 'Oxidized Matte Textured Gold',
        weight: '32.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/bangles/bangles_08.jpg',
        tags: ['gold', 'gifting']
      },
      {
        id: 'RJ-BG-09',
        title: 'Contemporary Diamond Sleek Bangle',
        purity: '18K Rose Gold',
        diamonds: '1.10 ct Round Brilliant Diamonds',
        weight: '19.50 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/bangles/bangles_09.jpg',
        tags: ['diamond', 'daily']
      }
    ]
  },
  necklaces: {
    key: 'necklaces',
    title: 'Necklaces Collection | Rahul Jewellers Legacy',
    heading: 'Heirloom Necklaces & Chokers',
    banner: '/assets/Banners/Necklaces.png',
    description: 'Timeless necklaces adorned with gold and diamonds, designed for unforgettable celebrations and bridal grandeur.',
    count: 9,
    products: [
      {
        id: 'RJ-NC-01',
        title: 'Heritage Kundan Regal Choker',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Uncut Polki & Natural Emeralds',
        weight: '48.50 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_01.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-NC-02',
        title: 'Noor Solitaire Pendant Necklace',
        purity: '18K Yellow Gold',
        diamonds: '1.25 ct Certified Solitaire IGI',
        weight: '14.20 gms',
        cert: 'IGI Certified Natural Solitaire',
        image: '/assets/products/necklaces/necklaces_02.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-NC-03',
        title: 'Nizam Natural Pearl 3-Row Haram',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Basra Pearl Strings & Polki Brooch',
        weight: '62.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_03.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-NC-04',
        title: 'Emerald Bloom Royal Choker Set',
        purity: '22K Temple Gold',
        diamonds: 'Zambian Emeralds & VVS Diamonds',
        weight: '54.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_04.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-NC-05',
        title: 'Aura Cascading Diamond Tennis Necklace',
        purity: '18K White Gold',
        diamonds: '3.50 ct Continuous Brilliant Diamonds',
        weight: '28.80 gms',
        cert: 'SGL Certified Diamond Choker',
        image: '/assets/products/necklaces/necklaces_05.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-NC-06',
        title: 'Devbhoomi Traditional Temple Necklace',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Handmade Solid Temple Motifs',
        weight: '44.50 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_06.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-NC-07',
        title: 'Eternity Floral Collar in 22K Gold',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Micro-Kundan & Red Spinel Accent',
        weight: '38.75 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_07.jpg',
        tags: ['gold', 'gifting']
      },
      {
        id: 'RJ-NC-08',
        title: 'Maharani Jadau Polki Bridal Choker',
        purity: '22K Antique Finish Gold',
        diamonds: 'Bespoke Bridal Polki Craft',
        weight: '72.30 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/necklaces/necklaces_08.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-NC-09',
        title: 'Minimalist Solitaire Drop Gold Necklace',
        purity: '18K Rose Gold',
        diamonds: '0.65 ct Floating Solitaire',
        weight: '9.80 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/necklaces/necklaces_09.jpg',
        tags: ['diamond', 'daily']
      }
    ]
  },
  rings: {
    key: 'rings',
    title: 'Rings Collection | Rahul Jewellers Legacy',
    heading: 'Solitaires & Statement Rings',
    banner: '/assets/Banners/Rings.png',
    description: 'Timeless gold and diamond rings crafted for unforgettable moments. Engagement solitaires, cocktail rings, and eternal bands.',
    count: 9,
    products: [
      {
        id: 'RJ-RG-01',
        title: 'The Kohinoor Oval Solitaire Ring',
        purity: '18K Yellow Gold',
        diamonds: '1.05 ct Oval Solitaire VVS1',
        weight: '6.40 gms',
        cert: 'IGI Certified Natural Solitaire',
        image: '/assets/products/rings/rings_01.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-RG-02',
        title: 'Princess Cut Pavé Halo Diamond Ring',
        purity: '18K White Gold',
        diamonds: '1.50 ct Princess Solitaire + Halo',
        weight: '8.10 gms',
        cert: 'GIA Certified Diamond',
        image: '/assets/products/rings/rings_02.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-RG-03',
        title: 'Imperial 22K Heritage Signet Ring',
        purity: '22K Hallmarked Gold',
        diamonds: 'Solid Gold Hand-Engraved Shield',
        weight: '9.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/rings/rings_03.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-RG-04',
        title: 'Emerald Cut Royal Solitaire Ring',
        purity: 'Platinum 950 & 18K Gold',
        diamonds: '1.75 ct Emerald Cut VVS-EF',
        weight: '7.60 gms',
        cert: 'IGI Certified Solitaire',
        image: '/assets/products/rings/rings_04.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-RG-05',
        title: 'Celestial Multi-Stone Cluster Ring',
        purity: '18K Rose Gold',
        diamonds: '0.80 ct Brilliant Round Diamonds',
        weight: '5.25 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/rings/rings_05.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-RG-06',
        title: 'Aura Twin Heart Diamond Cocktail Ring',
        purity: '18K Rose Gold',
        diamonds: '1.20 ct Dual Heart Cut Diamonds',
        weight: '7.10 gms',
        cert: 'SGL Certified Diamond Ring',
        image: '/assets/products/rings/rings_06.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-RG-07',
        title: 'Meenakari Floral Enamel Gold Ring',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Fine Rajasthani Meenakari Craft',
        weight: '6.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/rings/rings_07.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-RG-08',
        title: 'Vintage Marquise Diamond Eternity Band',
        purity: '18K Yellow Gold',
        diamonds: '1.40 ct Full Circle Marquise Stones',
        weight: '5.80 gms',
        cert: 'BIS 100% Certified & SGL Verified',
        image: '/assets/products/rings/rings_08.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-RG-09',
        title: 'Classic Platinum & 18K Yellow Gold Ring',
        purity: 'Dual Tone Platinum & 18K Gold',
        diamonds: '0.50 ct Center Flush Diamond',
        weight: '8.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/rings/rings_09.jpg',
        tags: ['gold', 'daily']
      }
    ]
  },
  earrings: {
    key: 'earrings',
    title: 'Earrings Collection | Rahul Jewellers Legacy',
    heading: 'Handcrafted Earrings & Jhumkas',
    banner: '/assets/Banners/Earring.png',
    description: 'Sculpted heritage jhumkas, sparkling polki chandbalis, and modern dangles for regal celebrations.',
    count: 9,
    products: [
      {
        id: 'RJ-ER-01',
        title: 'Royal Chandbali Polki Earrings',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Uncut Natural Polki & Pearl Drops',
        weight: '24.50 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_01.jpg',
        tags: ['gold', 'diamond']
      },
      {
        id: 'RJ-ER-02',
        title: 'Grand Heritage Peacock Jhumkas',
        purity: '22K Temple Gold',
        diamonds: 'Enamel Feather Detailing & Rubies',
        weight: '28.20 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_02.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-ER-03',
        title: 'Cascading Solitaire Diamond Drops',
        purity: '18K Rose Gold',
        diamonds: '1.45 ct Linear Diamond Drops',
        weight: '11.80 gms',
        cert: 'SGL Certified Natural Diamonds',
        image: '/assets/products/earrings/earrings_03.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ER-04',
        title: 'Contemporary Dual Circle Gold Dangles',
        purity: '18K Yellow Gold',
        diamonds: '0.70 ct Micro-Pavé Highlights',
        weight: '9.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_04.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ER-05',
        title: 'Imperial Ruby & Pearl Chandelier Drops',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Natural Burmese Rubies & Seed Pearls',
        weight: '21.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_05.jpg',
        tags: ['gold', 'gifting']
      },
      {
        id: 'RJ-ER-06',
        title: 'Sleek Diamond Huggie Hoop Earrings',
        purity: '18K Rose Gold',
        diamonds: '0.55 ct Daily Comfort Hoops',
        weight: '6.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_06.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ER-07',
        title: 'Temple Carved Gold Jhumka with Pearls',
        purity: '22K Antique Finish Gold',
        diamonds: 'Goddess Lakshmi Carved Motifs',
        weight: '22.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_07.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-ER-08',
        title: 'Zeenat Diamond Waterfall Earrings',
        purity: '18K White Gold',
        diamonds: '2.20 ct Flexible Cascading Diamonds',
        weight: '16.50 gms',
        cert: 'IGI Certified Natural Diamonds',
        image: '/assets/products/earrings/earrings_08.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-ER-09',
        title: 'Vintage Filigree Tear-drop Gold Earrings',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Delicate Wire Art & Diamond Beads',
        weight: '14.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/earrings/earrings_09.jpg',
        tags: ['gold', 'daily']
      }
    ]
  },
  studs: {
    key: 'studs',
    title: 'Studs Collection | Rahul Jewellers Legacy',
    heading: 'Diamond & Gold Daily Studs',
    banner: '/assets/Banners/Studs.png',
    description: 'Effortless brilliance for everyday luxury. Certified solitaire studs, floral clusters, and pure hallmarked gold buttons.',
    count: 9,
    products: [
      {
        id: 'RJ-ST-01',
        title: 'Brilliant Solitaire 4-Prong Diamond Studs',
        purity: '18K Rose Gold',
        diamonds: '1.00 ct Pair Certified Solitaires IGI',
        weight: '3.80 gms',
        cert: 'IGI Certified Solitaires',
        image: '/assets/products/studs/studs_01.jpg',
        tags: ['diamond', 'daily', 'gifting']
      },
      {
        id: 'RJ-ST-02',
        title: 'Noor Floral Diamond Cluster Studs',
        purity: '18K Yellow Gold',
        diamonds: '0.75 ct Pair 7-Stone Flower Studs',
        weight: '4.20 gms',
        cert: 'SGL Certified Diamonds',
        image: '/assets/products/studs/studs_02.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ST-03',
        title: 'Imperial 22K Filigree Gold Coin Studs',
        purity: '22K Hallmarked Gold',
        diamonds: 'Pure 916 Embossed Gold Art',
        weight: '5.10 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/studs/studs_03.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-ST-04',
        title: 'Emerald Halo Cushion Diamond Studs',
        purity: '18K White Gold',
        diamonds: 'Natural Colombian Emeralds & Halo',
        weight: '4.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/studs/studs_04.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-ST-05',
        title: 'Princess Cut Flawless Solitaire Studs',
        purity: '18K White Gold',
        diamonds: '1.20 ct Pair Princess Cut VVS1',
        weight: '3.90 gms',
        cert: 'GIA Certified Solitaires',
        image: '/assets/products/studs/studs_05.jpg',
        tags: ['diamond']
      },
      {
        id: 'RJ-ST-06',
        title: 'Contemporary Hexagon Bezel Studs',
        purity: '18K Yellow Gold',
        diamonds: '0.40 ct Geometric Bezel Diamonds',
        weight: '3.50 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/studs/studs_06.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ST-07',
        title: 'Ruby Centered 18K Gold Floral Studs',
        purity: '18K Yellow Gold',
        diamonds: 'Natural Burmese Ruby with Diamond Halo',
        weight: '4.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/studs/studs_07.jpg',
        tags: ['diamond', 'gold']
      },
      {
        id: 'RJ-ST-08',
        title: 'Petite Starburst Diamond Daily Studs',
        purity: '18K Rose Gold',
        diamonds: '0.35 ct Dainty Everyday Starburst',
        weight: '2.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/studs/studs_08.jpg',
        tags: ['diamond', 'daily']
      },
      {
        id: 'RJ-ST-09',
        title: 'Rose Gold Teardrop Diamond Studs',
        purity: '18K Rose Gold',
        diamonds: '0.60 ct Pear Diamond Cluster',
        weight: '3.70 gms',
        cert: 'SGL Certified Diamond Studs',
        image: '/assets/products/studs/studs_09.jpg',
        tags: ['diamond', 'gifting']
      }
    ]
  },
  chains: {
    key: 'chains',
    title: 'Gold Chains Collection | Rahul Jewellers Legacy',
    heading: 'Classic & Heavy Gold Chains',
    banner: '/assets/Banners/chains.png',
    description: 'Precision woven 22K hallmarked chains, solid rope links, and regal men and women everyday essentials.',
    count: 9,
    products: [
      {
        id: 'RJ-CH-01',
        title: 'Heritage Rudraksha Gold Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Panchmukhi Rudraksha with Gold Capping',
        weight: '24.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_01.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-CH-02',
        title: 'Classic 22K Solid Rope Link Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Diamond-Cut Spiraled Solid Links',
        weight: '32.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_02.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-CH-03',
        title: 'Imperial Byzantine Handwoven Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Interlocking Hand-Crafted Byzantine Links',
        weight: '45.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_03.jpg',
        tags: ['gold', 'gifting']
      },
      {
        id: 'RJ-CH-04',
        title: 'Royal Figaro Diamond Cut Gold Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'High-Polish Triple Link Pattern',
        weight: '18.50 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_04.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-CH-05',
        title: 'Traditional Box Link Gold Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Sturdy Smooth Finished Daily Box Links',
        weight: '14.20 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_05.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-CH-06',
        title: 'Sleek Singapore Link 22K Gold Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Twisted Wave Light-Catching Links',
        weight: '11.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_06.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-CH-07',
        title: 'Heavy Cuban Curb Link Men Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Solid Heavyweight Beveled Edge Links',
        weight: '55.00 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_07.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-CH-08',
        title: 'Wheat Spiga Delicate Everyday Chain',
        purity: '18K Yellow Gold',
        diamonds: 'Four-Strand Woven Spiga Finish',
        weight: '8.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_08.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-CH-09',
        title: 'Temple Textured Ball Bead Gold Chain',
        purity: '22K BIS Hallmarked 916 Gold',
        diamonds: 'Hand-Fluted Gold Spheres & Solid Links',
        weight: '28.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/chains/chains_09.jpg',
        tags: ['gold', 'gifting']
      }
    ]
  },
  'fancy-chains': {
    key: 'fancy-chains',
    title: 'Designer Fancy Chains | Rahul Jewellers Legacy',
    heading: 'Designer Italian & Fancy Chains',
    banner: '/assets/Banners/Fancy Chains.png',
    description: 'Italian dual-tone craftsmanship, laser faceted statement links, and modern layering paperclip chains.',
    count: 9,
    products: [
      {
        id: 'RJ-FC-01',
        title: 'Italian Dual-Tone Rose & Yellow Gold Chain',
        purity: '18K Dual-Tone Gold',
        diamonds: 'Precision Italian Machine Crafted Links',
        weight: '15.40 gms',
        cert: 'BIS 100% Certified & Hallmark',
        image: '/assets/products/fancy-chains/fancy-chains_01.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-FC-02',
        title: 'Laser Cut Sparkle Faceted Fancy Chain',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Prism Micro-Facets for Diamond-Like Fire',
        weight: '22.10 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_02.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-FC-03',
        title: 'Geometric Hex Link Modern Designer Chain',
        purity: '18K Yellow Gold',
        diamonds: 'Interlocking Polished Hexagonal Elements',
        weight: '19.60 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_03.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-FC-04',
        title: 'Gilded Paperclip Layering Fancy Chain',
        purity: '18K Rose Gold',
        diamonds: 'Elongated Sleek Contemporary Links',
        weight: '11.80 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_04.jpg',
        tags: ['gold', 'daily', 'gifting']
      },
      {
        id: 'RJ-FC-05',
        title: 'Filigree Hollow Fluted Ball Chain',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Intricate Jaali Spheres & Sleek Strands',
        weight: '26.40 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_05.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-FC-06',
        title: 'Contemporary Bar & Cable Luxury Chain',
        purity: '18K Dual-Tone Gold',
        diamonds: 'Alternate Mirror Bars and Rounded Cables',
        weight: '17.30 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_06.jpg',
        tags: ['gold', 'daily']
      },
      {
        id: 'RJ-FC-07',
        title: 'Diamond Accent Dual Strand Fancy Chain',
        purity: '18K Rose Gold',
        diamonds: '0.25 ct Diamond Accent Charm',
        weight: '14.80 gms',
        cert: 'SGL Certified Diamond Accent',
        image: '/assets/products/fancy-chains/fancy-chains_07.jpg',
        tags: ['diamond', 'gifting']
      },
      {
        id: 'RJ-FC-08',
        title: 'Chevron Textured High-Polish Chain',
        purity: '22K BIS Hallmarked Gold',
        diamonds: 'Directional Textured Arrowhead Links',
        weight: '24.10 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_08.jpg',
        tags: ['gold']
      },
      {
        id: 'RJ-FC-09',
        title: 'Artisan Twisted Ribbon Fancy Chain',
        purity: '18K Rose & White Gold',
        diamonds: 'Continuous Spiral Dual Finish',
        weight: '16.90 gms',
        cert: 'BIS 100% Certified',
        image: '/assets/products/fancy-chains/fancy-chains_09.jpg',
        tags: ['gold', 'daily']
      }
    ]
  }
};

module.exports = {
  categories,
  categoryList: Object.values(categories)
};

