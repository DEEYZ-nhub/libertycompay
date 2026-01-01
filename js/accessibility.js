// ===== ACCESSIBILITY IMPROVEMENTS =====
// WCAG 2.1 AA compliance utilities

(function() {
  'use strict';

  // ===== SKIP TO MAIN CONTENT LINK =====
  
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Saltar al contenido principal';
  skipLink.style.cssText = `
    position: fixed;
    top: -40px;
    left: 0;
    background: #00f2ff;
    color: #000;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10000;
    font-weight: 600;
    transition: top 0.3s;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  // ===== ENHANCED KEYBOARD NAVIGATION =====

  class KeyboardNav {
    static init() {
      // Focus visible styling
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });

      document.addEventListener('click', () => {
        document.body.classList.remove('keyboard-nav');
      });

      // Arrow key navigation for menus
      document.querySelectorAll('[role="menu"]').forEach(menu => {
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        items.forEach((item, index) => {
          item.addEventListener('keydown', (e) => {
            let nextItem = null;
            if (e.key === 'ArrowDown') {
              nextItem = items[(index + 1) % items.length];
              e.preventDefault();
            } else if (e.key === 'ArrowUp') {
              nextItem = items[(index - 1 + items.length) % items.length];
              e.preventDefault();
            }
            if (nextItem) nextItem.focus();
          });
        });
      });
    }
  }

  KeyboardNav.init();

  // ===== ARIA LIVE REGIONS =====

  class AriaLiveRegion {
    constructor(type = 'polite') {
      this.region = document.createElement('div');
      this.region.setAttribute('aria-live', type);
      this.region.setAttribute('aria-atomic', 'true');
      this.region.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(this.region);
    }

    announce(message) {
      this.region.textContent = message;
    }
  }

  const liveRegion = new AriaLiveRegion('polite');
  window.announceA11y = (message) => liveRegion.announce(message);

  // ===== COLOR CONTRAST CHECKER =====

  class ContrastChecker {
    static hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    static getLuminance(rgb) {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(x => {
        x = x / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    static getContrast(color1, color2) {
      const rgb1 = this.hexToRgb(color1);
      const rgb2 = this.hexToRgb(color2);
      if (!rgb1 || !rgb2) return null;

      const lum1 = this.getLuminance(rgb1);
      const lum2 = this.getLuminance(rgb2);
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    static isAACompliant(color1, color2, fontSize = 14) {
      const contrast = this.getContrast(color1, color2);
      if (!contrast) return null;
      // AA: 4.5:1 for normal text, 3:1 for large text
      return fontSize >= 18 ? contrast >= 3 : contrast >= 4.5;
    }
  }

  window.ContrastChecker = ContrastChecker;

  // ===== FORM ACCESSIBILITY =====

  class FormA11y {
    static init() {
      document.querySelectorAll('form').forEach(form => {
        // Ensure all inputs have labels
        form.querySelectorAll('input, textarea, select').forEach(input => {
          if (!input.id) {
            input.id = `field_${Date.now()}_${Math.random()}`;
          }
          const label = form.querySelector(`label[for="${input.id}"]`);
          if (!label) {
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', input.id);
            newLabel.textContent = input.placeholder || input.name || 'Campo';
            newLabel.style.display = 'block';
            newLabel.style.marginBottom = '0.5rem';
            newLabel.style.fontWeight = '600';
            input.parentNode.insertBefore(newLabel, input);
          }
        });

        // Add error message support
        form.addEventListener('submit', (e) => {
          form.querySelectorAll('input:invalid').forEach(input => {
            const error = input.parentNode.querySelector('[role="alert"]') || 
                         document.createElement('div');
            error.setAttribute('role', 'alert');
            error.style.color = '#ef4444';
            error.style.fontSize = '0.9rem';
            error.style.marginTop = '0.3rem';
            error.textContent = input.validationMessage || 'Campo inválido';
            if (!input.parentNode.querySelector('[role="alert"]')) {
              input.parentNode.appendChild(error);
            }
          });
        });
      });
    }
  }

  FormA11y.init();

  // ===== HEADING HIERARCHY CHECKER =====

  class HeadingChecker {
    static check() {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      const issues = [];

      headings.forEach((h, index) => {
        const currentLevel = parseInt(h.tagName[1]);
        if (currentLevel > lastLevel + 1) {
          issues.push(`Salto de encabezado en: "${h.textContent}" (de h${lastLevel} a h${currentLevel})`);
        }
        lastLevel = currentLevel;
      });

      if (issues.length > 0) {
        console.warn('Problemas de estructura de encabezados:', issues);
      }
      return issues;
    }
  }

  window.HeadingChecker = HeadingChecker;
  HeadingChecker.check();

  // ===== FOCUS TRAP FOR MODALS =====

  class FocusTrap {
    constructor(element) {
      this.element = element;
      this.focusableElements = null;
      this.firstElement = null;
      this.lastElement = null;
    }

    activate() {
      this.focusableElements = Array.from(
        this.element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      
      if (this.focusableElements.length === 0) return;

      this.firstElement = this.focusableElements[0];
      this.lastElement = this.focusableElements[this.focusableElements.length - 1];
      this.firstElement.focus();

      this.element.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === this.firstElement) {
          this.lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === this.lastElement) {
          this.firstElement.focus();
          e.preventDefault();
        }
      }
    }

    deactivate() {
      this.element.removeEventListener('keydown', (e) => this.handleKeydown(e));
    }
  }

  window.FocusTrap = FocusTrap;

  // ===== IMAGE ALT TEXT VALIDATOR =====

  class ImageValidator {
    static check() {
      const images = document.querySelectorAll('img');
      const issues = [];

      images.forEach(img => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim() === '') {
          issues.push(`Imagen sin alt text: ${img.src}`);
          img.setAttribute('role', 'presentation');
        }
      });

      if (issues.length > 0) {
        console.warn('Problemas de accesibilidad en imágenes:', issues);
      }
      return issues;
    }
  }

  window.ImageValidator = ImageValidator;
  ImageValidator.check();

  // ===== SCREEN READER TEXT =====

  const srStyles = document.createElement('style');
  srStyles.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(srStyles);

  // ===== KEYBOARD STYLE INDICATOR =====

  const keyboardStyles = document.createElement('style');
  keyboardStyles.textContent = `
    .keyboard-nav button:focus,
    .keyboard-nav a:focus,
    .keyboard-nav input:focus,
    .keyboard-nav textarea:focus,
    .keyboard-nav select:focus {
      outline: 3px solid #00f2ff;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(keyboardStyles);

  console.log('✓ Accessibility enhancements loaded');
})();
