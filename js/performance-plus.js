// ===== PERFORMANCE & UX ENHANCEMENTS =====
// Advanced optimizations for 10/10 website

(function() {
  'use strict';

  // ===== 1. REQUEST ANIMATION FRAME THROTTLING =====
  
  class Throttler {
    constructor(callback, delay = 16) {
      this.callback = callback;
      this.delay = delay;
      this.last = 0;
      this.rafId = null;
    }

    execute(...args) {
      const now = Date.now();
      if (now - this.last > this.delay) {
        this.last = now;
        this.callback(...args);
      } else {
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => this.callback(...args));
      }
    }
  }

  // ===== 2. VIEWPORT VISIBILITY DETECTOR =====

  class ViewportDetector {
    constructor(selector, callback, options = {}) {
      this.elements = document.querySelectorAll(selector);
      this.callback = callback;
      this.options = { threshold: 0.1, ...options };
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.callback(entry.target, 'enter');
            } else {
              this.callback(entry.target, 'exit');
            }
          });
        },
        this.options
      );
      this.init();
    }

    init() {
      this.elements.forEach(el => this.observer.observe(el));
    }

    destroy() {
      this.observer.disconnect();
    }
  }

  // ===== 3. ENHANCED CLICK FEEDBACK =====

  class ClickFeedback {
    static init() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"]');
        if (!target) return;

        // Visual feedback
        target.style.transform = 'scale(0.98)';
        setTimeout(() => {
          target.style.transform = 'scale(1)';
        }, 100);

        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }, { passive: true });
    }
  }

  ClickFeedback.init();

  // ===== 4. SMART LOADING STATES =====

  class SmartLoader {
    static show(element = document.body, message = 'Cargando...') {
      const loader = document.createElement('div');
      loader.className = 'smart-loader';
      loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>${message}</p>
      `;
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 32, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
      `;
      document.body.appendChild(loader);
      return loader;
    }

    static hide(loader) {
      if (loader) {
        loader.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => loader.remove(), 300);
      }
    }
  }

  window.SmartLoader = SmartLoader;

  // ===== 5. DEBOUNCER UTILITY =====

  class Debouncer {
    constructor(func, delay = 300) {
      this.func = func;
      this.delay = delay;
      this.timeout = null;
    }

    execute(...args) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.func(...args);
      }, this.delay);
    }

    clear() {
      clearTimeout(this.timeout);
    }
  }

  window.Debouncer = Debouncer;

  // ===== 6. MEMORY LEAK PREVENTION =====

  const cleanup = {
    listeners: [],
    intervals: [],
    timeouts: [],

    addEventListener(el, event, handler) {
      el.addEventListener(event, handler);
      this.listeners.push({ el, event, handler });
    },

    setInterval(fn, delay) {
      const id = setInterval(fn, delay);
      this.intervals.push(id);
      return id;
    },

    setTimeout(fn, delay) {
      const id = setTimeout(fn, delay);
      this.timeouts.push(id);
      return id;
    },

    clearAll() {
      this.listeners.forEach(({ el, event, handler }) => {
        el.removeEventListener(event, handler);
      });
      this.intervals.forEach(id => clearInterval(id));
      this.timeouts.forEach(id => clearTimeout(id));
    }
  };

  window.addEventListener('beforeunload', () => cleanup.clearAll());

  // ===== 7. COOKIE BANNER WITH CONSENT =====

  class CookieConsent {
    constructor() {
      this.key = 'cookie-consent-given';
      this.init();
    }

    init() {
      if (!localStorage.getItem(this.key)) {
        this.show();
      }
    }

    show() {
      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(15, 23, 32, 0.95);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(0, 242, 255, 0.2);
        padding: 1.5rem 2rem;
        z-index: 8999;
        animation: slideInUp 0.4s ease-out;
      `;
      banner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap;">
          <div>
            <p style="color: #f5f7fa; margin-bottom: 0.5rem;">🍪 Usamos cookies para mejorar tu experiencia</p>
            <p style="color: #a0a8b5; font-size: 0.9rem;">Analizamos uso anónimo para optimizar el sitio. Puedes rechazar si lo deseas.</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button id="reject-cookies" style="padding: 0.8rem 1.5rem; background: transparent; border: 1px solid #a0a8b5; color: #a0a8b5; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
              Rechazar
            </button>
            <button id="accept-cookies" style="padding: 0.8rem 1.5rem; background: #00f2ff; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
              Aceptar
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);

      document.getElementById('accept-cookies').addEventListener('click', () => {
        localStorage.setItem(this.key, 'true');
        this.hide(banner);
      });

      document.getElementById('reject-cookies').addEventListener('click', () => {
        localStorage.setItem(this.key, 'rejected');
        this.hide(banner);
      });
    }

    hide(banner) {
      banner.style.animation = 'slideOutDown 0.4s ease-out';
      setTimeout(() => banner.remove(), 400);
    }
  }

  new CookieConsent();

  // ===== 8. SESSION STORAGE MANAGER =====

  class SessionManager {
    static save(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('Session storage full:', e);
        return false;
      }
    }

    static load(key) {
      try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    }

    static clear(key) {
      sessionStorage.removeItem(key);
    }
  }

  window.SessionManager = SessionManager;

  // ===== 9. DYNAMIC PRELOAD LINKS =====

  class SmartPreload {
    static init() {
      document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('mouseenter', () => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('http')) {
            this.preloadPage(href);
          }
        });
      });
    }

    static preloadPage(url) {
      const preload = document.createElement('link');
      preload.rel = 'prefetch';
      preload.href = url;
      document.head.appendChild(preload);
    }
  }

  SmartPreload.init();

  // ===== 10. ANALYTICS WRAPPER =====

  class Analytics {
    static isLocalEnv() {
      try {
        const h = location.hostname;
        return h === '127.0.0.1' || h === 'localhost' || location.protocol === 'file:';
      } catch (_) { return true; }
    }

    static event(category, action, label = '') {
      const data = {
        category,
        action,
        label,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      // Log locally
      try {
        const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
        events.push(data);
        localStorage.setItem('analytics-events', JSON.stringify(events.slice(-100)));
      } catch (e) { /* quota exceeded */ }

      // Avoid network calls in local dev
      if (this.isLocalEnv()) return;

      // Send to server if available
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(data));
      }
    }

    static pageView() {
      this.event('pageView', 'view', window.location.pathname);
    }

    static buttonClick(buttonText) {
      this.event('engagement', 'click', buttonText);
    }
  }

  window.Analytics = Analytics;
  Analytics.pageView();

  // Track button clicks
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, a[class*="btn"]');
    if (button) {
      Analytics.buttonClick(button.textContent.trim() || button.className);
    }
  });

})();

// ===== CSS KEYFRAMES FOR LOADERS =====

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideOutDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(20px); opacity: 0; }
  }

  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 242, 255, 0.3);
    border-top-color: #00f2ff;
    border-radius: 50%;
    animation: rotating 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  .smart-loader p {
    color: #a0a8b5;
    font-size: 0.95rem;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

document.head.appendChild(style);
