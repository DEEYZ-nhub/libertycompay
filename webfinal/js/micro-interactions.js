// Advanced Micro-Interactions & Animations Module
// Enhances UX with smooth transitions, haptic feedback simulation, and visual polish

(function() {
  const config = {
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersLight: window.matchMedia('(prefers-color-scheme: light)').matches,
    touchEnabled: () => window.matchMedia('(pointer: coarse)').matches
  };

  function init() {
    setupMicroInteractions();
    setupAnimationTiming();
    setupAccessibility();
    monitorUserPreferences();
  }

  function setupMicroInteractions() {
    // Button ripple effect (if not reduced motion)
    if (!config.reduceMotion) {
      document.addEventListener('click', (e) => {
        const button = e.target.closest('button, a[class*="btn"]');
        if (!button) return;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        // Add position relative to button if needed
        if (window.getComputedStyle(button).position === 'static') {
          button.style.position = 'relative';
        }

        button.appendChild(ripple);

        // Remove ripple after animation
        ripple.addEventListener('animationend', () => {
          ripple.remove();
        }, { once: true });
      }, true);
    }

    // Smooth hover states on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, select');
    interactives.forEach(el => {
      if (!config.reduceMotion) {
        el.addEventListener('mousedown', () => {
          el.style.transform = 'scale(0.98)';
        });
        el.addEventListener('mouseup', () => {
          el.style.transform = '';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      }
    });
  }

  function setupAnimationTiming() {
    // Stagger animations for list items
    document.querySelectorAll('[data-stagger]').forEach((container) => {
      const items = container.querySelectorAll('[data-stagger-item]');
      items.forEach((item, idx) => {
        item.style.setProperty('--stagger-delay', `${idx * 0.05}s`);
        item.style.animation = `slideInUp 0.6s ease-out forwards`;
        item.style.animationDelay = `${idx * 0.05}s`;
      });
    });

    // Add keyframes if not exist
    if (!document.querySelector('style[data-animation="slideInUp"]')) {
      const style = document.createElement('style');
      style.setAttribute('data-animation', 'slideInUp');
      style.textContent = `
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function setupAccessibility() {
    // Respect prefers-reduced-motion
    if (config.reduceMotion) {
      // Disable animations
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animation = 'none';
      });
    } else {
      document.documentElement.style.setProperty('--animation-duration', '300ms');
    }

    // Announce interactions to screen readers
    document.addEventListener('focus', (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' && !target.getAttribute('aria-label')) {
        const label = target.textContent.trim();
        if (label) {
          target.setAttribute('aria-label', label);
        }
      }
    }, true);
  }

  function setupTooltips() {
    // Create tooltip element
    const tip = document.createElement('div');
    tip.className = 'lc-tooltip';
    document.body.appendChild(tip);

    let activeTimer = null;

    function showTooltipFor(el, text) {
      if (!text) return;
      tip.textContent = text;
      tip.classList.add('show');
      const rect = el.getBoundingClientRect();
      const top = rect.top - 10 - tip.offsetHeight;
      const left = Math.min(window.innerWidth - tip.offsetWidth - 12, Math.max(12, rect.left + (rect.width / 2) - (tip.offsetWidth / 2)));
      tip.style.top = (top < 8 ? rect.bottom + 10 : top) + 'px';
      tip.style.left = left + 'px';
      if (activeTimer) clearTimeout(activeTimer);
      activeTimer = setTimeout(() => { tip.classList.remove('show'); }, 3500);
    }

    function hideTooltip() {
      tip.classList.remove('show');
      if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
    }

    // Generic hover tooltips from data-tooltip attribute
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-tooltip], .add-to-cart');
      if (!el) return;
      // If add-to-cart and not logged, show login hint
      if (el.classList && el.classList.contains('add-to-cart')) {
        let text = 'Agregar al carrito';
        try {
          if (typeof isUserLoggedIn === 'function' && !isUserLoggedIn()) {
            text = 'Inicia sesión para agregar al carrito';
          }
        } catch (err) {
          // ignore
        }
        showTooltipFor(el, text);
        return;
      }

      const tiptext = el.getAttribute('data-tooltip');
      if (tiptext) showTooltipFor(el, tiptext);
    });

    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest('[data-tooltip], .add-to-cart');
      if (!el) return;
      hideTooltip();
    });

    // For touch devices, show tooltip on first tap (short-lived)
    document.addEventListener('touchstart', (e) => {
      const el = e.target.closest('[data-tooltip], .add-to-cart');
      if (!el) return;
      const tiptext = el.classList.contains('add-to-cart') ? (typeof isUserLoggedIn === 'function' && !isUserLoggedIn() ? 'Inicia sesión para agregar al carrito' : 'Agregar al carrito') : el.getAttribute('data-tooltip');
      if (tiptext) showTooltipFor(el, tiptext);
    });
  }

  function setupScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elems = document.querySelectorAll('.pack-card, .promo-card, .floating-card, .hero-lottie, img.floaty');
    if (!('IntersectionObserver' in window)) {
      elems.forEach(el => el.classList.add('slide-up'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
          // if floaty image, also add floaty animation
          if (entry.target.tagName === 'IMG' || entry.target.classList.contains('floaty')) {
            entry.target.classList.add('floaty');
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    elems.forEach(el => io.observe(el));
  }

  function monitorUserPreferences() {
    // Watch for motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', () => {
      location.reload(); // Reload to apply new preferences
    });

    // Watch for color scheme changes
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorQuery.addEventListener('change', () => {
      // Could trigger theme update here
      document.documentElement.style.setProperty('--theme-changed', 'true');
    });
  }

  // Initialize tooltips and scroll-based animations
  function setupExtraMicro() {
    try { setupTooltips(); } catch (e) { /* noop */ }
    try { setupScrollAnimations(); } catch (e) { /* noop */ }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); setupExtraMicro(); });
  } else {
    init(); setupExtraMicro();
  }

  // Expose API
  window.MicroInteractions = {
    config,
    getState: () => ({ reduceMotion: config.reduceMotion, touchEnabled: config.touchEnabled() })
  };
})();

// ===== ADVANCED PERFORMANCE OPTIMIZATIONS =====

// Lazy loading images with LQIP effect
document.querySelectorAll('img[data-src]').forEach(img => {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const src = entry.target.dataset.src;
        entry.target.src = src;
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });
  obs.observe(img);
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update active nav item
      document.querySelectorAll('.nav-link.active').forEach(el => {
        el.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section, .card, .product-card, .feature').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  fadeInObserver.observe(el);
});

// ===== ENHANCED FORM INTERACTIONS =====

class SmartForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    this.setupValidation();
    this.setupAutoSave();
  }

  setupValidation() {
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('change', () => this.validateField(field));
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    const feedback = field.parentElement.querySelector('.feedback');
    
    if (field.value) {
      if (isValid) {
        field.style.borderColor = '#10b981';
        field.classList.add('valid');
        if (feedback) feedback.style.color = '#10b981';
      } else {
        field.style.borderColor = '#ef4444';
        field.classList.remove('valid');
        if (feedback) feedback.style.color = '#ef4444';
      }
    }
  }

  setupAutoSave() {
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('change', () => {
        const key = `form_${this.form.id}_${field.name}`;
        try {
          localStorage.setItem(key, field.value);
        } catch (e) { /* storage full */ }
      });

      // Restore saved data
      const key = `form_${this.form.id}_${field.name}`;
      const saved = localStorage.getItem(key);
      if (saved) field.value = saved;
    });
  }
}

// Initialize smart forms
document.querySelectorAll('form[id]').forEach(form => {
  new SmartForm(`#${form.id}`);
});

// ===== PAGE PERFORMANCE MONITORING =====

if ('PerformanceObserver' in window) {
  try {
    // Monitor largest contentful paint
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.debug('Performance:', entry.name, entry.duration + 'ms');
      }
    });
    perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
  } catch (e) { /* not supported */ }
}

// ===== ADVANCED SCROLL EFFECTS =====

class ScrollEffects {
  constructor() {
    this.scrollY = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      this.applyScrollEffects();
    }, { passive: true });
  }

  applyScrollEffects() {
    // Parallax effect on hero
    const hero = document.querySelector('.hero');
    if (hero && this.scrollY < 1000) {
      const offset = this.scrollY * 0.5;
      hero.style.transform = `translateY(${offset}px)`;
    }

    // Fade nav on scroll
    const nav = document.querySelector('nav');
    if (nav) {
      if (this.scrollY > 100) {
        nav.style.background = 'rgba(15, 23, 32, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
      } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
      }
    }

    // Show scroll-to-top button
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
      if (this.scrollY > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.pointerEvents = 'auto';
      } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.pointerEvents = 'none';
      }
    }
  }
}

