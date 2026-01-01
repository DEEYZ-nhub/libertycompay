/**
 * Product Renderer - Renderiza todos los productos en el HTML
 * Carga productos desde config.js
 */

function renderWebDesignPacks() {
  const container = document.getElementById('web-design-packs');
  if (!container) return;
  if (!window.CONFIG || !Array.isArray(CONFIG.webDesignPacks)) return;

  const html = CONFIG.webDesignPacks.map(pack => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          🌐
        </div>
        <h3>${pack.name}</h3>
        <span class="product-badge">1 mes garantía</span>
      </div>
      <ul class="product-features">
        ${pack.features.map(feature => `<li><span class="material-symbols-outlined">check_circle</span> ${feature}</li>`).join('')}
      </ul>
      <div class="product-footer">
        <div class="product-price">
          <span class="currency-symbol">$</span>
          <span class="amount">${pack.price}</span>
        </div>
        <button class="btn-add-to-cart" data-product-id="${pack.id}" data-product-name="${pack.name}" data-product-price="${pack.price}">
          <span class="material-symbols-outlined">shopping_cart</span> Agregar
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  attachProductEventListeners();
}

function renderGraphicDesignPacks() {
  const container = document.getElementById('graphic-design-packs');
  if (!container) return;
  if (!window.CONFIG || !Array.isArray(CONFIG.graphicDesignPacks)) return;

  const html = CONFIG.graphicDesignPacks.map(pack => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-image" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          🎨
        </div>
        <h3>${pack.name}</h3>
        <span class="product-badge">1 mes garantía</span>
      </div>
      <ul class="product-features">
        ${pack.features.map(feature => `<li><span class="material-symbols-outlined">check_circle</span> ${feature}</li>`).join('')}
      </ul>
      <div class="product-footer">
        <div class="product-price">
          <span class="currency-symbol">$</span>
          <span class="amount">${pack.price}</span>
        </div>
        <button class="btn-add-to-cart" data-product-id="${pack.id}" data-product-name="${pack.name}" data-product-price="${pack.price}">
          <span class="material-symbols-outlined">shopping_cart</span> Agregar
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  attachProductEventListeners();
}

function renderAIChatbotPacks() {
  const container = document.getElementById('ai-chatbot-packs');
  if (!container) return;
  if (!window.CONFIG || !Array.isArray(CONFIG.aiChatbotPacks)) return;

  const html = CONFIG.aiChatbotPacks.map(pack => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-image" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          🤖
        </div>
        <h3>${pack.name}</h3>
        <span class="product-badge">1 mes garantía</span>
      </div>
      <ul class="product-features">
        ${pack.features.map(feature => `<li><span class="material-symbols-outlined">check_circle</span> ${feature}</li>`).join('')}
      </ul>
      <div class="product-footer">
        <div class="product-price">
          <span class="currency-symbol">$</span>
          <span class="amount">${pack.price}</span>
        </div>
        <button class="btn-add-to-cart" data-product-id="${pack.id}" data-product-name="${pack.name}" data-product-price="${pack.price}">
          <span class="material-symbols-outlined">shopping_cart</span> Agregar
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  attachProductEventListeners();
}

function renderDigitalGoods() {
  const container = document.getElementById('digital-goods');
  if (!container) return;
  if (!window.CONFIG || !Array.isArray(CONFIG.digitalGoods)) return;

  const html = CONFIG.digitalGoods.map(product => `
    <div class="product-card">
      <div class="product-header">
        <div class="product-image" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
          💎
        </div>
        <h3>${product.name}</h3>
        <span class="product-badge">Entrega inmediata</span>
      </div>
      <p class="product-description" style="padding: 1rem; text-align: center; color: var(--text-secondary);">
        ${product.description}
      </p>
      <div class="product-footer">
        <button class="btn-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price || ''}" data-product-desc="${product.description || ''}">
          <span class="material-symbols-outlined">shopping_cart</span> Ver opciones
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  attachProductEventListeners();
}

function renderRobuxOffers() {
  // Robux offers removed — keep function for compatibility
  const container = document.getElementById('robux-offers');
  if (container) container.innerHTML = '<div class="info">Ofertas de Robux retiradas.</div>';
  return;
}

function renderStoreVideos() {
  const container = document.getElementById('store-videos');
  if (!container || !window.CONFIG || !Array.isArray(CONFIG.storeVideos)) return;

  const html = CONFIG.storeVideos.map((url, idx) => {
    if (!url) return '';
    // embed YouTube iframe
    const src = url.replace('watch?v=', 'embed/');
    return `
      <div class="video-card">
        <iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="video-${idx}" loading="lazy"></iframe>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="video-grid">${html}</div>`;
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container || !window.CONFIG || !Array.isArray(CONFIG.testimonials)) return;

  const html = CONFIG.testimonials.map(testimonial => `
    <div class="testimonial-card">
      <div class="testimonial-header">
        <div class="testimonial-avatar">${testimonial.image}</div>
        <div class="testimonial-info">
          <h4>${testimonial.name}</h4>
          <p>${testimonial.company}</p>
        </div>
      </div>
      <div class="testimonial-rating">
        ${'⭐'.repeat(testimonial.rating)}
      </div>
      <p class="testimonial-text">"${testimonial.text}"</p>
    </div>
  `).join('');

  container.innerHTML = html;
}

function renderTeam() {
  const container = document.getElementById('team-container');
  if (!container || !window.CONFIG || !Array.isArray(CONFIG.team)) return;

  const html = CONFIG.team.map(member => `
    <div class="team-member">
      <div class="member-avatar">${member.image}</div>
      <h3>${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-bio">${member.bio}</p>
    </div>
  `).join('');

  container.innerHTML = html;
}

function renderFAQ() {
  const container = document.getElementById('faq-container');
  if (!container || !window.CONFIG || !Array.isArray(CONFIG.faqs)) return;

  const html = CONFIG.faqs.map((faq, index) => `
    <details class="faq-item">
      <summary class="faq-question">
        <span class="material-symbols-outlined">help</span>
        ${faq.question}
      </summary>
      <p class="faq-answer">${faq.answer}</p>
    </details>
  `).join('');

  container.innerHTML = html;
}

function renderGuaranteePolicy() {
  const container = document.getElementById('guarantee-policy-container');
  if (!container || !window.CONFIG || !CONFIG.guaranteePolicy) return;

  const policy = CONFIG.guaranteePolicy;
  const html = `
    <div class="guarantee-card">
      <h3>Garantía por ${policy.duration}</h3>
      <p>${policy.description}</p>
      
      <h4>¿Qué incluye?</h4>
      <ul>
        ${policy.included.map(item => `<li><span class="material-symbols-outlined">check_circle</span> ${item}</li>`).join('')}
      </ul>

      <h4>Proceso de garantía</h4>
      <ol>
        ${policy.process.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>
  `;

  container.innerHTML = html;
}

function attachProductEventListeners() {
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const productName = this.dataset.productName;
      const productPrice = this.dataset.productPrice;
      const productDesc = this.dataset.productDesc || '';

      if (!isUserLoggedIn()) {
        showLoginRequiredModal();
        return;
      }
      const label = (this.innerText || this.textContent || '').toLowerCase();

      // Si es "Ver opciones" o no tiene precio, abrir modal de detalle
      if (label.includes('ver opciones') || !productPrice) {
        showProductModal({ id: productId, name: productName, price: productPrice, description: productDesc });
        return;
      }

      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        currency: 'USD'
      });

      // Abrir carrito para mostrar opciones/confirmación al usuario
      if (typeof openCart === 'function') openCart();

      // Mostrar confirmación
      this.textContent = '✓ Agregado al carrito';
      this.style.opacity = '0.7';
      setTimeout(() => {
        this.innerHTML = '<span class="material-symbols-outlined">shopping_cart</span> Agregar';
        this.style.opacity = '1';
      }, 2000);
    });
  });
}

// Modal de detalle para productos sin precio o con "Ver opciones"
function showProductModal(item) {
  try {
    const overlay = document.createElement('div');
    overlay.className = 'product-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 2200;

    const modal = document.createElement('div');
    modal.className = 'product-detail-modal';
    modal.style.background = 'var(--bg-panel)';
    modal.style.color = 'var(--text-main)';
    modal.style.padding = '18px';
    modal.style.borderRadius = '12px';
    modal.style.maxWidth = '520px';
    modal.style.width = '92%';
    modal.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';

    // Calcular texto de precio si aplica
    let priceText = '';
    if (item.price) {
      const asNumber = Number(item.price);
      if (!isNaN(asNumber)) {
        // asumimos precio en USD si es numérico
        priceText = formatCurrency(asNumber);
      } else {
        priceText = item.price;
      }
    }

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="margin:0; font-size:18px;">${item.name || 'Producto'}</h3>
        <button id="close-product-detail" style="background:transparent;border:none;color:var(--accent);font-size:20px;cursor:pointer;">✕</button>
      </div>
      <div style="margin-bottom:8px; color:var(--text-muted);">${item.description || ''}</div>
      ${priceText ? `<div style="margin-bottom:8px; font-weight:700;">Precio: <span style="color:var(--secondary);">${priceText}</span></div>` : ''}
      <div style="margin-top:14px; text-align:right; display:flex; gap:8px;">
        <button id="add-to-cart-from-modal" class="btn btn-primary">Agregar al carrito</button>
        <button id="close-product-detail-2" class="btn btn-outline">Cerrar</button>
      </div>
    `;

    overlay.appendChild(modal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });

    document.body.appendChild(overlay);

    modal.querySelector('#close-product-detail').addEventListener('click', () => document.body.removeChild(overlay));
    modal.querySelector('#close-product-detail-2').addEventListener('click', () => document.body.removeChild(overlay));
    modal.querySelector('#add-to-cart-from-modal').addEventListener('click', () => {
      addToCart({ id: item.id || ('p-' + Date.now()), name: item.name || 'Producto', price: item.price || 0 });
      if (typeof openCart === 'function') openCart();
      document.body.removeChild(overlay);
    });
  } catch (err) {
    console.error('showProductModal error', err);
  }
}

// Inicializar renderización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Only render sections that exist in the current page to avoid wasted work
  const runIf = (id, fn) => { if (document.getElementById(id)) fn(); };

  runIf('web-design-packs', renderWebDesignPacks);
  runIf('graphic-design-packs', renderGraphicDesignPacks);
  runIf('ai-chatbot-packs', renderAIChatbotPacks);
  runIf('digital-goods', renderDigitalGoods);
  runIf('robux-offers', renderRobuxOffers);
  runIf('store-videos', renderStoreVideos);

  // These sections are expected to exist on most pages
  renderTestimonials();
  renderTeam();
  renderFAQ();
  renderGuaranteePolicy();
});
