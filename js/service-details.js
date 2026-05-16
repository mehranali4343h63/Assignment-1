/**
 * PakServicesHub - Service Details Page v2.0
 * Clean layout: image + info side by side, booking inline, no related images
 */

let _currentItem = null;
let _currentCat  = null;

document.addEventListener('DOMContentLoaded', () => {
    loadServiceDetails();
});

// ── Slug helper ──────────────────────────────────────────────────
function toSlug(str) {
    return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ── Load & Render ────────────────────────────────────────────────
function loadServiceDetails() {
    const params = new URLSearchParams(window.location.search);
    const rawSlug = (params.get('service') || '').replace(/^-+/, ''); // strip leading dashes
    const catId   = params.get('cat') || '';

    const catalog = store.getCatalog();
    let foundItem = null;
    let foundCat  = null;

    // Pass 1: match by catId + slug
    if (catId) {
        const cat = catalog.find(c => c.id === catId);
        if (cat) {
            cat.items.forEach(item => {
                if (!foundItem && toSlug(item.name) === rawSlug) {
                    foundItem = item; foundCat = cat;
                }
            });
        }
    }

    // Pass 2: match by slug across all categories
    if (!foundItem) {
        catalog.forEach(cat => {
            cat.items.forEach(item => {
                if (!foundItem && toSlug(item.name) === rawSlug) {
                    foundItem = item; foundCat = cat;
                }
            });
        });
    }

    // Pass 3: partial match (e.g. "ac-repair" matches "AC Repair")
    if (!foundItem) {
        catalog.forEach(cat => {
            cat.items.forEach(item => {
                if (!foundItem) {
                    const s = toSlug(item.name);
                    if (s.includes(rawSlug) || rawSlug.includes(s)) {
                        foundItem = item; foundCat = cat;
                    }
                }
            });
        });
    }

    const page = document.getElementById('svc-detail-page');

    if (!foundItem) {
        page.innerHTML = `
            <div class="svc-not-found">
                <div class="svc-not-found-icon">🔍</div>
                <h2>Service Not Found</h2>
                <p>We couldn't find "<strong>${rawSlug.replace(/-/g,' ')}</strong>".</p>
                <a href="../index.html" class="svc-back-btn">← Back to Home</a>
            </div>`;
        return;
    }

    _currentItem = foundItem;
    _currentCat  = foundCat;
    document.title = foundItem.name + ' | PakServicesHub';

    // Get user info from localStorage (filled during signup)
    let userName = '', userPhone = '';
    try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (u) { userName = u.name || ''; userPhone = u.phone || ''; }
    } catch(e) {}

    const today = new Date().toISOString().split('T')[0];

    page.innerHTML = `
        <!-- Breadcrumb -->
        <nav class="svc-breadcrumb">
            <a href="../index.html">Home</a>
            <span class="svc-bc-sep">›</span>
            <span>${foundCat.label}</span>
            <span class="svc-bc-sep">›</span>
            <span class="svc-bc-current">${foundItem.name}</span>
        </nav>

        <!-- Two-column layout: image left, booking right -->
        <div class="svc-layout">

            <!-- LEFT: Image + Service Info -->
            <div class="svc-left-col">
                <div class="svc-img-card">
                    <img src="${foundItem.imageUrl || ''}"
                         alt="${foundItem.name}"
                         class="svc-main-img"
                         onerror="this.style.display='none'; document.getElementById('svc-img-fallback').style.display='flex';">
                    <div class="svc-img-fallback" id="svc-img-fallback" style="display:none;">${foundItem.icon}</div>
                </div>

                <div class="svc-info-card">
                    <div class="svc-info-header">
                        <span class="svc-big-icon">${foundItem.icon}</span>
                        <div>
                            <h1 class="svc-title">${foundItem.name}</h1>
                            <span class="svc-cat-tag">${foundCat.label}</span>
                        </div>
                    </div>

                    <div class="svc-price-row">
                        <span class="svc-price-label">Starting Price</span>
                        <span class="svc-price-value">${foundItem.price || 'Market Rate'}</span>
                    </div>

                    <div class="svc-badges">
                        <span class="svc-badge">✅ Verified</span>
                        <span class="svc-badge">⭐ 4.8/5</span>
                        <span class="svc-badge">🕐 24/7</span>
                        <span class="svc-badge">📍 Pasrur &amp; Sialkot</span>
                    </div>

                    <p class="svc-desc">
                        Find trusted and verified <strong>${foundItem.name}</strong> professionals in your area.
                        All providers are background-checked and rated by real customers.
                    </p>

                    <div class="svc-quick-btns">
                        <button class="svc-btn-cart" onclick="handleAddToCart()">🛒 Add to Cart</button>
                    </div>
                    <p class="svc-note">💡 No payment required upfront. Pay after service is completed.</p>
                </div>
            </div>

            <!-- RIGHT: Booking Form -->
            <div class="svc-right-col">
                <div class="svc-booking-card">
                    <h2 class="svc-booking-title">📅 Book This Service</h2>
                    <p class="svc-booking-subtitle">${foundItem.icon} <strong>${foundItem.name}</strong> — ${foundItem.price || 'Market Rate'}</p>

                    <!-- Auth message (shown only on confirm press) -->
                    <div class="svc-auth-msg" id="svc-auth-msg" style="display:none;"></div>

                    <div class="svc-booking-form" id="svc-booking-form">
                        <div class="svc-form-group">
                            <label>📅 Service Date</label>
                            <input type="date" id="bk-date" class="svc-form-input" min="${today}" value="${today}">
                        </div>

                        <div class="svc-form-group">
                            <label>🕐 Time Slot</label>
                            <select id="bk-time" class="svc-form-input">
                                <option>Morning (09:00 – 12:00)</option>
                                <option>Afternoon (12:00 – 15:00)</option>
                                <option>Evening (15:00 – 18:00)</option>
                            </select>
                        </div>

                        <div class="svc-form-group">
                            <label>📍 Address / Location</label>
                            <input type="text" id="bk-address" class="svc-form-input" placeholder="Enter your full address">
                        </div>

                        <div class="svc-form-group">
                            <label>🗺️ Location on Map</label>
                            <div class="svc-map-row">
                                <input type="text" id="bk-map-link" class="svc-form-input" placeholder="Paste Google Maps link (optional)">
                                <a href="https://maps.google.com" target="_blank" class="svc-map-btn" title="Open Google Maps">📌 Open Map</a>
                            </div>
                            <div id="bk-map-preview" class="svc-map-preview" style="display:none;"></div>
                        </div>
                    </div>

                    <button class="svc-btn-confirm" onclick="confirmBooking()">✅ Confirm Booking</button>
                    <div id="svc-booking-success" class="svc-booking-success" style="display:none;"></div>
                </div>
            </div>
        </div>
    `;

    // Map link live preview
    document.getElementById('bk-map-link').addEventListener('input', function() {
        const preview = document.getElementById('bk-map-preview');
        const val = this.value.trim();
        if (val.startsWith('http')) {
            preview.style.display = 'block';
            preview.innerHTML = `<a href="${val}" target="_blank" class="svc-map-link-preview">📌 View selected location</a>`;
        } else {
            preview.style.display = 'none';
        }
    });
}

