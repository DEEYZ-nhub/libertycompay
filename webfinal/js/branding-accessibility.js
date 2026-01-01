// Accessibility: Tooltip and keyboard navigation within Branding Panel
(function(){
  function initBrandingAccessibility() {
    const symbol = document.getElementById('branding-symbol');
    const tooltip = document.getElementById('branding-symbol-tooltip');
    const itemsContainer = document.querySelector('.branding-items');

    // Main symbol tooltip
    if (symbol && tooltip) {
      tooltip.hidden = true;
      tooltip.setAttribute('aria-hidden', 'true');

      const showTooltip = () => { tooltip.hidden = false; tooltip.setAttribute('aria-hidden','false'); };
      const hideTooltip = () => { tooltip.hidden = true; tooltip.setAttribute('aria-hidden','true'); };

      symbol.addEventListener('mouseenter', showTooltip);
      symbol.addEventListener('mouseleave', hideTooltip);
      symbol.addEventListener('focus', showTooltip);
      symbol.addEventListener('blur', hideTooltip);

      // keyboard reveal (Enter/Space shows for 3s, Escape hides)
      symbol.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          showTooltip();
          setTimeout(hideTooltip, 3000);
        }
        if (ev.key === 'Escape' || ev.key === 'Esc') {
          hideTooltip();
        }
      });
    }

    // Item tooltips
    if (itemsContainer) {
      const items = Array.from(itemsContainer.querySelectorAll('.branding-item'));
      
      items.forEach((it, idx) => {
        if (!it.hasAttribute('tabindex')) it.setAttribute('tabindex', '0');
        
        // Find and configure item's tooltip
        const itemTooltip = it.querySelector('[role="tooltip"]');
        if (itemTooltip) {
          itemTooltip.hidden = true;
          itemTooltip.setAttribute('aria-hidden', 'true');

          const showItemTooltip = () => { itemTooltip.hidden = false; itemTooltip.setAttribute('aria-hidden','false'); };
          const hideItemTooltip = () => { itemTooltip.hidden = true; itemTooltip.setAttribute('aria-hidden','true'); };

          // Show on hover
          it.addEventListener('mouseenter', showItemTooltip);
          it.addEventListener('mouseleave', hideItemTooltip);
          
          // Show on focus, hide on blur
          it.addEventListener('focus', showItemTooltip);
          it.addEventListener('blur', hideItemTooltip);

          // Keyboard control for tooltip
          it.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
              if (ev.target === it) {
                ev.preventDefault();
                showItemTooltip();
                setTimeout(hideItemTooltip, 3000);
              }
            }
            if (ev.key === 'Escape' || ev.key === 'Esc') {
              hideItemTooltip();
            }
          });
        }

        // Arrow key navigation between items
        it.addEventListener('keydown', (ev) => {
          if (ev.key === 'ArrowRight') {
            ev.preventDefault();
            const next = items[(idx + 1) % items.length];
            next && next.focus();
          } else if (ev.key === 'ArrowLeft') {
            ev.preventDefault();
            const prev = items[(idx - 1 + items.length) % items.length];
            prev && prev.focus();
          } else if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
            // Only trigger link if we're not showing tooltip
            if (ev.target === it && !ev.ctrlKey && !ev.metaKey) {
              // Allow natural link behavior
              return;
            }
          }
        });
      });

      // Container-level arrow navigation for robustness
      itemsContainer.addEventListener('keydown', (ev) => {
        if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
        const active = document.activeElement;
        const idx = items.indexOf(active);
        if (idx >= 0) {
          ev.preventDefault();
          const target = ev.key === 'ArrowRight' ? items[(idx + 1) % items.length] : items[(idx - 1 + items.length) % items.length];
          target && target.focus();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrandingAccessibility);
  } else {
    initBrandingAccessibility();
  }
})();
