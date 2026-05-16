/**
 * PakServicesHub - Homepage Logic
 * Category buttons, service grid, live search, booking flow
 */

document.addEventListener('DOMContentLoaded', () => {
    initCityVillage();
    initCategorySection();
    initLiveSearch();
    initMostSearched();
    initBusinesses();
    initTestimonials();
    initScrollAnimations();
});

// ── Scroll Animations ────────────────────────────────────────────
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
}

// ── City / Village ───────────────────────────────────────────────
function initCityVillage() {
    const citySelect = document.getElementById('city-select');
    const villageInput = document.getElementById('village-search');
    const popularStrip = document.getElementById('popular-villages-strip');
    if (!citySelect) return;

    const locationData = store.getLocationData();

    // Populate cities
    locationData.cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city.id;
        opt.textContent = city.name;
        citySelect.appendChild(opt);
    });

    citySelect.addEventListener('change', (e) => {
        const cityId = e.target.value;
        if (cityId) {
            villageInput.disabled = false;
            villageInput.placeholder = 'Search your village...';
            showPopularVillages(cityId);
            document.getElementById('village-search-wrapper').classList.add('village-active');
            // Setup live village search
            setupVillageSearch(cityId);
        } else {
            villageInput.disabled = true;
            villageInput.value = '';
            villageInput.placeholder = 'First select a city';
            if (popularStrip) popularStrip.style.display = 'none';
            document.getElementById('village-search-wrapper').classList.remove('village-active');
            const vResults = document.getElementById('village-results');
            if (vResults) vResults.classList.remove('active');
        }
    });

    function setupVillageSearch(cityId) {
        const villageResults = document.getElementById('village-results');
        if (!villageResults) return;

        // Get all villages for this city from the hierarchical store
        const allVillages = store.getAllVillagesForCity(cityId);

        let vTimer = null;
        // Remove old listener by cloning
        const newInput = villageInput.cloneNode(true);
        villageInput.parentNode.replaceChild(newInput, villageInput);

        newInput.addEventListener('input', (e) => {
            clearTimeout(vTimer);
            vTimer = setTimeout(() => {
                const q = e.target.value.trim().toLowerCase();
                if (q.length < 1) { villageResults.classList.remove('active'); return; }

                const filtered = allVillages.filter(v =>
                    v.name.toLowerCase().includes(q) ||
                    (v.ucName && v.ucName.toLowerCase().includes(q))
                ).slice(0, 8);

                if (filtered.length > 0) {
                    villageResults.innerHTML = filtered.map(v => `
                        <div class="search-item" onclick="selectVillageResult('${v.name.replace(/'/g,"\\'")}')">
                            <div class="search-icon">📍</div>
                            <div class="search-text">
                                <div class="search-title">${v.name}</div>
                                <div class="search-cat">${v.ucName || ''} ${v.tehsilName ? '· ' + v.tehsilName : ''}</div>
                            </div>
                        </div>
                    `).join('');
                    villageResults.classList.add('active');
                } else {
                    villageResults.innerHTML = `<div class="search-item">No villages found for "<strong>${q}</strong>"</div>`;
                    villageResults.classList.add('active');
                }
            }, 150);
        });

        // Close on outside click
        document.addEventListener('click', (ev) => {
            if (!newInput.contains(ev.target) && !villageResults.contains(ev.target)) {
                villageResults.classList.remove('active');
            }
        });
    }

    function showPopularVillages(cityId) {
        const row = document.getElementById('popular-chips-row');
        if (!row) return;
        row.innerHTML = '';
        const villages = store.getAllVillagesForCity(cityId).slice(0, 6);
        if (villages.length > 0) {
            popularStrip.style.display = 'flex';
            villages.forEach(v => {
                const span = document.createElement('span');
                span.className = 'chip-pak chip-village';
                span.textContent = v.name;
                span.onclick = () => { villageInput.value = v.name; };
                row.appendChild(span);
            });
        }
    }

    // Popular service chips
    document.querySelectorAll('.chip-pak[data-val]').forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.getAttribute('data-val');
            document.getElementById('main-search').value = val;
            document.getElementById('main-search').dispatchEvent(new Event('input'));
        });
    });
}

