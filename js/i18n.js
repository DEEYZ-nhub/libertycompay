const i18n = {
  es: {
    nav: { reviews: 'Reseñas', sponsors: 'Patrocinios', team: 'Equipo', contact: 'Contacto', delivery: 'Domicilio', promos: 'Promociones', faq: 'FAQ', store: 'Tienda', videos: 'Videos' },
    // Pill labels for navigation (used by dynamic .nav-pill elements)
    pill: { top: 'Ir', dropdown: 'Ver' },
    hero: { title: 'Impulsa tu <span class="gradient-text">Reputación</span> al Siguiente Nivel', subtitle: 'Reseñas de Google Maps reales y garantizadas para tu negocio. Mejora tu posicionamiento y credibilidad hoy mismo.', btn_packs: 'Ver Packs', btn_contact: 'Contactar', card_quality: 'Calidad', card_guarantee: 'Garantizado' },
    delivery: {
      title: 'Servicio a Domicilio Nacional',
      subtitle: 'Llega a clientes en todo el país con entregas rápidas y seguras.',
      fast: 'Entrega Rápida',
      fast_desc: 'Envíos express en 24-48 horas.',
      secure: 'Envío Seguro',
      secure_desc: 'Empaque protegido y seguimiento en tiempo real.',
      flexible: 'Pago Flexible',
      flexible_desc: 'Múltiples opciones de pago.',
      nationwide: 'Cobertura Nacional',
      btn: 'Solicitar Envío'
    },
    promos: {
      title: 'Promociones Exclusivas',
      subtitle: 'Síguenos en redes sociales y recibe ofertas especiales.',
      discord_desc: 'Comunidad exclusiva con eventos y sorteos.',
      telegram_desc: 'Notificaciones de ofertas en tiempo real.',
      instagram_desc: 'Contenido exclusivo y concursos semanales.',
      whatsapp_desc: 'Atención personalizada y ofertas directas.',
      join: 'Únirse'
    },
    videos: {
      title: 'Videos Explicativos',
      subtitle: 'Descubre cómo funcionan nuestros servicios.',
      reviews_title: 'Reseñas Google Maps',
      reviews_desc: 'El proceso completo de cómo agregamos reseñas verificadas.',
      store_title: 'Tienda Virtual - Sellauth',
      store_desc: 'Cómo funciona nuestra integración con Sellauth.',
      delivery_title: 'Servicio de Domicilio',
      delivery_desc: 'Entregas seguras a nivel nacional.'
    },
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Resuelve tus dudas sobre nuestros servicios.',
      q1: '¿Las reseñas que proporcionáis son reales y legales?',
      a1: 'Sí, todas nuestras reseñas provienen de usuarios verificados y reales de Google Maps. Cumplimos con todas las políticas de Google y garantizamos legalidad en cada reseña.',
      q2: '¿Cuánto tiempo tarda en verse el impacto de las reseñas?',
      a2: 'El impacto comienza a notarse en 3-7 días. Las reseñas se publican de forma gradual para parecer naturales.',
      q3: '¿Puedo elegir el contenido de las reseñas?',
      a3: 'Puedes proporcionar puntos clave que quieras destacar, y nuestro equipo redactará reseñas naturales y personalizadas.',
      q4: '¿Existe riesgo de penalización por parte de Google?',
      a4: 'No. Trabajamos dentro de las normativas de Google usando perfiles reales. Nuestro sistema de publicación gradual minimiza riesgos.',
      q5: '¿Cómo se realiza el pago y qué incluye?',
      a5: 'El pago se realiza por adelantado mediante PayPal, CashApp, Bitcoin, Litecoin o Nequi. Incluye reseñas verificadas, fotos y publicación gradual.',
      q6: '¿Qué información necesitáis para empezar?',
      a6: 'Necesitamos el enlace de tu negocio en Google Maps, descripción breve, ubicación y puntos clave.',
      q7: '¿Ofrecéis alguna garantía de resultados?',
      a7: 'Garantizamos que las reseñas se publicarán. Si alguna es eliminada, la reemplazamos sin costo adicional (hasta 6 meses).',
      q8: '¿Puedo cancelar el servicio en cualquier momento?',
      a8: 'Sí. Puedes cancelar antes de que se publiquen las reseñas y recibirás reembolso parcial.'
    },
    packs: {
      title: 'Packs de Reseñas Google Maps', subtitle: 'Elige el plan perfecto para potenciar tu negocio local.',
      basic: { name: 'Plan Básico (5 Reseñas)', features: ['5 Reseñas Google Maps', 'Perfiles Reales', 'Garantía de Reposición'] },
      standard: { name: 'Plan Estándar (10 Reseñas)', features: ['10 Reseñas Google Maps', 'Perfiles Reales', 'Garantía de Reposición'] },
      premium: { name: 'Plan Premium (20 Reseñas)', features: ['20 Reseñas Google Maps', 'Perfiles Reales', 'Garantía de Reposición'] },
      ultimate: { name: 'Plan Ultimate (50 Reseñas)', features: ['50 Reseñas Google Maps', 'Perfiles Reales', 'Garantía de Reposición'] },
      enterprise: { name: 'Plan Enterprise (100 Reseñas)', features: ['100 Reseñas Google Maps', 'Perfiles Reales', 'Garantía de Reposición'] },
      btn_add: 'Agregar al Carrito'
    },
    sponsors: { title: 'Patrocinios Liberty', subtitle: '¿Buscas mayor visibilidad? Asocia tu marca con nosotros.', btn: 'Quiero ser Patrocinador', why_title: '¿Por qué patrocinarnos?', why_text: 'Buscamos colaboraciones duraderas donde ambas partes ganen.' },
    team: { title: 'Nuestro Equipo', subtitle: 'Conoce las áreas que hacen posible Liberty Company.', join_title: '¿Quieres formar parte del equipo?', join_text: 'Si quieres trabajar con nosotros, completa el siguiente formulario.', btn_join: 'Postular Ahora' },
    store: { title: 'Tienda Digital Premium', subtitle: 'Servicios de streaming y gaming premium entregados al instante.' },
    success: {
      label: 'Resultados Reales',
      title: 'Casos de Éxito',
      subtitle: 'Ve cómo negocios como el tuyo han transformado su reputación online.',
      cta_title: '¿Listo para mejorar la reputación de tu negocio?'
    },
    cart: { title: 'Tu Carrito', empty: 'Tu carrito está vacío', payment_title: 'Método de Pago', coupon_label: 'Código Promocional', apply: 'Aplicar', subtotal: 'Subtotal', discount: 'Descuento', total: 'Total', checkout: 'Pagar Ahora' },
    payment: { title: 'Detalles de Pago', instruction: 'Envía el monto exacto a la siguiente dirección:', amount: 'Monto a Pagar:', warning: 'Una vez realizado el pago, envía el comprobante para activar tu pedido.', btn_confirm: 'Enviar Comprobante (WhatsApp)' }
  ,
    accessibility: { langChanged: 'Idioma cambiado a Español' }
  },
  en: {
    nav: { reviews: 'Reviews', sponsors: 'Sponsorships', team: 'Team', contact: 'Contact', delivery: 'Delivery', promos: 'Promotions', faq: 'FAQ', store: 'Store', videos: 'Videos' },
    // Pill labels for navigation
    pill: { top: 'Go', dropdown: 'View' },
    hero: { title: 'Boost your <span class="gradient-text">Reputation</span> to the Next Level', subtitle: 'Real and guaranteed Google Maps reviews for your business. Improve your ranking and credibility today.', btn_packs: 'View Packs', btn_contact: 'Contact Us', card_quality: 'Quality', card_guarantee: 'Guaranteed' },
    delivery: {
      title: 'National Delivery Service',
      subtitle: 'Reach customers across the country with fast and secure deliveries.',
      fast: 'Fast Delivery',
      fast_desc: 'Express shipping in 24-48 hours.',
      secure: 'Secure Shipping',
      secure_desc: 'Protected packaging and real-time tracking.',
      flexible: 'Flexible Payment',
      flexible_desc: 'Multiple payment options available.',
      nationwide: 'National Coverage',
      btn: 'Request Delivery'
    },
    promos: {
      title: 'Exclusive Promotions',
      subtitle: 'Follow us on social media and get special offers.',
      discord_desc: 'Exclusive community with events and raffles.',
      telegram_desc: 'Real-time offer notifications.',
      instagram_desc: 'Exclusive content and weekly contests.',
      whatsapp_desc: 'Personal attention and direct offers.',
      join: 'Join'
    },
    videos: {
      title: 'Explainer Videos',
      subtitle: 'Discover how our services work.',
      reviews_title: 'Google Maps Reviews',
      reviews_desc: 'The complete process of how we add verified reviews.',
      store_title: 'Virtual Store - Sellauth',
      store_desc: 'How our integration with Sellauth works.',
      delivery_title: 'Delivery Service',
      delivery_desc: 'Safe deliveries nationwide.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Resolve your doubts about our services.',
      q1: 'Are the reviews you provide real and legal?',
      a1: 'Yes, all our reviews come from verified and real Google Maps users. We comply with all Google policies and guarantee legality.',
      q2: 'How long does it take to see the impact of reviews?',
      a2: 'Impact starts to show in 3-7 days. Reviews are published gradually to look natural.',
      q3: 'Can I choose the content of the reviews?',
      a3: 'You can provide key points you want to highlight, and our team will write natural personalized reviews.',
      q4: 'Is there a risk of Google penalization?',
      a4: 'No. We work within Google policies using real profiles. Our gradual publication system minimizes risks.',
      q5: 'How is payment made and what is included?',
      a5: 'Payment is made in advance via PayPal, CashApp, Bitcoin, Litecoin or Nequi. Includes verified reviews, photos and gradual publication.',
      q6: 'What information do you need to start?',
      a6: 'We need your business link on Google Maps, brief description, location and key points.',
      q7: 'Do you offer any result guarantee?',
      a7: 'We guarantee that reviews will be published. If any is removed, we replace it at no cost (up to 6 months).',
      q8: 'Can I cancel the service at any time?',
      a8: 'Yes. You can cancel before reviews are posted and receive a partial refund.'
    },
    packs: {
      title: 'Google Maps Review Packs', subtitle: 'Choose the perfect plan to boost your local business.',
      basic: { name: 'Basic Plan (5 Reviews)', features: ['5 Google Maps Reviews', 'Real Profiles', 'Replacement Guarantee'] },
      standard: { name: 'Standard Plan (10 Reviews)', features: ['10 Google Maps Reviews', 'Real Profiles', 'Replacement Guarantee'] },
      premium: { name: 'Premium Plan (20 Reviews)', features: ['20 Google Maps Reviews', 'Real Profiles', 'Replacement Guarantee'] },
      ultimate: { name: 'Ultimate Plan (50 Reviews)', features: ['50 Google Maps Reviews', 'Real Profiles', 'Replacement Guarantee'] },
      enterprise: { name: 'Enterprise Plan (100 Reviews)', features: ['100 Google Maps Reviews', 'Real Profiles', 'Replacement Guarantee'] },
      btn_add: 'Add to Cart'
    },
    sponsors: { title: 'Liberty Sponsorships', subtitle: 'Looking for more visibility? Partner with us.', btn: 'Become a Sponsor', why_title: 'Why sponsor us?', why_text: 'We seek lasting collaborations where both parties win.' },
    team: { title: 'Our Team', subtitle: 'Meet the areas that make Liberty Company possible.', join_title: 'Want to join the team?', join_text: 'If you want to work with us, complete the form below.', btn_join: 'Apply Now' },
    store: { title: 'Premium Digital Store', subtitle: 'Streaming and premium gaming services delivered instantly.' },
    success: {
      label: 'Real Results',
      title: 'Success Stories',
      subtitle: 'See how businesses like yours have transformed their online reputation.',
      cta_title: 'Ready to improve your business reputation?'
    },
    cart: { title: 'Your Cart', empty: 'Your cart is empty', payment_title: 'Payment Method', coupon_label: 'Promo Code', apply: 'Apply', subtotal: 'Subtotal', discount: 'Discount', total: 'Total', checkout: 'Pay Now' },
    payment: { title: 'Payment Details', instruction: 'Send the exact amount to the following address:', amount: 'Amount to Pay:', warning: 'Once payment is made, send the proof to activate your order.', btn_confirm: 'Send Proof (WhatsApp)' }
  ,
    accessibility: { langChanged: 'Language changed to English' }
  }
};

