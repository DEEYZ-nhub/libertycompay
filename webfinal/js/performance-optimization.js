// Performance Optimization & Monitoring Module
// Tracks and optimizes core Web Vitals (LCP, FID, CLS)

(function() {
  const performanceData = {
    metrics: {},
    images: new Map(),
    initialized: false
  };

  function initPerformanceOptimizations() {
    if (performanceData.initialized) return;
    performanceData.initialized = true;

    // 1. Lazy load images outside viewport
    optimizeImageLoading();

    // 2. Prefetch critical resources
    prefetchCriticalResources();

    // 3. Monitor Web Vitals
    monitorWebVitals();

    // 4. Debounce resize/scroll events
    optimizeEventListeners();
  }

  function optimizeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
              performanceData.images.set(img, 'loaded');
            };
            newImg.onerror = () => {
              img.classList.add('error');
              performanceData.images.set(img, 'error');
            };
            newImg.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  }

  function prefetchCriticalResources() {
    // Prefetch next page if on product page
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('.html') || href.includes('.js'))) {
        // Prefetch on hover
        link.addEventListener('mouseenter', () => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          document.head.appendChild(link);
        }, { once: true });
      }
    });
  }

  function monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          performanceData.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.debug('LCP monitoring not available');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            performanceData.metrics.fid = entry.processingDuration;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.debug('FID monitoring not available');
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      try {
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              performanceData.metrics.cls = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.debug('CLS monitoring not available');
      }
    }
  }

  function optimizeEventListeners() {
    // Debounce scroll and resize events
    let scrollTimeout;
    let resizeTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      document.body.classList.add('scrolling');
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 150);
    }, { passive: true });

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      document.body.classList.add('resizing');
      resizeTimeout = setTimeout(() => {
        document.body.classList.remove('resizing');
      }, 150);
    }, { passive: true });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
  } else {
    initPerformanceOptimizations();
  }

  // Expose API for debugging
  window.PerformanceOptimization = {
    getMetrics: () => performanceData.metrics,
    getImageStatus: () => Array.from(performanceData.images.entries()),
    isInitialized: () => performanceData.initialized
  };
})();