// ── Most Searched Services (quick icon grid) ─────────────────────
function initMostSearched() {
    const container = document.getElementById('services-container');
    if (!container) return;
    const services = store.getServices();
    container.innerHTML = services.map(s => {
        const slug = s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `
        <div class="searched-card animate-up" onclick="location.href='pages/service-details.html?service=${slug}&cat=home'">
            <div class="icon-circle icon-circle-colored" data-color="${s.color}">${s.icon}</div>
            <h4>${s.title}s</h4>
            <p>${s.desc}</p>
        </div>`;
    }).join('');

    // Apply colors via JS (avoids inline style)
    container.querySelectorAll('.icon-circle-colored').forEach(el => {
        const color = el.getAttribute('data-color');
        if (color) {
            el.style.background = color + '18';
            el.style.color = color;
        }
    });
}

// ── Village result selection (global) ───────────────────────────
function selectVillageResult(name) {
    const input = document.getElementById('village-search');
    if (input) input.value = name;
    const results = document.getElementById('village-results');
    if (results) results.classList.remove('active');
}

// ── Live Search ──────────────────────────────────────────────────
function initLiveSearch() {
    const searchInput = document.getElementById('main-search');
    const resultsPanel = document.getElementById('search-results');
    if (!searchInput || !resultsPanel) return;

    // Build search index from full catalog
    const catalog = store.getCatalog();
    const allItems = [];
    catalog.forEach(cat => {
        cat.items.forEach(item => {
            allItems.push({
                id:       item.id,
                name:     item.name,
                icon:     item.icon,
                price:    item.price || '',
                imageUrl: item.imageUrl || '',
                catId:    cat.id,
                catLabel: cat.label,
                slug:     item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, '')
            });
        });
    });

    let timer = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const q = e.target.value.trim().toLowerCase();
            if (q.length < 1) { resultsPanel.classList.remove('active'); return; }

            const filtered = allItems.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.catLabel.toLowerCase().includes(q)
            ).slice(0, 8);

            if (filtered.length > 0) {
                resultsPanel.innerHTML = `
                    <div class="search-header-label">Services Found</div>
                    ${filtered.map(s => `
                        <div class="search-item" onclick="location.href='pages/service-details.html?service=${s.slug}&cat=${s.catId}'">
                            <div class="search-icon">${s.icon}</div>
                            <div class="search-text">
                                <div class="search-title">${s.name}</div>
                                <div class="search-cat">${s.catLabel} ${s.price ? '· ' + s.price : ''}</div>
                            </div>
                        </div>
                    `).join('')}
                `;
            } else {
                resultsPanel.innerHTML = `<div class="search-item search-no-result">No services found for "<strong>${q}</strong>"</div>`;
            }
            resultsPanel.classList.add('active');
        }, 150);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsPanel.contains(e.target)) {
            resultsPanel.classList.remove('active');
        }
    });
}

// ── Category Section ─────────────────────────────────────────────
function initCategorySection() {
    const catalog = store.getCatalog();
    const btnRow  = document.getElementById('home-cat-buttons');
    const grid    = document.getElementById('home-services-grid');
    if (!btnRow || !grid) return;

    // Render category buttons
    catalog.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.className = 'home-cat-btn' + (idx === 0 ? ' active' : '');
        btn.setAttribute('data-cat', cat.id);
        btn.style.setProperty('--hcat-color', cat.color);
        btn.innerHTML = cat.label;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.home-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatServices(cat.id);
        });
        btnRow.appendChild(btn);
    });

    // Render first category by default
    renderCatServices(catalog[0].id);

    function renderCatServices(catId) {
        const cat = store.getCatalog().find(c => c.id === catId);
        if (!cat) return;
        grid.innerHTML = '';

        cat.items.forEach(item => {
            // Same slug logic as service-details.js — strip non-alpha prefix, no leading dashes
            const slug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, '');
            const card = document.createElement('div');
            card.className = 'home-svc-card animate-up';
            card.innerHTML = `
                <div class="home-svc-img">
                    <img src="${item.imageUrl || ''}" alt="${item.name}"
                         onerror="this.parentElement.innerHTML='<div class=\\'home-svc-img-fallback\\'>${item.icon}</div>'">
                </div>
                <div class="home-svc-body">
                    <div class="home-svc-name">${item.icon} ${item.name}</div>
                    <div class="home-svc-price">${item.price || 'Market Rate'}</div>
                    <div class="home-svc-actions">
                        <button class="home-svc-book" onclick="homeBookService('${item.id}','${catId}','${slug}')">📅 Book</button>
                        <button class="home-svc-cart" onclick="homeAddToCart('${item.id}','${catId}')">🛒 Add</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Re-observe new elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.05 });
        grid.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
    }
}

// ── Auth Check ───────────────────────────────────────────────────
function isLoggedIn() {
    try {
        const u = JSON.parse(localStorage.getItem('currentUser'));
        return u && u.role === 'customer';
    } catch(e) { return false; }
}

function showAuthModal(action, itemId, catId, slug) {
    // Remove existing modal
    const existing = document.getElementById('auth-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    overlay.innerHTML = `
        <div class="auth-modal-card">
            <div class="auth-modal-icon">🔐</div>
            <h3>Login Required</h3>
            <p>You need to be logged in as a customer to <strong>${action === 'book' ? 'book this service' : 'add to cart'}</strong>.</p>
            <div class="auth-modal-btns">
                <a href="pages/login.html?redirect=service-details.html%3Fservice%3D${slug}%26cat%3D${catId}" class="auth-modal-login">👤 Login</a>
                <a href="pages/signup.html" class="auth-modal-signup">👥 Sign Up</a>
            </div>
            <button class="auth-modal-close" onclick="document.getElementById('auth-modal-overlay').remove()">✕ Close</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('open'), 10);
}

