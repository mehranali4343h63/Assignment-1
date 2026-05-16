/**
 * PakServicesHub - Cart System
 */
const Cart = {
    _key: 'psh_cart',

    getItems() {
        try {
            return JSON.parse(localStorage.getItem(this._key)) || [];
        } catch(e) { return []; }
    },

    addItem(item) {
        const items = this.getItems();
        const existing = items.find(i => i.id === item.id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            items.push({ ...item, qty: 1 });
        }
        localStorage.setItem(this._key, JSON.stringify(items));
        this.updateBadge();
    },

    removeItem(id) {
        const items = this.getItems().filter(i => i.id !== id);
        localStorage.setItem(this._key, JSON.stringify(items));
        this.updateBadge();
    },

    getCount() {
        return this.getItems().reduce((sum, i) => sum + (i.qty || 1), 0);
    },

    clear() {
        localStorage.removeItem(this._key);
        this.updateBadge();
    },

    updateBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }
};

// Update badge on every page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Cart.updateBadge(), 100);
});
