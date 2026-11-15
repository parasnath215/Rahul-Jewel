// Rahul Jewellers Legacy - Global Header & Navigation Interactivity
(function() {
  function initHeader() {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;

    const mobileToggle = siteHeader.querySelector('.mobile-toggle');
    const navMenu = siteHeader.querySelector('.nav-menu');
    const dropdownItem = siteHeader.querySelector('.nav-item-dropdown');
    const dropdownToggle = dropdownItem ? dropdownItem.querySelector('.dropdown-toggle') : null;

    if (!mobileToggle || !navMenu) return;

    function toggleMenu(forceState) {
      const isOpen = forceState !== undefined ? forceState : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // If closing mobile menu, also collapse the collection sub-menu
      if (!isOpen && dropdownItem) {
        dropdownItem.classList.remove('open');
      }
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Mobile Collection Dropdown Toggle
    if (dropdownItem && dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        // On mobile screen (or when nav-menu is open in mobile drawer)
        if (window.innerWidth <= 768 || navMenu.classList.contains('open')) {
          e.preventDefault();
          e.stopPropagation();
          dropdownItem.classList.toggle('open');
        }
      });
    }

    // Sub-menu category links: clicking navigates and closes the mobile menu
    if (dropdownItem) {
      dropdownItem.querySelectorAll('.dropdown-menu a').forEach(catLink => {
        catLink.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            toggleMenu(false);
          }
        });
      });
    }

    // Direct nav links (Home, About Us, Gold Rates, Contact)
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