function homeBookService(itemId, catId, slug) {
    if (!isLoggedIn()) {
        showAuthModal('book', itemId, catId, slug);
        return;
    }
    location.href = 'pages/service-details.html?service=' + slug + '&cat=' + catId + '&action=book';
}

function homeAddToCart(itemId, catId) {
    if (!isLoggedIn()) {
        const cat  = store.getCatalog().find(c => c.id === catId);
        const item = cat ? cat.items.find(i => i.id === itemId) : null;
        const slug = item ? item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, '') : '';
        showAuthModal('cart', itemId, catId, slug);
        return;
    }
    const cat  = store.getCatalog().find(c => c.id === catId);
    const item = cat ? cat.items.find(i => i.id === itemId) : null;
    if (!item) return;
    Cart.addItem({ id: item.id, name: item.name, icon: item.icon, imageUrl: item.imageUrl, price: item.price, catId });
    showHomeToast(item.icon + ' ' + item.name + ' added to cart!');
}

function showHomeToast(msg) {
    let stack = document.getElementById('home-toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'home-toast-stack';
        stack.className = 'lm-toast-stack';
        document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'lm-toast lm-toast-success';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}

// ── Businesses ───────────────────────────────────────────────────
function initBusinesses() {
    const bizContainer = document.getElementById('business-container');
    if (!bizContainer) return;
    const locationData = store.getLocationData();
    bizContainer.innerHTML = '';
    store.getBusinesses().forEach(b => {
        const card = document.createElement('div');
        card.className = 'business-card animate-up';
        const city = locationData.cities.find(c => c.id === b.cityId);
        const locLabel = city ? '📍 ' + b.loc + ', ' + city.name : '📍 ' + b.loc;
        card.innerHTML = `
            <div class="biz-image">
                <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
                <img src="${b.image}" alt="${b.name}" onerror="this.src='sources/logo.png'">
                <div class="verify-badge">🛡️ Verified</div>
            </div>
            <div class="biz-content">
                <h4 class="biz-title">${b.name}</h4>
                <p class="biz-loc">${locLabel}</p>
                <div class="biz-rating-row">
                    <span class="biz-star">★</span> ${b.rating}
                    <span class="biz-reviews">(0)</span>
                    <span class="biz-cat-badge">${b.category}</span>
                </div>
            </div>
            <div class="biz-footer">
                <button class="btn-biz">📞</button>
                <button class="btn-biz">💬</button>
                <button class="btn-biz btn-biz-view">Details →</button>
            </div>
        `;
        bizContainer.appendChild(card);
    });
}

// ── Testimonials ─────────────────────────────────────────────────
function initTestimonials() {
    const testContainer = document.getElementById('testimonial-container');
    if (!testContainer) return;
    testContainer.innerHTML = '';
    store.getTestimonials().forEach(t => {
        const card = document.createElement('div');
        card.className = 'video-card animate-up';
        card.innerHTML = `
            <div class="video-frame">
                <img src="${t.thumb}" alt="Thumbnail" onerror="this.src='sources/logo.png'">
                <div class="play-btn">▶</div>
            </div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-user">
                <img src="${t.thumb}" class="user-avatar" alt="${t.name}" onerror="this.src='sources/logo.png'">
                <div>
                    <h5>${t.name}</h5>
                    <p>📍 ${t.biz}</p>
                </div>
            </div>
        `;
        testContainer.appendChild(card);
    });
}
