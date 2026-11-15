// Rahul Jewellers - Category & Catalog Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    function toggleMenu(forceState) {
      const isOpen = forceState !== undefined ? forceState : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header') && !e.target.closest('.nav-menu')) {
        toggleMenu(false);
      }
    });
  }

  // Quick View Modal Elements
  const modalOverlay = document.getElementById('quickViewModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalProductImg');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalCat = document.getElementById('modalProductCategory');
  const modalPurity = document.getElementById('modalProductPurity');
  const modalDiamonds = document.getElementById('modalProductDiamonds');
  const modalWeight = document.getElementById('modalProductWeight');
  const modalCert = document.getElementById('modalProductCert');
  const modalWhatsapp = document.getElementById('modalWhatsappBtn');

  // Open Modal function
  window.openQuickView = function(cardElement) {
    if (!modalOverlay) return;
    const id = cardElement.dataset.id || '';
    const title = cardElement.dataset.title || 'Rahul Jewellers Heirloom Creation';
    const category = cardElement.dataset.category || 'Fine Jewellery';
    const purity = cardElement.dataset.purity || '18K / 22K Hallmarked Gold';
    const diamonds = cardElement.dataset.diamonds || 'VVS-EF Natural Certified Diamonds';
    const weight = cardElement.dataset.weight || '14.50 gms Approx';
    const cert = cardElement.dataset.cert || 'BIS Hallmark & SGL / IGI Certified';
    const imgEl = cardElement.querySelector('img.product-img');
    const imgSrc = imgEl ? imgEl.src : '';

    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) modalCat.textContent = id ? `${category} • Ref: ${id}` : category;
    if (modalPurity) modalPurity.textContent = purity;
    if (modalDiamonds) modalDiamonds.textContent = diamonds;
    if (modalWeight) modalWeight.textContent = weight;
    if (modalCert) modalCert.textContent = cert;

    if (modalWhatsapp) {
      const refPart = id ? ` (Ref: ${id})` : '';
      const waText = encodeURIComponent(`Hello Rahul Jewellers Concierge, I would like to inquire about this piece: ${title}${refPart} (${category}, ${purity}). Please share pricing and availability.`);
      modalWhatsapp.href = `https://wa.me/919616905999?text=${waText}`;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close Modal
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach card click handlers
  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openQuickView(card);
    });
  });

  // Subnav filtering and progressive load more logic
  const subnavItems = document.querySelectorAll('.subnav-item[data-filter]');
  const cards = document.querySelectorAll('.product-card');
  const countBadge = document.getElementById('catalogCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const loadMoreWrap = document.getElementById('loadMoreWrap');

  const PAGE_SIZE = 12;
  let visibleLimit = PAGE_SIZE;

  function applyFilterAndPaging(filter = 'all', resetPaging = false) {
    if (resetPaging) {
      visibleLimit = PAGE_SIZE;
    }

    let matchingCards = [];
    cards.forEach(card => {
      const cardTags = (card.dataset.tags || '').toLowerCase();
      if (filter === 'all' || cardTags.includes(filter.toLowerCase())) {
        matchingCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    matchingCards.forEach((card, index) => {
      if (!loadMoreBtn || index < visibleLimit) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `${matchingCards.length} Designs Available`;
    }

    if (loadMoreWrap && loadMoreBtn) {
      if (matchingCards.length <= visibleLimit) {
        loadMoreWrap.style.display = 'none';
      } else {
        loadMoreWrap.style.display = 'flex';
        const btnText = loadMoreBtn.querySelector('span');
        if (btnText) {
          btnText.textContent = `Load More Designs (${visibleLimit} of ${matchingCards.length})`;
        }
      }
    }
  }

  // Initialize load more state if button exists
  if (loadMoreBtn) {
    applyFilterAndPaging('all', true);

    loadMoreBtn.addEventListener('click', () => {
      visibleLimit += PAGE_SIZE;
      const currentActive = document.querySelector('.subnav-item.active[data-filter]');
      const activeFilter = currentActive ? currentActive.dataset.filter : 'all';
      applyFilterAndPaging(activeFilter, false);
    });
  }

  subnavItems.forEach(item => {
    item.addEventListener('click', () => {
      const filter = item.dataset.filter;
      if (!filter) return;

      subnavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      applyFilterAndPaging(filter, true);
    });
  });
});

