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
                slug:     item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, ''),
                type:     'service'
            });
        });
    });

    // Also index businesses
    const businesses = store.getBusinesses();
    businesses.forEach(b => {
        allItems.push({
            id:       'biz-' + b.id,
            name:     b.name,
            icon:     '🏢',
            price:    b.category || '',
            catId:    null,
            catLabel: '📍 ' + (b.loc || ''),
            slug:     '',
            type:     'business',
            bizId:    b.id
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
                s.catLabel.toLowerCase().includes(q) ||
                (s.price && s.price.toLowerCase().includes(q))
            ).slice(0, 10);

            if (filtered.length > 0) {
                const services = filtered.filter(s => s.type === 'service');
                const bizs     = filtered.filter(s => s.type === 'business');

                let html = '';
                if (services.length) {
                    html += `<div class="search-header-label">Services</div>`;
                    html += services.map(s => `
                        <div class="search-item" onclick="location.href='pages/service-details.html?service=${s.slug}&cat=${s.catId}'">
                            <div class="search-icon">${s.icon}</div>
                            <div class="search-text">
                                <div class="search-title">${s.name}</div>
                                <div class="search-cat">${s.catLabel} ${s.price ? '· ' + s.price : ''}</div>
                            </div>
                        </div>`).join('');
                }
                if (bizs.length) {
                    html += `<div class="search-header-label">Businesses</div>`;
                    html += bizs.map(b => `
                        <div class="search-item" onclick="openBizDetail(${b.bizId})">
                            <div class="search-icon">${b.icon}</div>
                            <div class="search-text">
                                <div class="search-title">${b.name}</div>
                                <div class="search-cat">${b.price} · ${b.catLabel}</div>
                            </div>
                        </div>`).join('');
                }
                resultsPanel.innerHTML = html;
            } else {
                resultsPanel.innerHTML = `<div class="search-item search-no-result">No results for "<strong>${q}</strong>"</div>`;
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

    // Render category buttons — toggle on/off, show prompt first
    catalog.forEach((cat) => {
        const btn = document.createElement('button');
        btn.className = 'home-cat-btn';
        btn.setAttribute('data-cat', cat.id);
        btn.style.setProperty('--hcat-color', cat.color);
        btn.innerHTML = cat.label;
        btn.addEventListener('click', () => {
            const isAlreadyActive = btn.classList.contains('active');
            // Deactivate all buttons
            document.querySelectorAll('.home-cat-btn').forEach(b => b.classList.remove('active'));

            if (isAlreadyActive) {
                // Same button clicked again — close and show prompt
                showCatPrompt(grid);
            } else {
                // New button clicked — open its services
                btn.classList.add('active');
                renderCatServices(cat.id);
            }
        });
        btnRow.appendChild(btn);
    });

    // Show prompt — no cards until user picks a category
    showCatPrompt(grid);

    function showCatPrompt(grid) {
        grid.innerHTML = `
            <div class="home-cat-prompt">
                <div class="home-cat-prompt-icon">👆</div>
                <div class="home-cat-prompt-text">Select a category above to browse services</div>
            </div>`;
    }

    function renderCatServices(catId) {
        const cat = store.getCatalog().find(c => c.id === catId);
        if (!cat) return;
        grid.innerHTML = '';

        cat.items.forEach(item => {
            const slug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, '');
            const card = document.createElement('div');
            card.className = 'home-svc-card animate-up';
            card.innerHTML = `
                <div class="home-svc-img">
                    <img src="${item.imageUrl || ''}" alt="${item.name}" loading="lazy"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                    <div class="home-svc-img-fallback" style="display:none;">${item.icon}</div>
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

        // Re-observe new elements for scroll animation
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

    const businesses = store.getBusinesses();
    if (businesses.length === 0) {
        bizContainer.innerHTML = '<p class="biz-empty">No businesses listed yet.</p>';
        return;
    }

    businesses.forEach(b => {
        const card = document.createElement('div');
        card.className = 'business-card animate-up';

        const city = locationData.cities.find(c => c.id === b.cityId);
        const locLabel = city ? b.loc + ', ' + city.name : b.loc;

        // Fix image path — handle both '../sources/' and 'sources/' prefixes
        const imgSrc = (b.image || '').replace(/^\.\.\//, '');

        // Detect video type for embed
        const videoLink = b.videoLink || '';
        const mapLink   = b.mapLink   || '';

        // Convert any video URL to embeddable URL
        let embedUrl = '';
        if (videoLink) {
            if (videoLink.includes('youtube.com/watch')) {
                try { const vid = new URL(videoLink).searchParams.get('v'); embedUrl = vid ? 'https://www.youtube.com/embed/' + vid : videoLink; } catch(e) { embedUrl = videoLink; }
            } else if (videoLink.includes('youtu.be/')) {
                const vid = videoLink.split('youtu.be/')[1].split('?')[0];
                embedUrl = 'https://www.youtube.com/embed/' + vid;
            } else if (videoLink.includes('youtube.com/embed/')) {
                embedUrl = videoLink;
            } else if (videoLink.includes('tiktok.com')) {
                // TikTok — open directly in new tab (can't embed)
                embedUrl = videoLink;
            } else {
                embedUrl = videoLink;
            }
        }

        card.innerHTML = `
            <div class="biz-image">
                <span class="status-badge ${(b.status || 'open').toLowerCase()}">${b.status || 'OPEN'}</span>
                <img src="${imgSrc}" alt="${b.name}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="biz-img-fallback" style="display:none;">🏢</div>
                ${b.verified ? '<div class="verify-badge">🛡️ Verified</div>' : ''}
                ${videoLink ? `<div class="biz-video-badge" onclick="handleBizVideo('${embedUrl}','${b.name}','${videoLink}')">▶ Video</div>` : ''}
            </div>
            <div class="biz-content">
                <h4 class="biz-title">${b.name}</h4>
                <p class="biz-loc">📍 ${locLabel}</p>
                <div class="biz-rating-row">
                    <span class="biz-star">★</span>
                    <span>${b.rating || 5}</span>
                    <span class="biz-reviews">(${b.reviews || 0} reviews)</span>
                    <span class="biz-cat-badge">${b.category || ''}</span>
                </div>
            </div>
            <div class="biz-footer">
                ${mapLink
                    ? `<a href="${mapLink}" target="_blank" class="btn-biz btn-biz-map" title="View on Map">📍 Map</a>`
                    : `<button class="btn-biz" disabled title="No map link">📍</button>`
                }
                ${videoLink
                    ? `<button class="btn-biz btn-biz-vid" onclick="handleBizVideo('${embedUrl}','${b.name}','${videoLink}')" title="Watch Video">▶ Video</button>`
                    : `<button class="btn-biz" disabled title="No video">▶</button>`
                }
                <button class="btn-biz btn-biz-view" onclick="openBizDetail(${b.id})">Details →</button>
            </div>
        `;
        bizContainer.appendChild(card);
    });
}

// Smart video handler — YouTube opens in modal, TikTok/Reel opens in new tab
function handleBizVideo(embedUrl, name, originalUrl) {
    if (!originalUrl) return;
    if (originalUrl.includes('tiktok.com') || originalUrl.includes('instagram.com') || originalUrl.includes('facebook.com')) {
        window.open(originalUrl, '_blank');
    } else {
        openBizVideo(embedUrl, name);
    }
}

// Open video modal
function openBizVideo(embedUrl, name) {
    if (!embedUrl) return;

    let modal = document.getElementById('biz-video-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'biz-video-modal';
        modal.className = 'biz-video-modal-overlay';
        modal.innerHTML = `
            <div class="biz-video-modal-card">
                <div class="biz-video-modal-header">
                    <span id="biz-video-title"></span>
                    <button class="biz-video-close" onclick="closeBizVideo()">✕</button>
                </div>
                <div class="biz-video-frame">
                    <iframe id="biz-video-iframe" src="" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeBizVideo(); });
    }
    document.getElementById('biz-video-title').textContent = name;
    document.getElementById('biz-video-iframe').src = embedUrl;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBizVideo() {
    const modal = document.getElementById('biz-video-modal');
    if (modal) {
        modal.classList.remove('open');
        document.getElementById('biz-video-iframe').src = '';
        document.body.style.overflow = '';
    }
}

function openBizDetail(id) {
    const b = store.getBusinesses().find(x => x.id === id);
    if (!b) return;

    const existing = document.getElementById('biz-detail-modal');
    if (existing) existing.remove();

    const imgSrc = (b.image || '').replace(/^\.\.\//, '');
    const videoLink = b.videoLink || '';
    const mapLink   = b.mapLink   || '';

    let embedUrl = '';
    if (videoLink) {
        if (videoLink.includes('youtube.com/watch')) {
            try { const vid = new URL(videoLink).searchParams.get('v'); embedUrl = vid ? 'https://www.youtube.com/embed/' + vid : videoLink; } catch(e) { embedUrl = videoLink; }
        } else if (videoLink.includes('youtu.be/')) {
            const vid = videoLink.split('youtu.be/')[1].split('?')[0];
            embedUrl = 'https://www.youtube.com/embed/' + vid;
        } else { embedUrl = videoLink; }
    }

    const overlay = document.createElement('div');
    overlay.id = 'biz-detail-modal';
    overlay.className = 'biz-detail-overlay';
    overlay.innerHTML = `
        <div class="biz-detail-card">
            <button class="biz-detail-close" onclick="closeBizDetail()">✕</button>
            <div class="biz-detail-img">
                <img src="${imgSrc}" alt="${b.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                <div class="biz-detail-img-fallback" style="display:none;">🏢</div>
                <span class="biz-detail-status ${(b.status||'open').toLowerCase()}">${b.status || 'OPEN'}</span>
            </div>
            <div class="biz-detail-body">
                <h2 class="biz-detail-name">${b.name}</h2>
                <p class="biz-detail-loc">📍 ${b.loc}</p>
                <div class="biz-detail-meta">
                    <span class="biz-detail-cat">${b.category || 'General'}</span>
                    <span class="biz-detail-rating">⭐ ${b.rating || 5}/5 <span style="color:#94a3b8;">(${b.reviews || 0} reviews)</span></span>
                </div>
                ${b.description ? `<p class="biz-detail-desc">${b.description}</p>` : ''}
                <div class="biz-detail-actions">
                    ${mapLink ? `<a href="${mapLink}" target="_blank" class="biz-detail-btn biz-detail-map">📍 View on Map</a>` : ''}
                    ${videoLink ? `<button class="biz-detail-btn biz-detail-vid" onclick="closeBizDetail();openBizVideo('${embedUrl}','${b.name}')">▶ Watch Video</button>` : ''}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('open'), 10);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeBizDetail(); });
}

function closeBizDetail() {
    const modal = document.getElementById('biz-detail-modal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.remove(), 300);
    }
}

// ── Testimonials ─────────────────────────────────────────────────
function initTestimonials() {
    const testContainer = document.getElementById('testimonial-container');
    if (!testContainer) return;
    testContainer.innerHTML = '';

    const list = store.getTestimonials();

    if (list.length === 0) {
        // Nice empty state instead of blank
        testContainer.innerHTML = `
            <div class="test-empty-state">
                <div class="test-empty-icon">🎬</div>
                <h3>Customer Feedback Coming Soon</h3>
                <p>We're collecting video testimonials from our happy customers.<br>Check back soon!</p>
                <a href="pages/contact.html" class="test-empty-cta">Share Your Experience →</a>
            </div>`;
        return;
    }

    list.forEach(t => {
        const videoLink = t.video || '';
        let embedUrl = '';
        if (videoLink) {
            if (videoLink.includes('youtube.com/watch')) {
                try { const vid = new URL(videoLink).searchParams.get('v'); embedUrl = vid ? 'https://www.youtube.com/embed/' + vid + '?autoplay=1' : videoLink; } catch(e) { embedUrl = videoLink; }
            } else if (videoLink.includes('youtu.be/')) {
                const vid = videoLink.split('youtu.be/')[1].split('?')[0];
                embedUrl = 'https://www.youtube.com/embed/' + vid + '?autoplay=1';
            } else if (videoLink.includes('youtube.com/embed/')) {
                embedUrl = videoLink.includes('?') ? videoLink + '&autoplay=1' : videoLink + '?autoplay=1';
            } else {
                embedUrl = videoLink;
            }
        }

        // Build star rating
        const rating = parseInt(t.rating) || 5;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        const card = document.createElement('div');
        card.className = 'test-card';
        card.innerHTML = `
            <div class="test-video-wrap" id="vframe-${t.id}">
                ${videoLink
                    ? `<div class="test-iframe-wrap">
                           <iframe src="${embedUrl.replace('?autoplay=1','')}" frameborder="0"
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               allowfullscreen loading="lazy"></iframe>
                       </div>`
                    : `<div class="test-no-video">
                           <div class="test-avatar-big">${t.name ? t.name[0].toUpperCase() : '?'}</div>
                       </div>`
                }
            </div>
            <div class="test-body">
                <div class="test-stars">${stars}</div>
                <p class="test-quote">"${t.text || 'Great service!'}"</p>
                <div class="test-user-row">
                    <div class="test-avatar">${t.name ? t.name[0].toUpperCase() : '?'}</div>
                    <div>
                        <div class="test-name">${t.name}</div>
                        <div class="test-loc">📍 ${t.biz || 'Pasrur'}</div>
                    </div>
                </div>
                ${t.service ? `<div class="test-service-tag">🛠️ ${t.service}</div>` : ''}
            </div>
        `;
        testContainer.appendChild(card);
    });
}

function playTestimonialVideo(id, embedUrl) {
    if (!embedUrl) return;
    const frame = document.getElementById('vframe-' + id);
    if (!frame) return;
    frame.innerHTML = `
        <iframe src="${embedUrl}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen style="width:100%;height:100%;border-radius:12px 12px 0 0;display:block;"></iframe>
    `;
}
