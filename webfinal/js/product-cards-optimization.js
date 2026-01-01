// Product Cards Optimization - Enhanced Accessibility, Performance & UX
// This module improves product card experience with keyboard nav, lazy loading, and state management

(function() {
  const state = {
    cardsInitialized: new WeakSet(),
    imageObserver: null
  };

  function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
      // Skip if already initialized
      if (state.cardsInitialized.has(card)) return;
      state.cardsInitialized.add(card);

      // 1. Enhanced keyboard accessibility
      card.addEventListener('keydown', (ev) => {
        // Space/Enter to trigger "Comprar Ahora" button
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target === card) {
          ev.preventDefault();
          const buyBtn = card.querySelector('.btn-primary');
          if (buyBtn) {
            buyBtn.focus();
            buyBtn.click();
          }
        }
      });

      // 2. Improve button focus trap (Tab navigation within card)
      const buttons = card.querySelectorAll('a, button');
      if (buttons.length > 0) {
        const firstBtn = buttons[0];
        const lastBtn = buttons[buttons.length - 1];
        
        lastBtn.addEventListener('keydown', (ev) => {
          if (ev.key === 'Tab' && !ev.shiftKey) {
            ev.preventDefault();
            firstBtn.focus();
          }
        });
        
        firstBtn.addEventListener('keydown', (ev) => {
          if (ev.key === 'Tab' && ev.shiftKey) {
            ev.preventDefault();
            lastBtn.focus();
          }
        });
      }

      // 3. Add aria-label if product title exists
      const title = card.querySelector('.product-info h3');
      if (title && !card.hasAttribute('aria-label')) {
        const titleText = title.textContent;
        const price = card.querySelector('.price-amount')?.textContent || 'Precio no disponible';
        card.setAttribute('aria-label', `${titleText}. ${price}`);
        card.setAttribute('role', 'article');
      }

      // 4. Add data-index for styling and tracking
      if (!card.hasAttribute('data-index')) {
        card.setAttribute('data-index', index);
      }

      // 5. Loading state indicator
      const productImage = card.querySelector('.product-image img');
      if (productImage) {
        // Add loading class
        card.classList.add('loading');
        
        // Listen for image load
        const handleImageLoad = () => {
          card.classList.remove('loading');
          card.classList.add('loaded');
          productImage.removeEventListener('load', handleImageLoad);
          productImage.removeEventListener('error', handleImageError);
        };
        
        const handleImageError = () => {
          card.classList.remove('loading');
          card.classList.add('error');
          productImage.removeEventListener('load', handleImageLoad);
          productImage.removeEventListener('error', handleImageError);
        };

        if (productImage.complete) {
          // Image is cached or error already occurred
          setTimeout(() => {
            if (productImage.naturalHeight === 0) {
              handleImageError();
            } else {
              handleImageLoad();
            }
          }, 0);
        } else {
          productImage.addEventListener('load', handleImageLoad);
          productImage.addEventListener('error', handleImageError);
        }
      }

      // 6. Add hover effect feedback
      card.addEventListener('mouseenter', () => {
        card.style.setProperty('--card-hover', 'true', 'important');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--card-hover', 'false', 'important');
      });
    });

    // 7. Intersection Observer for lazy loading images
    if (!state.imageObserver) {
      state.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src && !img.dataset.loaded) {
              img.src = img.dataset.src;
              img.dataset.loaded = 'true';
              // Optional: add fade-in animation
              img.style.animation = 'fadeIn 0.4s ease-in';
            }
          }
        });
      }, { rootMargin: '100px' });

      // Observe all product images
      document.querySelectorAll('.product-card .product-image img').forEach(img => {
        state.imageObserver.observe(img);
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductCards);
  } else {
    initProductCards();
  }

  // Watch for dynamically added products
  const mutationObserver = new MutationObserver((mutations) => {
    let shouldReinit = false;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldReinit = true;
      }
    });
    if (shouldReinit) {
      initProductCards();
    }
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Expose API for external use
  window.ProductCardsOptimization = {
    reinitialize: initProductCards,
    getState: () => state
  };
})();
