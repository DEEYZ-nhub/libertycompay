document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ duration: 800, once: true });

  // Ensure safeGetLocalJSON is available before checkout
  if (typeof safeGetLocalJSON === 'undefined') {
    window.safeGetLocalJSON = function(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : (typeof fallback === 'undefined' ? null : fallback);
      } catch (e) {
        return typeof fallback === 'undefined' ? null : fallback;
      }
    };
  }

  // Compatibilidad: aceptar carrito legacy y global
  const CART_KEY_LEGACY = 'liberty_cart_v1';
  const CART_KEY_GLOBAL = 'cart';
  let cart = [];
  try {
    cart = safeGetLocalJSON(CART_KEY_LEGACY, safeGetLocalJSON(CART_KEY_GLOBAL, []));
  } catch (e) {
    cart = [];
  }

  const $orderItems = document.getElementById('orderItems');
  const $summarySubtotal = document.getElementById('summarySubtotal');
  const $summaryTax = document.getElementById('summaryTax');
  const $summaryTotal = document.getElementById('summaryTotal');
  const $form = document.getElementById('checkoutForm');
  const $privacyCheck = document.getElementById('privacyCheck');
  const $finalizeBtn = document.getElementById('finalizeBtn');
  const $applyCoupon = document.getElementById('applyCoupon');
  const $alertBox = document.getElementById('alertBox');
  const $paymentBtn = document.getElementById('paymentBtn');

  // Si no existe el formulario de checkout, salir (script puede cargarse en otras páginas)
  if (!$form || !$orderItems) return;

  function formatPrice(n) {
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function renderSummary() {
    // items
    $orderItems.innerHTML = '';
    if (cart.length === 0) {
      $orderItems.innerHTML = `<p style="color:#bfbfbf;text-align:center;padding:20px">Tu carrito está vacío</p>`;
      $finalizeBtn.disabled = true;
      return;
    }

    cart.forEach(it => {
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <div>
          <div class="order-item-name">${it.name}</div>
          <div class="order-item-qty">×${it.qty}</div>
        </div>
        <div class="order-item-price">${formatPrice(Number(it.price) * it.qty)}</div>
      `;
      $orderItems.appendChild(div);
    });

    // totals
    const subtotal = cart.reduce((s, i) => s + (Number(i.price) * i.qty), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    $summarySubtotal.textContent = formatPrice(subtotal);
    $summaryTax.textContent = formatPrice(tax);
    $summaryTotal.textContent = formatPrice(total);

    $finalizeBtn.disabled = !$privacyCheck.checked;
  }

  // privacy checkbox enables button
  if ($privacyCheck) {
    $privacyCheck.addEventListener('change', () => {
      if ($finalizeBtn) $finalizeBtn.disabled = !$privacyCheck.checked;
    });
  }

  // apply coupon with better validation
  if ($applyCoupon) {
    $applyCoupon.addEventListener('click', () => {
      const couponEl = document.getElementById('couponCode');
      const code = couponEl ? (couponEl.value || '').trim().toUpperCase() : '';
      if (!code) {
        showAlert('Por favor ingresa un código de cupón', 'error');
        return;
      }
      // Validar cupones conocidos (local + servidor en producción)
      const validCoupons = {
        'LIBERTY10': { discount: 0.10, label: '10% descuento' },
        'LIBERTY20': { discount: 0.20, label: '20% descuento' },
        'NEWYEAR2025': { discount: 0.15, label: '15% descuento Año Nuevo' }
      };
      if (validCoupons[code]) {
        showAlert('✓ Cupón aplicado: ' + validCoupons[code].label, 'success');
        // TODO: En producción, validar en servidor y aplicar descuento al total
      } else {
        showAlert('❌ Cupón no válido o expirado', 'error');
      }
    });
  }

  // payment button (dummy RedSys)
  if ($paymentBtn) {
    $paymentBtn.addEventListener('click', () => {
      if (!$form.checkValidity()) {
        $form.reportValidity();
        return;
      }
      showAlert('Redirigiendo a RedSys para pagar...', 'info');
      setTimeout(() => {
        // simular redirección
        alert('En producción: redirige a pasarela RedSys');
      }, 1200);
    });
  }

  // form submit
  if ($form) $form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!$privacyCheck.checked) {
      showAlert('Por favor acepta los términos y condiciones', 'error');
      return;
    }
    if (cart.length === 0) {
      showAlert('Tu carrito está vacío', 'error');
      return;
    }

    // collect form data
    const formData = new FormData($form);
    const customer = Object.fromEntries(formData);
    const subtotal = cart.reduce((s, i) => s + (Number(i.price) * i.qty), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    // Construir orden compatible con el admin (paymentStatus, userName, userEmail, amount)
    const order = {
      // mantener id distinto pero admin muestra ORD-<index+1>, así que este campo es informativo
      id: 'ORD-' + Date.now(),
      orderDate: new Date().toISOString(),
      items: cart,
      subtotal: subtotal,
      tax: tax,
      amount: total,
      paymentStatus: 'pendiente',
      userName: customer.name || (window.getLoggedUser ? (getLoggedUser() || {}).name : 'Cliente'),
      userEmail: customer.email || (window.getLoggedUser ? (getLoggedUser() || {}).email : ''),
      customer: customer
    };

    // save order to localStorage (in real app: send to backend)
    // Guardar tanto en la llave canonica 'orders' como en la llave legacy 'liberty_orders'
    try {
      const orders = safeGetLocalJSON('orders', []);
      orders.push(order);
      try { safeSetLocalJSON('orders', orders); } catch(e) { console.warn('No se pudo guardar orders', e); }
    } catch (e) {
      // fallback: intentar crear 'orders' desde cero
      try { localStorage.setItem('orders', JSON.stringify([order])); } catch (ex) { console.warn('No se pudo guardar la orden en localStorage', ex); }
    }

    // feedback
    showAlert(`✓ Pedido #${order.id} registrado. Procesando pago...`, 'success');

    // clear cart
    setTimeout(() => {
      // eliminar el carrito de ambas llaves para compatibilidad
      try { localStorage.removeItem(CART_KEY_LEGACY); } catch (e) {}
      try { localStorage.removeItem(CART_KEY_GLOBAL); } catch (e) {}
      cart = [];
      // redirect or show success page
      setTimeout(() => {
        window.location.href = 'index.html?orderSuccess=' + order.id;
      }, 2000);
    }, 1500);
  });

  function showAlert(msg, type = 'info') {
    if (!$alertBox) {
      try { alert(msg.replace(/<[^>]+>/g, '')); } catch (e) { console.log(msg); }
      return;
    }
    $alertBox.style.display = 'block';
    $alertBox.innerHTML = msg;
    $alertBox.style.borderColor = type === 'error' ? 'rgba(255,100,100,.2)' : type === 'success' ? 'rgba(100,255,100,.2)' : 'rgba(100,150,255,.2)';
    $alertBox.style.background = type === 'error' ? 'linear-gradient(90deg,rgba(255,100,100,.08),rgba(255,100,100,.04))' :
      type === 'success' ? 'linear-gradient(90deg,rgba(100,255,100,.08),rgba(100,255,100,.04))' :
        'linear-gradient(90deg,rgba(100,150,255,.08),rgba(100,150,255,.04))';
    $alertBox.style.color = type === 'error' ? '#ffb3b3' : type === 'success' ? '#b3ffb3' : '#b3d7ff';
  }

  // initial render
  if (cart.length === 0) {
    showAlert('⚠ Tu carrito está vacío. <a href="index.html" style="color:inherit;text-decoration:underline">Vuelve a comprar</a>', 'error');
    $finalizeBtn.disabled = true;
  } else {
    renderSummary();
  }
});