// Currency Rates
const rates = {
  USD: 1,
  EUR: 0.95 // 1 USD = 0.95 EUR approx
};

const currencySymbols = {
  USD: '$',
  EUR: '€'
};

// State
let currentLang = 'es';
let currentCurrency = 'USD';

// Init
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('liberty_lang') || 'es';
  setLanguage(savedLang);
  setCurrency('EUR');
});

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(i18n[lang], key);
    if (value) {
      if (el.tagName === 'INPUT' && el.placeholder) {
        el.placeholder = value;
      } else {
        el.innerHTML = value; // Use innerHTML to support spans
      }
    }
  });

  // Update specific lists if needed (features)
  updatePackFeatures(lang);

  // Update aria-labels for navigation links to reflect the visible text (exclude nav-pill text)
  try {
    const navAnchors = document.querySelectorAll('#nav-menu a');
    navAnchors.forEach(a => {
      // prefer a child with data-i18n for a clean label
      const labeled = a.querySelector('[data-i18n]');
      let labelText = '';
      if (labeled) labelText = labeled.textContent.trim();
      else {
        const pill = a.querySelector('.nav-pill');
        const pillText = pill ? pill.textContent.trim() : '';
        labelText = a.textContent.replace(pillText, '').trim();
      }
      if (labelText) a.setAttribute('aria-label', labelText);
    });

    // Announce language change via an aria-live region (visually hidden)
    let live = document.getElementById('aria-live-status');
    if (!live) {
      live = document.createElement('div');
      live.id = 'aria-live-status';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      // visually hide but keep accessible
      live.style.position = 'absolute';
      live.style.left = '-9999px';
      live.style.width = '1px';
      live.style.height = '1px';
      live.style.overflow = 'hidden';
      document.body.appendChild(live);
    }
    const announce = getNestedValue(i18n[lang], 'accessibility.langChanged') || (lang === 'es' ? 'Idioma cambiado' : 'Language changed');
    live.textContent = announce;
    // small visual fade if debug visible; ensure screen readers pick it up
    live.style.opacity = '1';
    live.style.transition = 'opacity 600ms ease';
    setTimeout(() => { live.style.opacity = '0'; }, 1200);
  } catch (err) {
    console.warn('setLanguage accessibility update failed', err);
  }
}

