/**
 * Sistema de Autenticación y Guard
 * Protege páginas y funcionalidades
 */

// ============================================
// FUNCIONES GLOBALES DE AUTENTICACIÓN
// ============================================

// Use global safeGetLocalJSON from local-utils.js if available; otherwise define locally
if (typeof safeGetLocalJSON === 'undefined') {
  // Fallback: Helper seguro para leer JSON desde localStorage sin lanzar
  window.safeGetLocalJSON = function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return typeof fallback === 'undefined' ? null : fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[safeGetLocalJSON] parse error for', key, e);
      return typeof fallback === 'undefined' ? null : fallback;
    }
  };
}

// Limpieza única de sesiones/usuarios y verificación antigua
(function oneTimeAuthCleanup() {
  try {
    const FLAG = 'auth_cleanup_done_v1';
    if (localStorage.getItem(FLAG)) return;

    // Eliminar sesión actual y registros/pendientes de verificación
    // No borrar 'registeredUsers' para evitar pérdida de cuentas
    const keysToRemove = ['user'];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('verification_') || k.startsWith('pendingRegistration_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => { try { localStorage.removeItem(k); } catch (_) { } });

    localStorage.setItem(FLAG, '1');
    console.log('[AUTH] Limpieza inicial ejecutada');
  } catch (e) {
    // no-op
  }
})();

// Inicializar usuarios de demostración si no existen
(function initDemoUsers() {
  try {
    // Respetar flag para deshabilitar usuarios demo
    if (localStorage.getItem('disableDemoUsers') === '1') return;

    const registeredUsers = safeGetLocalJSON('registeredUsers', []);

    // Si ya hay usuarios registrados, no hacer nada
    if (registeredUsers.length > 0) return;

    // Crear usuario de prueba
    const demoUser = {
      name: 'Usuario Demo',
      email: 'demo@gmail.com',
      password: 'demo1234',
      verified: true,
      registerDate: new Date().toISOString()
    };

    localStorage.setItem('registeredUsers', JSON.stringify([demoUser]));
    console.log('[AUTH] Usuarios de demostración inicializados');
  } catch (e) {
    console.warn('[AUTH] Error inicializando demo users:', e);
  }
})();

// Roles y dueño
const OWNER_EMAILS = ['juanandresito293@gmail.com'];
function assignRoleFields(user) {
  try {
    if (!user) return user;
    if (user.email && OWNER_EMAILS.includes(String(user.email).toLowerCase())) {
      user.role = 'owner';
      user.isOwner = true;
      user.isAdmin = true;
    }
    return user;
  } catch { return user; }
}

/**
 * Obtiene el usuario logueado del localStorage
 */
function getLoggedUser() {
  const u = safeGetLocalJSON('user', null);
  if (!u) return null;
  const enriched = assignRoleFields({ ...u });
  // Si se enriqueció con flags de owner, persistir para futuras lecturas
  if (enriched && (enriched.isOwner || enriched.role === 'owner')) {
    try { localStorage.setItem('user', JSON.stringify(enriched)); } catch (_) { }
  }
  return enriched;
}

/**
 * Verifica si hay usuario logueado
 */
function isUserLoggedIn() {
  return getLoggedUser() !== null;
}

/**
 * Guarda usuario en localStorage
 */
function setLoggedUser(userData) {
  const enriched = assignRoleFields({ ...userData });
  const payload = { ...enriched, loginTime: new Date().toISOString() };
  localStorage.setItem('user', JSON.stringify(payload));
  // Notificar si es dueño
  try {
    if (payload.isOwner || payload.role === 'owner') {
      showNotification('Acceso como DUEÑO', true);
    }
  } catch (_) { }
}

/**
 * Helper: ¿usuario actual es dueño?
 */
function isOwner() {
  const u = getLoggedUser();
  return !!(u && (u.isOwner || (u.email && OWNER_EMAILS.includes(String(u.email).toLowerCase()))));
}

/**
 * Helper: rol del usuario actual (owner | user | guest)
 */
function getUserRole() {
  const u = getLoggedUser();
  if (!u) return 'guest';
  return (u.role || (isOwner() ? 'owner' : 'user'));
}

/**
 * Mostrar notificación pequeña en pantalla (éxito/error)
 */
function showNotification(message, success = true) {
  try {
    const id = 'auth-notification';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.cssText = 'position:fixed;top:1rem;right:1rem;padding:0.8rem 1rem;border-radius:8px;z-index:11000;color:#fff;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.4);font-family:Arial, sans-serif;';
      document.body.appendChild(el);
    }
    el.style.background = success ? 'linear-gradient(90deg,#10b981,#06b6d4)' : 'linear-gradient(90deg,#ef4444,#f97316)';
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { if (el) el.style.display = 'none'; }, 4500);
  } catch (e) {
    console.log('[NOTIF] ', message);
  }
}