new ScrollEffects();

// ===== RESPONSIVE BREAKPOINT DETECTOR =====

class ResponsiveDetector {
  constructor() {
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      wide: 1440
    };
    this.currentBreakpoint = this.detectBreakpoint();
    this.init();
  }

  detectBreakpoint() {
    const width = window.innerWidth;
    if (width < this.breakpoints.mobile) return 'mobile';
    if (width < this.breakpoints.tablet) return 'tablet';
    if (width < this.breakpoints.desktop) return 'desktop';
    if (width < this.breakpoints.wide) return 'wide';
    return 'ultra';
  }

  init() {
    window.addEventListener('resize', () => {
      const newBreakpoint = this.detectBreakpoint();
      if (newBreakpoint !== this.currentBreakpoint) {
        this.currentBreakpoint = newBreakpoint;
        window.dispatchEvent(new CustomEvent('breakpointChange', {
          detail: { breakpoint: newBreakpoint }
        }));
      }
    }, { passive: true });
  }
}

window.ResponsiveDetector = new ResponsiveDetector();

// ===== DARK MODE TOGGLE =====

class DarkModeToggle {
  constructor() {
    this.isDark = localStorage.getItem('dark-mode') === 'true' || 
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.init();
  }

  init() {
    this.apply();
    document.addEventListener('DOMContentLoaded', () => {
      const toggle = document.querySelector('[data-dark-mode-toggle]');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle());
      }
    });
  }

  toggle() {
    this.isDark = !this.isDark;
    localStorage.setItem('dark-mode', this.isDark);
    this.apply();
  }

  apply() {
    const html = document.documentElement;
    if (this.isDark) {
      html.style.colorScheme = 'dark';
    } else {
      html.style.colorScheme = 'light';
    }
  }
}

new DarkModeToggle();

// ===== NETWORK STATUS DETECTOR =====


window.addEventListener('online', () => {
  console.log('Connection restored ✓');
  const toast = document.createElement('div');
  toast.textContent = '✓ Conexión restaurada';
  toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;animation:slideInUp 0.3s ease-out;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  const toast = document.createElement('div');
  toast.textContent = '⚠ Sin conexión (modo offline)';
  toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ef4444;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;';
  document.body.appendChild(toast);
});

// FAQ Accordion Functionality
(function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    // Set initial state
    answer.style.display = 'none';
    
    question.addEventListener('click', () => {
      const isOpen = question.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        
        if (otherQuestion && otherAnswer && otherItem !== item) {
          otherQuestion.classList.remove('active');
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.style.display = 'none';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        question.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.display = 'none';
      } else {
        question.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.display = 'block';
      }
    });
    
    // Keyboard navigation (Enter/Space)
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
})();

