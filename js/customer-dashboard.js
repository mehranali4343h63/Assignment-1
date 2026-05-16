/**
 * PakServicesHub - Customer Dashboard
 */

// Auth guard — customer only
(function() {
    const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!u || u.role === 'admin') {
        window.location.href = 'login.html';
    }
    // Set name in sidebar
    const nameEl = document.getElementById('cust-name-sidebar');
    if (nameEl && u) nameEl.textContent = u.name || 'Customer';
})();

function showCustTab(id, el) {
    document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-sidebar-item').forEach(i => i.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    if (el) el.classList.add('active');
    const labels = { overview: 'My Dashboard', bookings: 'My Bookings', cart: 'My Cart', profile: 'My Profile' };
    document.getElementById('cust-tab-title').textContent = labels[id] || id;
    if (id === 'overview')  renderOverview();
    if (id === 'bookings')  renderAllBookings();
    if (id === 'cart')      renderCartTab();
    if (id === 'profile')   renderProfile();
}

function custLogout() {
    if (confirm('Log out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

function getMyBookings() {
    return JSON.parse(localStorage.getItem('psh_bookings') || '[]');
}

// ── Overview ─────────────────────────────────────────────────────
function renderOverview() {
    const bookings = getMyBookings();
    const pending  = bookings.filter(b => b.status === 'Pending').length;
    const done     = bookings.filter(b => b.status === 'Completed').length;
    const cartCount = Cart.getCount();

    document.getElementById('cust-stat-bookings').textContent = bookings.length;
    document.getElementById('cust-stat-pending').textContent  = pending;
    document.getElementById('cust-stat-done').textContent     = done;
    document.getElementById('cust-stat-cart').textContent     = cartCount;

    // Simple bar chart
    renderChart(bookings);

    // Recent 3 bookings
    const recentEl = document.getElementById('cust-recent-bookings');
    const recent = bookings.slice(-3).reverse();
    if (recent.length === 0) {
        recentEl.innerHTML = '<p style="color:#94a3b8;">No bookings yet. <a href="services.html" style="color:#2563eb;">Browse services →</a></p>';
        return;
    }
    recentEl.innerHTML = recent.map(b => bookingRowHTML(b)).join('');
}

function renderChart(bookings) {
    const chartEl = document.getElementById('cust-chart');
    if (!chartEl) return;

    if (bookings.length === 0) {
        chartEl.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:2rem;">No booking data yet.</p>';
        return;
    }

    // Group by service name
    const counts = {};
    bookings.forEach(b => { counts[b.service] = (counts[b.service] || 0) + 1; });
    const max = Math.max(...Object.values(counts));

    chartEl.innerHTML = `
        <div class="cust-chart">
            ${Object.entries(counts).map(([name, count]) => `
                <div class="cust-chart-bar-wrap">
                    <div class="cust-chart-bar" style="height:${Math.max(20, (count/max)*120)}px; background:#2563eb;">
                        <span class="cust-chart-val">${count}</span>
                    </div>
                    <div class="cust-chart-label">${name.length > 10 ? name.slice(0,10)+'…' : name}</div>
                </div>
            `).join('')}
        </div>
        <p style="font-size:0.8rem; color:#94a3b8; text-align:center; margin-top:0.5rem;">Bookings per service</p>
    `;
}

function bookingRowHTML(b) {
    const statusColor = b.status === 'Completed' ? '#059669' : b.status === 'Cancelled' ? '#ef4444' : '#f59e0b';
    return `
        <div class="admin-list-row" style="margin-bottom:8px;">
            <div class="admin-list-row-info">
                <span style="font-size:1.5rem;">${b.icon || '🛠️'}</span>
                <div>
                    <strong>${b.service}</strong>
                    <div style="font-size:0.82rem; color:#64748b;">${b.date} · ${b.time}</div>
                    <div style="font-size:0.82rem; color:#64748b;">📍 ${b.address}</div>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                <span style="background:${statusColor}20; color:${statusColor}; padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:700;">${b.status}</span>
                <span style="font-size:0.85rem; font-weight:700; color:#059669;">${b.price || '—'}</span>
            </div>
        </div>`;
}

// ── All Bookings ──────────────────────────────────────────────────
function renderAllBookings() {
    const el = document.getElementById('cust-all-bookings');
    const bookings = getMyBookings().reverse();
    if (bookings.length === 0) {
        el.innerHTML = '<p style="color:#94a3b8;">No bookings yet. <a href="services.html" style="color:#2563eb;">Browse services →</a></p>';
        return;
    }
    el.innerHTML = bookings.map(b => bookingRowHTML(b)).join('');
}

// ── Cart Tab ──────────────────────────────────────────────────────
function renderCartTab() {
    const el    = document.getElementById('cust-cart-items');
    const items = Cart.getItems();

    if (items.length === 0) {
        el.innerHTML = '<p style="color:#94a3b8;">Cart is empty. <a href="services.html" style="color:#2563eb;">Browse services →</a></p>';
        return;
    }

    el.innerHTML = items.map(item => {
        const slug = item.name.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'');
        return `
        <div class="admin-list-row" style="margin-bottom:8px;">
            <div class="admin-list-row-info">
                <div class="cart-item-img" style="width:60px; height:60px; border-radius:8px; overflow:hidden; flex-shrink:0;">
                    <img src="${item.imageUrl || ''}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;"
                         onerror="this.parentElement.innerHTML='<div style=\\'font-size:1.8rem; display:flex; align-items:center; justify-content:center; height:100%; background:#f1f5f9;\\'>${item.icon}</div>'">
                </div>
                <div>
                    <strong>${item.icon} ${item.name}</strong>
                    <div style="font-size:0.85rem; color:#059669; font-weight:700;">${item.price || 'Market Rate'}</div>
                    <div style="font-size:0.8rem; color:#64748b;">Qty: ${item.qty || 1}</div>
                </div>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <a href="service-details.html?service=${slug}&cat=${item.catId}" class="svc-auth-btn-login" style="font-size:0.82rem;">📅 Book</a>
                <button class="btn-danger-sm" onclick="removeCartItem('${item.id}')">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

function removeCartItem(id) {
    Cart.removeItem(id);
    renderCartTab();
    document.getElementById('cust-stat-cart').textContent = Cart.getCount();
}

// ── Profile ───────────────────────────────────────────────────────
function renderProfile() {
    const u  = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const el = document.getElementById('cust-profile-info');
    if (!u) { el.innerHTML = '<p>Not logged in.</p>'; return; }

    el.innerHTML = `
        <div class="cust-profile-grid">
            <div class="cust-profile-avatar">${(u.name || 'U')[0].toUpperCase()}</div>
            <div class="cust-profile-details">
                <div class="cust-profile-row"><span>Name</span><strong>${u.name || '—'}</strong></div>
                <div class="cust-profile-row"><span>Email</span><strong>${u.email || '—'}</strong></div>
                <div class="cust-profile-row"><span>Phone</span><strong>${u.phone || '—'}</strong></div>
                <div class="cust-profile-row"><span>Role</span><strong style="text-transform:capitalize;">${u.role || 'customer'}</strong></div>
                <div class="cust-profile-row"><span>Member Since</span><strong>${u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'}</strong></div>
            </div>
        </div>
        <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid #f1f5f9;">
            <h4 style="margin-bottom:1rem; color:#1a2b4b;">📊 My Stats</h4>
            <div class="admin-stats-row" style="grid-template-columns:repeat(3,1fr);">
                <div class="admin-stat-card">
                    <div class="admin-stat-icon">📅</div>
                    <div class="admin-stat-num">${getMyBookings().length}</div>
                    <div class="admin-stat-label">Bookings</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon">🛒</div>
                    <div class="admin-stat-num">${Cart.getCount()}</div>
                    <div class="admin-stat-label">In Cart</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon">✅</div>
                    <div class="admin-stat-num">${getMyBookings().filter(b=>b.status==='Completed').length}</div>
                    <div class="admin-stat-label">Completed</div>
                </div>
            </div>
        </div>
    `;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderOverview();
});
