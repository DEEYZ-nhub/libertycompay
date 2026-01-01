/**
 * Liberty Company - Main Script
 * Handles UI interactions, Cart functionality, and Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// --- Global State ---
let cart = [];
const CART_STORAGE_KEY = 'liberty_cart';

function initApp() {
    loadCart();
    updateCartCount();
    initScrollEffects();
    initRevealAnimations();

    // Check for auth
    if (typeof getLoggedUser === 'function') {
        const user = getLoggedUser();
        if (user) {
            const authBtns = document.querySelectorAll('#auth-btn');
            authBtns.forEach(btn => {
                btn.textContent = user.name;
                btn.onclick = () => window.location.href = 'dashboard.html'; // Or account page
            });
        }
    }
}

// --- Cart Functions ---

function loadCart() {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
    updateCartUI();
}

// Exposed globally for onclick events
window.addToCart = function (name, price, category) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            category: category,
            quantity: 1
        });
    }

    saveCart();
    showNotification(`¡${name} añadido al carrito!`);

    // Open cart automatically on add
    const modal = document.getElementById('cart-modal');
    if (modal && !modal.classList.contains('active')) {
        toggleCart();
    }
};

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    saveCart();
};

window.toggleCart = function () {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.toggle('active');
        if (modal.classList.contains('active')) {
            updateCartUI();
        }
    }
};

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-amount'); // Kept for compatibility if needed, but we'll overwrite innerHTML of modal mostly
    const checkoutBtn = document.querySelector('.cart-footer .btn-primary'); // Legacy selector

    // We need to target the modal content directly to restructure it completely
    const modalContent = document.querySelector('#cart-modal .modal-content');
    if (!modalContent) return;

    let total = 0;
    let messageItems = [];
    cart.forEach(item => {
        total += item.price * item.quantity;
        messageItems.push(`${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})`);
    });

    if (cart.length === 0) {
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <span class="material-symbols-outlined" style="font-size: 64px; color: var(--text-muted); opacity: 0.5; margin-bottom: 24px;">shopping_cart_off</span>
                <h2 style="margin-bottom: 16px;">Tu bolsa está vacía.</h2>
                <p style="color: var(--text-muted); margin-bottom: 32px;">¿No sabes qué elegir? Mira nuestros packs más populares.</p>
                <button onclick="toggleCart()" class="btn btn-outline">Seguir comprando</button>
            </div>
        `;
        return;
    }

    // Split Layout (Premium)
    let itemsHtml = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        itemsHtml += `
            <div class="cart-item-split slide-in">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-controls">
                        <button onclick="decreaseQuantity(${index})" class="qty-btn"><span class="material-symbols-outlined">remove</span></button>
                        <span class="qty-value">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})" class="qty-btn"><span class="material-symbols-outlined">add</span></button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <span class="price">€${itemTotal.toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" class="btn-delete-split">
                        <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                    </button>
                </div>
            </div>
        `;
    });

    modalContent.innerHTML = `
        <div class="cart-header-split">
            <h2>Tu Carrito <span class="material-symbols-outlined">shopping_cart</span></h2>
            <button class="close-btn-split" onclick="toggleCart()"><span class="material-symbols-outlined">close</span></button>
        </div>
        
        <div class="cart-container-split">
            <!-- Left Column: Items -->
            <div class="cart-items-column">
                ${itemsHtml}
            </div>

            <!-- Right Column: Payment -->
            <div class="cart-payment-column">
                <div class="payment-title">Método de Pago</div>
                <div class="payment-options">
                    <div class="payment-option selected" onclick="selectPayment(this)">
                        <span class="material-symbols-outlined">account_balance_wallet</span> Paypal
                    </div>
                    <div class="payment-option" onclick="selectPayment(this)">
                        <span class="material-symbols-outlined">attach_money</span> Cashapp
                    </div>
                    <div class="payment-option" onclick="selectPayment(this)">
                        <span class="material-symbols-outlined">currency_bitcoin</span> Litecoin
                    </div>
                    <div class="payment-option" onclick="selectPayment(this)">
                        <span class="material-symbols-outlined">currency_bitcoin</span> Bitcoin
                    </div>
                    <div class="payment-option" onclick="selectPayment(this)">
                        <span class="material-symbols-outlined">smartphone</span> Nequi
                    </div>
                </div>

                <div class="cart-totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>€${total.toFixed(2)}</span>
                    </div>
                    <div class="total-row final">
                        <span>Total</span>
                        <span>€${total.toFixed(2)}</span>
                    </div>
                    <button class="btn-pay-now" onclick="checkoutWhatsApp()">
                        Pagar Ahora <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper to select payment method
window.selectPayment = (element) => {
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
};

// Helper functions for quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
    updateCartUI();
    updateCartCount();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Define checkout function locally or ensure it's global
// Define checkout function locally or ensure it's global
window.checkoutWhatsApp = () => {
    let total = 0;
    let messageItems = [];
    cart.forEach(item => {
        total += item.price * item.quantity;
        messageItems.push(`${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})`);
    });

    const phoneNumber = '593985831655';
    const message = `Hola Liberty Company! 👋\n\nQuiero realizar el siguiente pedido:\n\n${messageItems.join('\n')}\n\n*Total: €${total.toFixed(2)}*`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// --- UI Effects ---

function showNotification(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: #000;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initScrollEffects() {
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Add CSS for animations if not present
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
