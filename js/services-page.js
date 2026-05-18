/**
 * PakServicesHub - Services Page
 * Clean single version — no duplicates
 */

let _activeCat = null;

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('psh_theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    buildCategoryButtons();

    // Auto-select category from URL param e.g. ?cat=home
    const urlCat = new URLSearchParams(window.location.search).get('cat');
    if (urlCat) {
        const btn = document.querySelector(`.svc-page-cat-btn[data-cat="${urlCat}"]`);
        if (btn) switchCat(urlCat, btn);
        else renderServicesGrid(null);
    } else {
        renderServicesGrid(null);
    }
});

// ── Build category filter buttons ────────────────────────────────
function buildCategoryButtons() {
    const wrap = document.getElementById('services-page-cats');
    if (!wrap) return;
    wrap.innerHTML = '';

    const catalog = store.getCatalog();

    const allBtn = document.createElement('button');
    allBtn.className = 'svc-page-cat-btn';
    allBtn.innerHTML = '🔍 All Services';
    allBtn.setAttribute('data-cat', 'all');
    allBtn.addEventListener('click', () => switchCat('all', allBtn));
    wrap.appendChild(allBtn);

    catalog.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'svc-page-cat-btn';
        btn.innerHTML = cat.label;
        btn.setAttribute('data-cat', cat.id);
        btn.style.setProperty('--spc-color', cat.color);
        btn.addEventListener('click', () => switchCat(cat.id, btn));
        wrap.appendChild(btn);
    });
}

// ── Switch active category ───────────────────────────────────────
function switchCat(catId, btn) {
    _activeCat = catId;
    document.querySelectorAll('.svc-page-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderServicesGrid(catId);
}

// ── Render service cards grid ────────────────────────────────────
function renderServicesGrid(catId) {
    const container = document.getElementById('services-page-grid');
    if (!container) return;
    container.innerHTML = '';

    // No category selected — show prompt
    if (!catId) {
        container.innerHTML = `
            <div class="svc-page-prompt">
                <div class="svc-page-prompt-icon">👆</div>
                <div class="svc-page-prompt-text">Select a category above to browse services</div>
            </div>`;
        return;
    }

    const catalog = store.getCatalog();
    let items = [];

    if (catId === 'all') {
        catalog.forEach(cat => {
            cat.items.forEach(item => items.push({ ...item, catId: cat.id, catLabel: cat.label }));
        });
    } else {
        const cat = catalog.find(c => c.id === catId);
        if (cat) cat.items.forEach(item => items.push({ ...item, catId: cat.id, catLabel: cat.label }));
    }

    if (items.length === 0) {
        container.innerHTML = '<div class="svc-page-empty">No services found in this category.</div>';
        return;
    }

    // Section heading
    const heading = document.createElement('div');
    heading.className = 'svc-page-section-heading';
    if (catId === 'all') {
        heading.textContent = `All Services (${items.length})`;
    } else {
        const cat = catalog.find(c => c.id === catId);
        heading.textContent = cat ? `${cat.label} — ${items.length} Services` : '';
    }
    container.appendChild(heading);

    // ── Cards grid wrapper ──
    const grid = document.createElement('div');
    grid.className = 'svc-page-cards';
    container.appendChild(grid);

    items.forEach(item => {
        const slug = item.name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        const card = document.createElement('div');
        card.className = 'svc-page-card';
        card.innerHTML = `
            <div class="svc-page-img">
                <img src="${item.imageUrl || ''}" alt="${item.name}" loading="lazy"
                     onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="svc-page-img-fallback" style="display:none;">${item.icon}</div>
                ${catId === 'all' ? `<span class="svc-page-cat-tag">${item.catLabel}</span>` : ''}
            </div>
            <div class="svc-page-body">
                <div class="svc-page-name">${item.icon} ${item.name}</div>
                <div class="svc-page-price">${item.price || 'Market Rate'}</div>
                <div class="svc-page-actions">
                    <button class="svc-page-book-btn" onclick="svcPageBook('${item.id}','${item.catId}','${slug}')">📅 Book</button>
                    <button class="svc-page-cart-btn" onclick="svcPageCart('${item.id}','${item.catId}')">🛒 Add</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ── Auth helpers ─────────────────────────────────────────────────
function svcPageIsLoggedIn() {
    try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        return u && u.role === 'customer';
    } catch(e) { return false; }
}

function svcPageShowAuth(action, slug, catId) {
    const existing = document.getElementById('svc-page-auth-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'svc-page-auth-modal';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
        <div class="auth-modal-card">
            <div class="auth-modal-icon">🔐</div>
            <h3>Login Required</h3>
            <p>Please login as a customer to <strong>${action === 'book' ? 'book this service' : 'add to cart'}</strong>.</p>
            <div class="auth-modal-btns">
                <a href="login.html?redirect=service-details.html%3Fservice%3D${slug}%26cat%3D${catId}" class="auth-modal-login">👤 Login</a>
                <a href="signup.html" class="auth-modal-signup">👥 Sign Up</a>
            </div>
            <button class="auth-modal-close" onclick="document.getElementById('svc-page-auth-modal').remove()">✕ Close</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('open'), 10);
}

function svcPageBook(itemId, catId, slug) {
    if (!svcPageIsLoggedIn()) { svcPageShowAuth('book', slug, catId); return; }
    window.location.href = 'service-details.html?service=' + slug + '&cat=' + catId + '&action=book';
}

function svcPageCart(itemId, catId) {
    if (!svcPageIsLoggedIn()) {
        const cat  = store.getCatalog().find(c => c.id === catId);
        const item = cat ? cat.items.find(i => i.id === itemId) : null;
        const slug = item ? item.name.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'') : '';
        svcPageShowAuth('cart', slug, catId);
        return;
    }
    const cat  = store.getCatalog().find(c => c.id === catId);
    const item = cat ? cat.items.find(i => i.id === itemId) : null;
    if (!item) return;

    Cart.addItem({ id: item.id, name: item.name, icon: item.icon, imageUrl: item.imageUrl, price: item.price, catId });

    let stack = document.getElementById('svc-page-toast');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'svc-page-toast';
        stack.className = 'lm-toast-stack';
        document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'lm-toast lm-toast-success';
    t.textContent = item.icon + ' ' + item.name + ' added to cart!';
    stack.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}