function setCurrency(currency) {
  currentCurrency = currency;
  const rate = rates[currency];
  const symbol = currencySymbols[currency];

  // Update all price elements
  const eurEls = document.querySelectorAll('[data-price-eur]');
  if (eurEls.length > 0 && currency === 'EUR') {
    eurEls.forEach(el => {
      const eurPrice = parseFloat(el.dataset.priceEur);
      const card = el.closest('.pack-card');
      if (card) {
        card.dataset.price = `€${eurPrice}`;
      }
      if (el.classList.contains('pack-amount')) {
        el.innerHTML = `€${eurPrice} <span class="unit">EUR</span>`;
      } else {
        el.innerText = `€${eurPrice}`;
      }
    });
  } else {
    document.querySelectorAll('[data-price-usd]').forEach(el => {
      const usdPrice = parseFloat(el.dataset.priceUsd);
      const converted = (usdPrice * rate).toFixed(2);
      const card = el.closest('.pack-card');
      if (card) {
        card.dataset.price = `${symbol}${converted}`;
      }
      if (el.classList.contains('pack-amount')) {
        el.innerHTML = `${symbol}${converted} <span class="unit">${currency}</span>`;
      } else {
        el.innerText = `${symbol}${converted}`;
      }
    });
  }

  // Trigger cart update if open to recalculate totals
  if (typeof renderCart === 'function') {
    renderCart();
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
}

function updatePackFeatures(lang) {
  // This is a bit manual but ensures the lists update correctly
  const packs = ['basic', 'standard', 'premium', 'ultimate', 'enterprise'];

  packs.forEach(pack => {
    const card = document.querySelector(`.pack-card[data-id="review-${pack}"]`);
    if (card) {
      // Update Name
      card.dataset.name = i18n[lang].packs[pack].name;
      card.querySelector('h3').innerText = i18n[lang].packs[pack].name;

      // Update Features
      const featuresList = card.querySelector('.pack-features');
      const features = i18n[lang].packs[pack].features;

      // Keep the icons, just change text
      const listItems = featuresList.querySelectorAll('li');
      features.forEach((feat, index) => {
        if (listItems[index]) {
          const icon = listItems[index].querySelector('.material-symbols-outlined').outerHTML;
          listItems[index].innerHTML = `${icon} ${feat}`;
        }
      });
    }
  });
}