/**
 * Cierra la sesión
 */
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'auth.html';
}

/**
 * Guard para proteger páginas
 * Si no está logueado, redirige a auth.html
 */
function protectPage() {
  if (!isUserLoggedIn()) {
    // Guardar la página actual para redirigir después
    const currentPage = window.location.href;
    sessionStorage.setItem('redirectAfterLogin', currentPage);
    window.location.href = 'auth.html';
  }
}

/**
 * Guard para proteger compra
 * Muestra modal si no está logueado
 */
function requireLoginForAction(callback) {
  const user = getLoggedUser();

  if (!user) {
    showLoginRequiredModal();
    return false;
  }

  if (callback && typeof callback === 'function') {
    callback();
  }
  return true;
}

/**
 * Muestra modal pidiendo que inicie sesión
 */
function showLoginRequiredModal() {
  // Si ya existe el modal, no lo crea de nuevo
  if (document.getElementById('login-required-modal')) {
    document.getElementById('login-required-modal').style.display = 'flex';
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'login-required-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(30, 30, 30, 0.98));
    border: 1px solid rgba(0, 242, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s ease;
  `;

  content.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">Debes iniciar sesión</h2>
    <p style="color: #a0a0a0; margin-bottom: 1.5rem; font-size: 0.95rem;">
      Para acceder a esta funcionalidad necesitas estar registrado e iniciar sesión.
    </p>
    <div style="display: flex; gap: 1rem; flex-direction: column;">
      <a href="auth.html" style="
        background: #00f2ff;
        color: #000;
        padding: 0.9rem 1.5rem;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-size: 1rem;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#00f2ff'">
        Ir a Iniciar Sesión
      </a>
      <button onclick="document.getElementById('login-required-modal').style.display='none'" style="
        background: transparent;
        color: #00f2ff;
        padding: 0.9rem 1.5rem;
        border-radius: 10px;
        border: 1px solid #00f2ff;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(0, 242, 255, 0.1)'" onmouseout="this.style.background='transparent'">
        Cerrar
      </button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Cerrar al hacer click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Agregar animaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Redirige a la página guardada después de login
 */
function redirectAfterLogin() {
  const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
  sessionStorage.removeItem('redirectAfterLogin');

  if (redirectUrl && redirectUrl !== window.location.href) {
    window.location.href = redirectUrl;
  } else {
    window.location.href = 'index.html';
  }
}

/**
 * Simulación de login con Google
 * En producción, usarías Google OAuth API (YA INTEGRADA EN auth.html)
 * Esta función es respaldo si Google falla
 */
function loginWithGoogle() {
  // Esta función ya no se usa - Google Sign-In está en auth.html
  alert('Por favor usa el botón de Google Sign-In debajo');
}

/**
 * Simulación de login con GitHub
 * En producción, usarías GitHub OAuth API
 * 
 * Para implementar GitHub OAuth real:
 * 1. Crea una app en https://github.com/settings/developers
 * 2. Obtén Client ID y Client Secret
 * 3. Usa el flujo de autenticación de GitHub
 */
function loginWithGitHub() {
  // Para esta demo, muestra instrucciones
  alert('Para usar GitHub Login en producción:\n\n1. Ir a https://github.com/settings/developers\n2. Crear una nueva OAuth App\n3. Configurar la autenticación\n\nPor ahora, usa email/contraseña o Google.');
}

/**
 * Lista de dominios de email reales/válidos
 * Basada en proveedores de email públicos confiables
 */
const VALID_EMAIL_DOMAINS = [
  // Principales proveedores globales
  'gmail.com', 'gmail.es', 'yahoo.com', 'yahoo.es', 'hotmail.com', 'hotmail.es',
  'outlook.com', 'outlook.es', 'outlook.com.br', 'live.com', 'msn.com',
  'icloud.com', 'mail.com', 'aol.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'mailbox.org', 'tutanota.com', 'fastmail.com', 'hey.com', 'inbox.com',
  // Servicios de email alternativos
  'riseup.net', 'posteo.de', 'disroot.org', 'cock.li', 'mail.tm',
  'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 'tempmail.com',
  // Hispanoamérica - Colombia
  'unal.edu.co', 'javeriana.edu.co', 'uninorte.edu.co', 'eafit.edu.co', 'andes.edu.co',
  'correounivalle.edu.co', 'unicauca.edu.co', 'udea.edu.co',
  // Hispanoamérica - Venezuela
  'ula.ve', 'cantv.net', 'ucv.ve', 'usb.ve', 'uft.edu.ve',
  // Hispanoamérica - Perú
  'pucp.edu.pe', 'unmsm.edu.pe', 'uni.edu.pe', 'udep.edu.pe', 'ulima.edu.pe',
  // Hispanoamérica - México
  'unam.mx', 'ipn.mx', 'itesm.mx', 'tecnologico.net.mx', 'uanl.mx',
  // Hispanoamérica - Ecuador (tu zona)
  'uce.edu.ec', 'espe.edu.ec', 'uio.edu.ec', 'utpl.edu.ec', 'puce.edu.ec',
  'espol.edu.ec', 'ucsg.edu.ec',
  // Dominios corporativos comunes
  'empresa.com', 'business.com', 'work.com', 'office.com', 'company.com',
  'mail.ru', 'rambler.ru', 'yandex.ru', 'bk.ru',
  // Chinos populares
  'qq.com', '126.com', '163.com', 'sina.com.cn', 'sohu.com',
  // Testing
  'test.com', 'example.com', 'neocities.com', 'localhost.com'
];

/**
 * Validar formato de email y que el dominio sea real
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email.trim())) {
    return false;
  }

  // Extraer dominio del email
  const domain = email.toLowerCase().trim().split('@')[1];

  // Relajar validación: aceptar cualquier dominio con formato válido
  // Si deseas restringir más adelante, reactivar el chequeo de lista.
  return true;
}

/**
 * Generar código de verificación único
 */
function generateVerificationCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Enviar código de verificación por email (EmailJS es preferido)
 * Solo muestra en pantalla si falla el envío por email
 */
function sendVerificationCode(email, code, name) {
  // Guardar código en localStorage con expiración (10 minutos)
  const verificationData = {
    code: code,
    email: email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutos
  };
  localStorage.setItem(`verification_${email}`, JSON.stringify(verificationData));

  // Devolver una promesa para que el llamador pueda decidir si mostrar el código en pantalla
  return new Promise((resolve) => {
    // Intentar enviar usando EmailJS si está disponible
    if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
      try {
        const templateParams = {
          to_email: email,
          verification_code: code,
          user_name: name || email,
          code_expiry: '10 minutos'
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(() => {
            console.log(`[VERIFICACIÓN] ✓ Código enviado vía EmailJS a ${email}`);
            showNotification('✓ Código de verificación enviado a tu correo', true);
            resolve({ sent: true, method: 'email' });
          })
          .catch((err) => {
            console.warn('[VERIFICACIÓN] EmailJS falló:', err);
            // Fallback: mostrar código en pantalla
            showNotification('⚠ No se pudo enviar por email. El código se muestra en pantalla', false);
            resolve({ sent: false, method: 'screen', code: code });
          });
      } catch (e) {
        console.warn('[VERIFICACIÓN] Error al usar EmailJS:', e);
        showNotification('⚠ Error en EmailJS. El código se muestra en pantalla', false);
        resolve({ sent: false, method: 'screen', code: code });
      }
    } else {
      console.warn('[VERIFICACIÓN] EmailJS no disponible o no configurado');
      showNotification('⚠ Servicio de email no configurado. El código se muestra en pantalla', false);
      resolve({ sent: false, method: 'screen', code: code });
    }
  });
}

/**
 * Verificar código de verificación
 */
function verifyCode(email, code) {
  const verificationData = safeGetLocalJSON(`verification_${email}`, null);

  if (!verificationData) {
    return { success: false, message: 'No se encontró código de verificación. Intenta registrarte de nuevo.' };
  }

  // Verificar que no haya expirado
  if (Date.now() > verificationData.expiresAt) {
    localStorage.removeItem(`verification_${email}`);
    return { success: false, message: 'El código de verificación ha expirado. Intenta registrarte de nuevo.' };
  }

  // Verificar que el código sea correcto
  if (verificationData.code !== code.toUpperCase()) {
    return { success: false, message: 'Código de verificación incorrecto.' };
  }

  // Buscar un registro pendiente
  const pending = safeGetLocalJSON(`pendingRegistration_${email}`, null);
  if (!pending) {
    // No hay registro pendiente, limpiar verificación y devolver éxito lógico
    localStorage.removeItem(`verification_${email}`);
    return { success: true, message: 'Email verificado correctamente.' };
  }

  // Crear usuario definitivo y marcar como verificado
  const registeredUsers = safeGetLocalJSON('registeredUsers', []);
  const newUser = {
    name: pending.name,
    email: pending.email,
    password: pending.password,
    verified: true,
    registerDate: new Date().toISOString()
  };

  registeredUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  // Limpiar pending y verificación
  localStorage.removeItem(`pendingRegistration_${email}`);
  localStorage.removeItem(`verification_${email}`);

  return { success: true, message: 'Email verificado correctamente.' };
}

/**
 * Validar usuario en login
 * Si no existe, pide que se registre
 */
function validateLoginUser(email, password) {
  // Normalizar entradas
  const emailNorm = String(email || '').trim().toLowerCase();
  const passInput = String(password || '');
  const passTrim = passInput.trim();

  // Validar que email no esté vacío
  if (!emailNorm) {
    return { success: false, message: 'El correo es obligatorio' };
  }

  // --- ADMIN HARDCODED CHECK ---
  if (emailNorm === 'admin' && passInput === 'admin1234') {
    const adminUser = {
      name: 'Administrador',
      email: 'admin@liberty.com',
      role: 'owner',
      isOwner: true,
      isAdmin: true,
      registerDate: new Date().toISOString()
    };
    setLoggedUser(adminUser);
    return { success: true, user: adminUser };
  }
  // -----------------------------

  // Validar formato de email
  if (!isValidEmail(emailNorm)) {
    return { success: false, message: 'Ingresa un correo electrónico válido con dominio real (ej: usuario@gmail.com)' };
  }

  // Validar que contraseña no esté vacía
  if (!passInput) {
    return { success: false, message: 'La contraseña es obligatoria' };
  }

  // Obtener todos los usuarios registrados
  const registeredUsers = safeGetLocalJSON('registeredUsers', []);

  // Buscar usuario por email (case-insensitive + trim)
  const found = registeredUsers.find(u => (String(u.email || '').toLowerCase().trim()) === emailNorm);
  if (!found) {
    return { success: false, message: 'Usuario no encontrado. Por favor regístrate primero.' };
  }

  // Comparar contraseña exacta o con trim para tolerar espacios accidentales
  const stored = String(found.password || '');
  const ok = (stored === passInput) || (stored === passTrim);
  if (!ok) {
    return { success: false, message: 'Contraseña incorrecta' };
  }

  // Éxito: guardar sesión
  setLoggedUser({ name: found.name, email: found.email, registerDate: found.registerDate });
  return { success: true, user: found };
}

/**
 * Registrar nuevo usuario (con verificación por email requerida)
 */
function registerNewUser(name, email, password) {
  // Normalizar entradas
  const nameTrim = String(name || '').trim();
  const emailNorm = String(email || '').trim().toLowerCase();
  const passTrim = String(password || '').trim();

  // Validar nombre
  if (!nameTrim) {
    return { success: false, message: 'El nombre es obligatorio' };
  }

  // Validar email
  if (!emailNorm) {
    return { success: false, message: 'El correo electrónico es obligatorio' };
  }
  if (!isValidEmail(emailNorm)) {
    return { success: false, message: 'Ingresa un correo electrónico válido con dominio real (ej: usuario@gmail.com)' };
  }

  // Validar contraseña (mínimo 8)
  if (!passTrim || passTrim.length < 8) {
    return { success: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  // Obtener usuarios existentes y validar duplicado (case-insensitive)
  const registeredUsers = safeGetLocalJSON('registeredUsers', []);
  if (registeredUsers.find(u => (String(u.email || '').toLowerCase().trim()) === emailNorm)) {
    return { success: false, message: 'Este correo ya está registrado' };
  }

  // Registrar usuario (persistencia local tipo "BD")
  const newUser = {
    name: nameTrim,
    email: emailNorm,
    password: passTrim,
    provider: 'Email',
    verified: true,
    registerDate: new Date().toISOString()
  };

  registeredUsers.push(newUser);
  try {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  } catch (err) {
    alert('❌ Error al guardar el usuario en localStorage. Por favor revisa el espacio disponible o permisos del navegador.');
    return { success: false, message: 'Error al guardar el usuario en localStorage.' };
  }

  // Autologin tras registro
  setLoggedUser({ name: newUser.name, email: newUser.email, registerDate: newUser.registerDate });

  return {
    success: true,
    requiresVerification: false,
    message: 'Registro completado. Sesión iniciada.',
    user: newUser
  };
}

/**
 * Obtener nombre del usuario logueado
 */
function getLoggedUserName() {
  const user = getLoggedUser();
  return user ? user.name : 'Usuario';
}

/**
 * Guardar redirección después de login
 */
function saveRedirectUrl() {
  const currentUrl = window.location.href;
  // No guardar si estamos en auth.html o dashboard.html
  if (!currentUrl.includes('auth.html') && !currentUrl.includes('dashboard.html')) {
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
  }
}

/**
 * Guardar orden de compra
 */
function guardarOrden(orderData) {
  const user = getLoggedUser();

  if (!user) {
    console.error('No hay usuario logueado');
    return false;
  }

  // Obtener órdenes existentes
  const ordenes = safeGetLocalJSON('orders', []);

  // Crear nueva orden
  const nuevaOrden = {
    ...orderData,
    orderId: 'ORD-' + String(ordenes.length + 1).padStart(3, '0'),
    userName: user.name,
    userEmail: user.email,
    orderDate: new Date().toISOString(),
    paymentStatus: 'pendiente', // pendiente, completado, cancelado
    adminNotes: ''
  };

  ordenes.push(nuevaOrden);
  localStorage.setItem('orders', JSON.stringify(ordenes));

  return nuevaOrden;
}

// Migración de datos legacy -> canónica
function migrarDatosLegacy() {
  try {
    // Migrar órdenes
    const legacyOrders = safeGetLocalJSON('liberty_orders', null);
    if (legacyOrders && legacyOrders.length) {
      const orders = safeGetLocalJSON('orders', []);
      // Insertar sólo órdenes que no estén (comparar por userEmail + amount + orderDate si falta id)
      const existingSignatures = new Set(orders.map(o => (o.orderId || o.id) + '|' + (o.userEmail || o.user) + '|' + (o.amount || o.subtotal || 0)));
      let merged = false;
      legacyOrders.forEach(lo => {
        const sig = (lo.orderId || lo.id || '') + '|' + (lo.userEmail || lo.user || '') + '|' + (lo.amount || lo.subtotal || 0);
        if (!existingSignatures.has(sig)) {
          orders.push(lo);
          existingSignatures.add(sig);
          merged = true;
        }
      });
      if (merged) {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      // opcional: eliminar legacy para evitar duplicados en el futuro
      // localStorage.removeItem('liberty_orders');
    }

    // Migrar carrito legacy al carrito por usuario si hay usuario
    const user = getLoggedUser();
    if (user && user.email) {
      const legacyCart = safeGetLocalJSON('liberty_cart_v1', null) || safeGetLocalJSON('cart', []);
      if (legacyCart && legacyCart.length > 0) {
        const userCartKey = 'cart_' + encodeURIComponent(user.email.toLowerCase());
        const existing = safeGetLocalJSON(userCartKey, []);
        if ((!existing || existing.length === 0) && legacyCart.length > 0) {
          localStorage.setItem(userCartKey, JSON.stringify(legacyCart));
        }
      }
    }
  } catch (e) {
    console.warn('Error migrando datos legacy', e);
  }
}

// Ejecutar migración al cargar este script
migrarDatosLegacy();

// Normalizar usuarios registrados: marcar como verificados los usuarios antiguos
// que no tenían la propiedad `verified` para mantener compatibilidad.
function normalizeRegisteredUsers() {
  try {
    const users = safeGetLocalJSON('registeredUsers', []);
    if (!users || users.length === 0) return;
    let changed = false;
    const updated = users.map(u => {
      if (typeof u.verified === 'undefined') {
        u.verified = true;
        changed = true;
      }
      return u;
    });
    if (changed) {
      localStorage.setItem('registeredUsers', JSON.stringify(updated));
      console.log('[MIGRATE] Usuarios normalizados: `verified` agregado a usuarios legacy');
    }
  } catch (e) {
    console.warn('Error normalizando usuarios:', e);
  }
}

normalizeRegisteredUsers();

// ===== Admin utility: eliminar todos los usuarios y datos de auth (localStorage) =====
function purgeAllUsers(options = {}) {
  try {
    const { keepDemo = false } = options;
    // Evitar que se regenere el usuario demo tras el purge
    if (!keepDemo) localStorage.setItem('disableDemoUsers', '1');

    // Borrar usuarios registrados y sesión actual
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('user');

    // Borrar claves de verificación y registros pendientes
    const toDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('verification_') || k.startsWith('pendingRegistration_'))) {
        toDelete.push(k);
      }
    }
    toDelete.forEach(k => { try { localStorage.removeItem(k); } catch (_) { } });

    try { showNotification('✓ Usuarios eliminados', true); } catch (_) { }
    console.log('[AUTH] Todos los usuarios y datos de auth han sido eliminados.');
  } catch (e) {
    console.warn('[AUTH] Error purgando usuarios:', e);
  }
}

// Purge absolutamente todos los datos locales de la app (localStorage + sessionStorage)
// Mantiene deshabilitado el usuario demo salvo que se indique keepDemo=true
function purgeAllAppData(options = {}) {
  try {
    const { keepDemo = false } = options;
    const preserve = {};
    if (!keepDemo) preserve.disableDemoUsers = '1';

    try { localStorage.clear(); } catch (_) { }
    try { sessionStorage.clear(); } catch (_) { }

    // Restaurar claves preservadas
    Object.keys(preserve).forEach(k => { try { localStorage.setItem(k, preserve[k]); } catch (_) { } });

    try { showNotification('✓ Todos los datos locales fueron eliminados', true); } catch (_) { }
    console.log('[AUTH] Purge completo de datos locales ejecutado');
  } catch (e) {
    console.warn('[AUTH] Error en purgeAllAppData:', e);
  }
}

// Exponer globalmente para ejecución manual: window.purgeAllUsers()
if (typeof window !== 'undefined') {
  window.purgeAllUsers = purgeAllUsers;
  window.purgeAllAppData = purgeAllAppData;
}

/**
 * Obtener todas las órdenes
 */
function obtenerOrdenes() {
  // Intentar obtener la lista canonical en 'orders'
  let ordenes = safeGetLocalJSON('orders', []);
  // Si no hay órdenes en 'orders' pero sí en la llave legacy, sincronizar
  if ((!ordenes || ordenes.length === 0) && safeGetLocalJSON('liberty_orders', null)) {
    try {
      const legacy = safeGetLocalJSON('liberty_orders', []);
      if (legacy && legacy.length > 0) {
        ordenes = legacy;
        localStorage.setItem('orders', JSON.stringify(ordenes));
      }
    } catch (e) {
      // ignore
    }
  }
  return ordenes || [];
}

/**
 * Obtener órdenes del usuario actual
 */
function obtenerOrdenesUsuario() {
  const user = getLoggedUser();
  if (!user) return [];
  const ordenes = safeGetLocalJSON('orders', []);
  return ordenes.filter(o => o.userEmail === user.email);
}

/**
 * Validar registro de nuevo usuario
 */
function validarRegistro(nombre, correo, contrasena) {
  // Validación relajada: nombre >= 2, email con formato estándar, contraseña >= 8
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  if (!nombre || nombre.trim().length < 2) {
    return { ok: false, msg: 'El nombre debe tener al menos 2 caracteres.' };
  }
  if (!contrasena || contrasena.length < 8) {
    return { ok: false, msg: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (!correo || !emailRegex.test(String(correo).trim())) {
    return { ok: false, msg: 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).' };
  }
  return { ok: true };
}

// En tu función de registro, antes de guardar:
// const valid = validarRegistro(nombre, correo, contrasena);
// if (!valid.ok) { alert(valid.msg); return; }

//

