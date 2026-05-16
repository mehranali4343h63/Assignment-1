/**
 * PakServicesHub - Cart Page Logic
 * Shows cart items, allows removal, proceed to book
 */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary   = document.getElementById('cart-summary');
    const items     = Cart.getItems();

    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h2>Your Cart is Empty</h2>
                <p>Browse services and add them to your cart to book later.</p>
                <a href="../index.html" class="svc-back-btn">← Browse Services</a>
            </div>`;
        if (summary) summary.style.display = 'none';
        return;
    }

    if (summary) summary.style.display = 'block';

    container.innerHTML = `<h3 class="cart-list-title">Your Services (${items.length})</h3>`;

    items.forEach(item => {
        const slug = item.name.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
        const card = document.createElement('div');
        card.className = 'cart-item-card';
        card.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.imageUrl || ''}" alt="${item.name}"
                     onerror="this.parentElement.innerHTML='<div class=\\'cart-item-img-fallback\\'>${item.icon}</div>'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.icon} ${item.name}</div>
                <div class="cart-item-price">${item.price || 'Market Rate'}</div>
                <div class="cart-item-qty">Qty: ${item.qty || 1}</div>
            </div>
            <div class="cart-item-actions">
                <a href="service-details.html?service=${slug}&cat=${item.catId}" class="cart-item-book-btn">📅 Book Now</a>
                <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')">🗑️ Remove</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Update summary
    const totalItems = items.reduce((s, i) => s + (i.qty || 1), 0);
    const el = document.getElementById('cart-total-items');
    if (el) el.textContent = totalItems;

    // Try to sum prices
    let total = 0;
    let canSum = true;
    items.forEach(item => {
        const p = item.price || '';
        const num = parseInt(p.replace(/[^0-9]/g, ''));
        if (!isNaN(num)) total += num * (item.qty || 1);
        else canSum = false;
    });
    const priceEl = document.getElementById('cart-total-price');
    if (priceEl) priceEl.textContent = canSum ? 'Rs. ' + total.toLocaleString() : 'See individual prices';
}

function removeFromCart(id) {
    Cart.removeItem(id);
    renderCart();
    showCartToast('Item removed from cart.');
}

function clearCartAction() {
    if (confirm('Clear all items from cart?')) {
        Cart.clear();
        renderCart();
    }
}

function proceedToBook() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.role === 'admin') {
        const overlay = document.getElementById('auth-modal-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.add('open');
        }
        return;
    }
    // Navigate to first item's service detail
    const items = Cart.getItems();
    if (items.length > 0) {
        const item = items[0];
        const slug = item.name.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
        window.location.href = 'service-details.html?service=' + slug + '&cat=' + item.catId;
    }
}

function showCartToast(msg) {
    const stack = document.getElementById('sd-toast-stack') || document.body;
    const t = document.createElement('div');
    t.className = 'lm-toast lm-toast-info';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2000);
}