// ── Auth helpers ─────────────────────────────────────────────────
function isLoggedIn() {
    try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        return u && (u.role === 'customer' || u.role === 'admin');
    } catch(e) { return false; }
}

function hasAccount() {
    // Check if any customer account exists in localStorage
    try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        return !!u;
    } catch(e) { return false; }
}

function showAuthMsg(html) {
    const el = document.getElementById('svc-auth-msg');
    if (!el) return;
    el.innerHTML = html;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Confirm Booking ──────────────────────────────────────────────
function confirmBooking() {
    // Auth check first
    if (!isLoggedIn()) {
        const slug  = _currentItem ? toSlug(_currentItem.name) : '';
        const catId = _currentCat  ? _currentCat.id : '';
        const redirect = encodeURIComponent('service-details.html?service=' + slug + '&cat=' + catId);

        if (!hasAccount()) {
            showAuthMsg(`
                <div class="svc-auth-alert svc-auth-no-account">
                    <span class="svc-auth-icon">⚠️</span>
                    <div>
                        <strong>No account found.</strong>
                        <p>Please sign up first, then login before booking.</p>
                        <div class="svc-auth-links">
                            <a href="signup.html" class="svc-auth-btn-signup">👥 Sign Up</a>
                            <a href="login.html?redirect=${redirect}" class="svc-auth-btn-login">👤 Login</a>
                        </div>
                    </div>
                </div>`);
        } else {
            showAuthMsg(`
                <div class="svc-auth-alert svc-auth-login-required">
                    <span class="svc-auth-icon">🔐</span>
                    <div>
                        <strong>Login required before booking.</strong>
                        <p>You have an account. Please login as a customer to continue.</p>
                        <div class="svc-auth-links">
                            <a href="login.html?redirect=${redirect}" class="svc-auth-btn-login">👤 Login as Customer</a>
                        </div>
                    </div>
                </div>`);
        }
        return;
    }

    // Validate form
    const date    = document.getElementById('bk-date').value;
    const time    = document.getElementById('bk-time').value;
    const address = document.getElementById('bk-address').value.trim();
    const mapLink = document.getElementById('bk-map-link').value.trim();

    if (!date)    { showAuthMsg('<div class="svc-auth-alert svc-auth-warn">⚠️ Please select a service date.</div>'); return; }
    if (!address) { showAuthMsg('<div class="svc-auth-alert svc-auth-warn">⚠️ Please enter your address.</div>'); return; }

    // Hide auth msg
    document.getElementById('svc-auth-msg').style.display = 'none';

    // Get user info
    let userName = '', userPhone = '';
    try {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (u) { userName = u.name || ''; userPhone = u.phone || ''; }
    } catch(e) {}

    // Save booking
    const bookings = JSON.parse(localStorage.getItem('psh_bookings') || '[]');
    const booking = {
        id:       Date.now(),
        service:  _currentItem.name,
        icon:     _currentItem.icon,
        price:    _currentItem.price,
        catId:    _currentCat ? _currentCat.id : '',
        imageUrl: _currentItem.imageUrl,
        name:     userName,
        phone:    userPhone,
        date, time, address, mapLink,
        status:   'Pending',
        bookedAt: new Date().toISOString()
    };
    bookings.push(booking);
    localStorage.setItem('psh_bookings', JSON.stringify(bookings));

    // Hide form, show success
    document.getElementById('svc-booking-form').style.display = 'none';
    document.querySelector('.svc-btn-confirm').style.display = 'none';

    const successEl = document.getElementById('svc-booking-success');
    successEl.style.display = 'block';
    successEl.innerHTML = `
        <div class="svc-success-icon">✅</div>
        <h3>Booking Confirmed!</h3>
        <div class="svc-success-details">
            <div class="svc-success-row"><span>Service</span><strong>${_currentItem.icon} ${_currentItem.name}</strong></div>
            <div class="svc-success-row"><span>Price</span><strong>${_currentItem.price || 'Market Rate'}</strong></div>
            <div class="svc-success-row"><span>Date</span><strong>${date}</strong></div>
            <div class="svc-success-row"><span>Time</span><strong>${time}</strong></div>
            <div class="svc-success-row"><span>Address</span><strong>${address}</strong></div>
            ${mapLink ? `<div class="svc-success-row"><span>Map</span><a href="${mapLink}" target="_blank" class="svc-map-link-preview">📌 View Location</a></div>` : ''}
            ${userName ? `<div class="svc-success-row"><span>Booked by</span><strong>${userName}</strong></div>` : ''}
        </div>
        <p class="svc-success-note">We will contact you shortly to confirm your appointment.</p>
        <a href="../index.html" class="svc-back-btn">← Back to Home</a>
    `;
    successEl.scrollIntoView({ behavior: 'smooth' });
}

// ── Add to Cart ──────────────────────────────────────────────────
function handleAddToCart() {
    if (!isLoggedIn()) {
        const slug  = _currentItem ? toSlug(_currentItem.name) : '';
        const catId = _currentCat  ? _currentCat.id : '';
        const redirect = encodeURIComponent('service-details.html?service=' + slug + '&cat=' + catId);

        if (!hasAccount()) {
            showAuthMsg(`
                <div class="svc-auth-alert svc-auth-no-account">
                    <span class="svc-auth-icon">⚠️</span>
                    <div>
                        <strong>No account found.</strong>
                        <p>Please sign up first, then login to add to cart.</p>
                        <div class="svc-auth-links">
                            <a href="signup.html" class="svc-auth-btn-signup">👥 Sign Up</a>
                            <a href="login.html?redirect=${redirect}" class="svc-auth-btn-login">👤 Login</a>
                        </div>
                    </div>
                </div>`);
        } else {
            showAuthMsg(`
                <div class="svc-auth-alert svc-auth-login-required">
                    <span class="svc-auth-icon">🔐</span>
                    <div>
                        <strong>Login required.</strong>
                        <p>Please login as a customer to add to cart.</p>
                        <div class="svc-auth-links">
                            <a href="login.html?redirect=${redirect}" class="svc-auth-btn-login">👤 Login</a>
                        </div>
                    </div>
                </div>`);
        }
        return;
    }

    Cart.addItem({
        id:       _currentItem.id,
        name:     _currentItem.name,
        icon:     _currentItem.icon,
        imageUrl: _currentItem.imageUrl,
        price:    _currentItem.price,
        catId:    _currentCat ? _currentCat.id : ''
    });

    // Toast
    let stack = document.getElementById('svc-toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'svc-toast-stack';
        stack.className = 'lm-toast-stack';
        document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'lm-toast lm-toast-success';
    t.textContent = _currentItem.icon + ' ' + _currentItem.name + ' added to cart!';
    stack.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}
