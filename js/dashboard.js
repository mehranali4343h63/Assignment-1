/**
 * PakServicesHub - Admin Dashboard Logic v2.0
 * Full CRUD: Businesses, Testimonials, Service Catalog (with images), Cities & Villages
 */

// ── Auth Guard ──────────────────────────────────────────────────
(function () {
    if (!store.isAdmin()) {
        window.location.href = 'login.html';
    }
})();

// ── Active category for services tab ────────────────────────────
let _activeCatId = null;

// ── Tab Switcher ────────────────────────────────────────────────
function showTab(id, el) {
    document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-sidebar-item').forEach(i => i.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    el.classList.add('active');

    const labels = {
        overview: 'Dashboard Overview',
        biz:      'Manage Businesses',
        test:     'Manage Testimonials',
        services: 'Service Catalog Manager',
        location: 'Cities & Villages'
    };
    document.getElementById('tab-title').textContent = labels[id] || id;

    if (id === 'overview')  renderOverview();
    if (id === 'biz')       renderBizAdmin();
    if (id === 'test')      renderTestAdmin();
    if (id === 'services')  renderServicesCatalog();
    if (id === 'location')  renderLocationAdmin();
}

// ── Logout ──────────────────────────────────────────────────────
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// ── Overview Stats ───────────────────────────────────────────────
function renderOverview() {
    const catalog = store.getCatalog();
    let totalItems = 0;
    catalog.forEach(c => { totalItems += c.items.length; });

    document.getElementById('stat-biz').textContent    = store.getBusinesses().length;
    document.getElementById('stat-test').textContent   = store.getTestimonials().length;
    document.getElementById('stat-svc').textContent    = totalItems;
    document.getElementById('stat-cities').textContent = store.getLocationData().cities.length;
}

// ════════════════════════════════════════════════════════════════
// SERVICES CATALOG MANAGER
// ════════════════════════════════════════════════════════════════

function renderServicesCatalog() {
    const catalog = store.getCatalog();
    const btnRow  = document.getElementById('svc-cat-buttons');
    btnRow.innerHTML = '';

    catalog.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'svc-cat-btn' + (_activeCatId === cat.id ? ' active' : '');
        btn.style.setProperty('--cat-color', cat.color);
        btn.innerHTML = cat.label;
        btn.onclick = () => openCategory(cat.id);
        btnRow.appendChild(btn);
    });

    if (_activeCatId) {
        renderCategoryItems(_activeCatId);
    }
}

function openCategory(catId) {
    _activeCatId = catId;
    renderServicesCatalog();

    const panel = document.getElementById('svc-items-panel');
    panel.style.display = 'block';

    const cat = store.getCatalog().find(c => c.id === catId);
    document.getElementById('svc-add-title').textContent = '➕ Add to ' + cat.label;

    renderCategoryItems(catId);
}

function renderCategoryItems(catId) {
    const catalog = store.getCatalog();
    const cat     = catalog.find(c => c.id === catId);
    if (!cat) return;

    const container = document.getElementById('svc-items-list');
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'admin-form-card';
    header.innerHTML = `
        <h3 class="admin-list-header">${cat.label} — ${cat.items.length} Services</h3>
        <div class="svc-items-grid" id="svc-grid-${catId}"></div>
    `;
    container.appendChild(header);

    const grid = header.querySelector('#svc-grid-' + catId);

    if (cat.items.length === 0) {
        grid.innerHTML = '<p style="color:#94a3b8; font-size:0.9rem;">No services yet. Add one above.</p>';
        return;
    }

    cat.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'svc-item-card';
        card.id = 'svc-card-' + item.id;

        const imgSrc = item.imageUrl || '';
        const imgPreview = imgSrc
            ? `<img src="${imgSrc}" alt="${item.name}" class="svc-item-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="svc-item-img-placeholder" style="display:none;">${item.icon}</div>`
            : `<div class="svc-item-img-placeholder">${item.icon}</div>`;

        card.innerHTML = `
            <div class="svc-item-preview">
                ${imgPreview}
            </div>
            <div class="svc-item-body">
                <div class="svc-item-name" id="svc-name-${item.id}">${item.icon} ${item.name}</div>
                <div class="svc-item-url-row">
                    <input type="text"
                           id="svc-url-${item.id}"
                           class="svc-url-input"
                           value="${item.imageUrl || ''}"
                           placeholder="Paste image URL here…"
                           onchange="updateItemImage('${catId}','${item.id}',this.value)">
                    <button class="svc-url-save-btn" onclick="saveItemImage('${catId}','${item.id}')">💾 Save</button>
                </div>
                <div class="svc-item-url-row" style="margin-top:6px;">
                    <input type="text"
                           id="svc-price-${item.id}"
                           class="svc-url-input"
                           value="${item.price || ''}"
                           placeholder="Price (e.g. Rs. 500)">
                    <button class="svc-url-save-btn" onclick="savePriceItem('${catId}','${item.id}')">💾 Save</button>
                </div>
            </div>
            <button class="svc-item-delete-btn btn-danger-sm" onclick="deleteCatalogItem('${catId}','${item.id}','${item.name.replace(/'/g,"\\'")}')">🗑️ Delete</button>
        `;
        grid.appendChild(card);
    });
}

function updateItemImage(catId, itemId, url) {
    // Live preview update
    const card = document.getElementById('svc-card-' + itemId);
    if (!card) return;
    const preview = card.querySelector('.svc-item-preview');
    if (!preview) return;
    const cat  = store.getCatalog().find(c => c.id === catId);
    const item = cat ? cat.items.find(i => i.id === itemId) : null;
    const icon = item ? item.icon : '🔧';

    if (url) {
        preview.innerHTML = `
            <img src="${url}" alt="preview" class="svc-item-img"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="svc-item-img-placeholder" style="display:none;">${icon}</div>`;
    } else {
        preview.innerHTML = `<div class="svc-item-img-placeholder">${icon}</div>`;
    }
}

function saveItemImage(catId, itemId) {
    const input = document.getElementById('svc-url-' + itemId);
    if (!input) return;
    const url = input.value.trim();
    const ok  = store.updateCatalogItem(catId, itemId, { imageUrl: url });
    if (ok) {
        showDashToast('Image URL saved!', 'success');
        updateItemImage(catId, itemId, url);
    }
}

function savePriceItem(catId, itemId) {
    const input = document.getElementById('svc-price-' + itemId);
    if (!input) return;
    const price = input.value.trim();
    const ok    = store.updateCatalogItem(catId, itemId, { price: price });
    if (ok) {
        showDashToast('Price saved!', 'success');
    }
}

function deleteCatalogItem(catId, itemId, name) {
    if (!confirm('Delete "' + name + '" from this category?')) return;
    store.deleteCatalogItem(catId, itemId);
    showDashToast('"' + name + '" deleted.', 'error');
    renderCategoryItems(catId);
    renderServicesCatalog();
}

function addCatalogItem() {
    if (!_activeCatId) { alert('Please select a category first.'); return; }
    const name     = document.getElementById('svc-new-name').value.trim();
    const icon     = document.getElementById('svc-new-icon').value.trim() || '🔧';
    const imageUrl = document.getElementById('svc-new-image').value.trim();
    const price    = document.getElementById('svc-new-price').value.trim();

    if (!name) { alert('Please enter a service name.'); return; }

    store.addCatalogItem(_activeCatId, name, icon, imageUrl, price);
    document.getElementById('svc-new-name').value  = '';
    document.getElementById('svc-new-icon').value  = '';
    document.getElementById('svc-new-image').value = '';
    document.getElementById('svc-new-price').value = '';

    showDashToast('"' + name + '" added!', 'success');
    renderCategoryItems(_activeCatId);
    renderServicesCatalog();
}

// ════════════════════════════════════════════════════════════════
// BUSINESSES
// ════════════════════════════════════════════════════════════════

function handleAddBiz() {
    const name      = document.getElementById('biz-name').value.trim();
    const loc       = document.getElementById('biz-loc').value.trim();
    const image     = document.getElementById('biz-image').value.trim() || '../sources/logo.png';
    const category  = document.getElementById('biz-cat').value.trim() || 'General';
    const mapLink   = document.getElementById('biz-map').value.trim();
    const videoLink = document.getElementById('biz-video').value.trim();

    if (!name) { alert('Please enter a business name.'); return; }
    if (!loc)  { alert('Please enter a location.'); return; }

    store.addBusiness({ name, loc, image, category, mapLink, videoLink, status: 'OPEN', rating: 5 });
    ['biz-name', 'biz-loc', 'biz-image', 'biz-cat', 'biz-map', 'biz-video'].forEach(id => {
        document.getElementById(id).value = '';
    });
    renderBizAdmin();
    showDashToast('"' + name + '" added!', 'success');
}

function renderBizAdmin() {
    const c    = document.getElementById('biz-list-admin');
    const list = store.getBusinesses();

    c.innerHTML = '<h3 class="admin-list-header">Current Businesses (' + list.length + ')</h3>';

    if (!list.length) {
        c.innerHTML += '<p class="admin-empty-msg">No businesses added yet.</p>';
        return;
    }

    list.forEach(b => {
        const row = document.createElement('div');
        row.className = 'admin-list-row admin-biz-row';
        row.innerHTML = `
            <div class="admin-biz-thumb-wrap">
                <img src="${b.image || '../sources/logo.png'}" alt="${b.name}" class="admin-biz-thumb"
                     onerror="this.src='../sources/logo.png'">
            </div>
            <div class="admin-list-row-info">
                <strong>${b.name}</strong>
                <span class="admin-list-sub"> — ${b.loc}</span>
                <span class="admin-badge-cat">${b.category || '—'}</span>
                <div class="admin-biz-links">
                    ${b.mapLink   ? `<a href="${b.mapLink}"   target="_blank" class="admin-biz-link-btn admin-biz-map-btn">📍 Map</a>` : ''}
                    ${b.videoLink ? `<a href="${b.videoLink}" target="_blank" class="admin-biz-link-btn admin-biz-vid-btn">▶ Video</a>` : ''}
                </div>
            </div>
            <div class="admin-list-actions">
                <button class="btn-edit-sm" onclick="openEditBiz(${b.id})">✏️ Edit</button>
                <button class="btn-danger-sm" onclick="deleteBiz(${b.id})">🗑️ Delete</button>
            </div>
        `;
        c.appendChild(row);
    });
}

function deleteBiz(id) {
    if (confirm('Delete this business?')) {
        store.deleteBusiness(id);
        renderBizAdmin();
        showDashToast('Business deleted.', 'error');
    }
}

// ════════════════════════════════════════════════════════════════
// EDIT BUSINESS MODAL
// ════════════════════════════════════════════════════════════════

function openEditBiz(id) {
    const b = store.getBusinesses().find(x => x.id === id);
    if (!b) return;

    const existing = document.getElementById('edit-biz-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'edit-biz-modal';
    overlay.className = 'edit-biz-overlay';
    overlay.innerHTML = `
        <div class="edit-biz-card">
            <div class="edit-biz-header">
                <h3>✏️ Edit Business</h3>
                <button class="edit-biz-close" onclick="closeEditBiz()">✕</button>
            </div>
            <div class="edit-biz-body">
                <div class="admin-form-grid">
                    <div class="edit-field-group">
                        <label>Business Name *</label>
                        <input type="text" id="edit-biz-name" class="admin-input" value="${escHtml(b.name)}">
                    </div>
                    <div class="edit-field-group">
                        <label>Location *</label>
                        <input type="text" id="edit-biz-loc" class="admin-input" value="${escHtml(b.loc)}">
                    </div>
                    <div class="edit-field-group">
                        <label>Category</label>
                        <input type="text" id="edit-biz-cat" class="admin-input" value="${escHtml(b.category || '')}">
                    </div>
                    <div class="edit-field-group">
                        <label>Status</label>
                        <select id="edit-biz-status" class="admin-input">
                            <option value="OPEN"   ${(b.status||'OPEN')==='OPEN'   ? 'selected':''}>OPEN</option>
                            <option value="CLOSED" ${(b.status||'')==='CLOSED' ? 'selected':''}>CLOSED</option>
                            <option value="BUSY"   ${(b.status||'')==='BUSY'   ? 'selected':''}>BUSY</option>
                        </select>
                    </div>
                    <div class="edit-field-group edit-field-full">
                        <label>🖼️ Image URL</label>
                        <input type="text" id="edit-biz-image" class="admin-input"
                               value="${escHtml(b.image || '')}"
                               placeholder="https://... or leave blank for default"
                               oninput="previewEditImg(this.value)">
                        <div class="edit-img-preview-wrap">
                            <img id="edit-img-preview" src="${escHtml(b.image || '../sources/logo.png')}"
                                 alt="preview" onerror="this.src='../sources/logo.png'">
                        </div>
                    </div>
                    <div class="edit-field-group edit-field-full">
                        <label>📍 Google Maps Link</label>
                        <input type="text" id="edit-biz-map" class="admin-input"
                               value="${escHtml(b.mapLink || '')}"
                               placeholder="https://maps.google.com/...">
                    </div>
                    <div class="edit-field-group edit-field-full">
                        <label>▶ YouTube / TikTok / Reel Link</label>
                        <input type="text" id="edit-biz-video" class="admin-input"
                               value="${escHtml(b.videoLink || '')}"
                               placeholder="https://youtube.com/watch?v=...">
                    </div>
                </div>
            </div>
            <div class="edit-biz-footer">
                <button class="admin-btn-secondary" onclick="closeEditBiz()">Cancel</button>
                <button class="admin-btn-primary" onclick="saveEditBiz(${id})">💾 Save Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('open'), 10);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeEditBiz(); });
}

function previewEditImg(url) {
    const img = document.getElementById('edit-img-preview');
    if (img) img.src = url || '../sources/logo.png';
}

function saveEditBiz(id) {
    const name      = document.getElementById('edit-biz-name').value.trim();
    const loc       = document.getElementById('edit-biz-loc').value.trim();
    const cat       = document.getElementById('edit-biz-cat').value.trim();
    const status    = document.getElementById('edit-biz-status').value;
    const image     = document.getElementById('edit-biz-image').value.trim() || '../sources/logo.png';
    const mapLink   = document.getElementById('edit-biz-map').value.trim();
    const videoLink = document.getElementById('edit-biz-video').value.trim();

    if (!name) { alert('Business name is required.'); return; }
    if (!loc)  { alert('Location is required.'); return; }

    store.updateBusiness(id, { name, loc, category: cat, status, image, mapLink, videoLink });
    closeEditBiz();
    renderBizAdmin();
    showDashToast('"' + name + '" updated!', 'success');
}

function closeEditBiz() {
    const modal = document.getElementById('edit-biz-modal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.remove(), 300);
    }
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ════════════════════════════════════════════════════════════════

function handleAddTest() {
    const name    = document.getElementById('test-name').value.trim();
    const video   = document.getElementById('test-link').value.trim();
    const text    = document.getElementById('test-text').value.trim();
    const biz     = document.getElementById('test-biz').value.trim();
    const rating  = document.getElementById('test-rating').value || '5';
    const service = document.getElementById('test-service').value.trim();

    if (!name)  { alert('Please enter a customer name.'); return; }
    if (!video) { alert('Please enter a video link.'); return; }

    store.addTestimonial({ name, video, text, biz, rating, service, thumb: '../sources/logo.png' });
    ['test-name', 'test-link', 'test-biz', 'test-text', 'test-service'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('test-rating').value = '5';
    renderTestAdmin();
    showDashToast('"' + name + '" testimonial added!', 'success');
}

function renderTestAdmin() {
    const c    = document.getElementById('test-list-admin');
    const list = store.getTestimonials();

    c.innerHTML = '<h3 class="admin-list-header">Current Testimonials (' + list.length + ')</h3>';

    if (!list.length) {
        c.innerHTML += '<p style="color:#64748b; padding:1rem 0;">No testimonials added yet. Add your first customer feedback above.</p>';
        return;
    }

    list.forEach(t => {
        const rating = parseInt(t.rating) || 5;
        const stars  = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const row = document.createElement('div');
        row.className = 'admin-list-row';
        row.style.flexWrap = 'wrap';
        row.innerHTML = `
            <div class="admin-list-row-info" style="flex:1; min-width:200px;">
                <strong>${t.name}</strong>
                <span class="admin-list-sub"> — ${t.biz || 'N/A'}</span>
                ${t.service ? `<span class="admin-badge-cat">${t.service}</span>` : ''}
                <div style="color:#f59e0b; font-size:0.9rem; margin-top:3px;">${stars}</div>
                ${t.text ? `<div style="color:#64748b; font-size:0.82rem; margin-top:3px; font-style:italic;">"${t.text.substring(0,60)}${t.text.length>60?'…':''}"</div>` : ''}
                ${t.video ? `<a href="${t.video}" target="_blank" style="color:#2563eb; font-size:0.8rem; font-weight:600;">▶ View Video</a>` : ''}
            </div>
            <button class="btn-danger-sm" onclick="deleteTest(${t.id})">🗑️ Delete</button>
        `;
        c.appendChild(row);
    });
}

function deleteTest(id) {
    if (confirm('Delete this testimonial?')) {
        const list = store.getTestimonials().filter(t => t.id !== id);
        localStorage.setItem('psh_testimonials', JSON.stringify(list));
        renderTestAdmin();
        showDashToast('Testimonial deleted.', 'error');
    }
}

// ════════════════════════════════════════════════════════════════
// CITIES & VILLAGES
// ════════════════════════════════════════════════════════════════

function handleAddCity() {
    const name     = document.getElementById('new-city-name').value.trim();
    const district = document.getElementById('new-city-district').value.trim();
    const msg      = document.getElementById('city-add-msg');

    if (!name) { showMsg(msg, 'Please enter a city name.', '#ef4444'); return; }

    const ok = store.addCity(name, district);
    if (ok) {
        showMsg(msg, '✅ "' + name + '" added successfully.', '#059669');
        document.getElementById('new-city-name').value     = '';
        document.getElementById('new-city-district').value = '';
        renderLocationAdmin();
    } else {
        showMsg(msg, '⚠️ A city with this name already exists.', '#f59e0b');
    }
}

function showMsg(el, text, color) {
    el.textContent   = text;
    el.style.color   = color;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

function renderLocationAdmin() {
    const container = document.getElementById('location-list-admin');
    container.innerHTML = '';
    const data = store.getLocationData();

    if (data.cities.length === 0) {
        container.innerHTML = '<p style="color:#64748b; padding:1rem 0;">No cities added yet.</p>';
        return;
    }

    data.cities.forEach(city => {
        let villageCount = 0;
        (city.tehsils || []).forEach(t =>
            (t.unionCouncils || []).forEach(uc => { villageCount += (uc.villages || []).length; })
        );

        let allVillages = [];
        (city.tehsils || []).forEach(t =>
            (t.unionCouncils || []).forEach(uc =>
                (uc.villages || []).forEach(v => {
                    allVillages.push({ name: typeof v === 'string' ? v : v.name, tehsilId: t.id, ucId: uc.id });
                })
            )
        );

        const villageChipsHTML = allVillages.length === 0
            ? '<span style="color:#94a3b8; font-size:0.85rem;">No villages yet.</span>'
            : allVillages.map(v => `
                <div class="village-chip-admin">
                    📍 ${v.name}
                    <span class="del-v" onclick="removeVillage('${city.id}','${v.tehsilId}','${v.ucId}','${v.name.replace(/'/g,"\\'")}')">✕</span>
                </div>`).join('');

        let tehsilOptions = '';
        (city.tehsils || []).forEach(t =>
            (t.unionCouncils || []).forEach(uc => {
                tehsilOptions += `<option value="${t.id}|${uc.id}">${t.name} → ${uc.name}</option>`;
            })
        );

        const card = document.createElement('div');
        card.className = 'city-admin-card';
        card.innerHTML = `
            <div class="city-admin-header" onclick="toggleVillages('${city.id}')">
                <div class="city-admin-header-left">
                    <span class="city-admin-header-icon">🏙️</span>
                    <div>
                        <div class="city-admin-header-name">${city.name}</div>
                        <div class="city-admin-header-dist">${city.district || 'Punjab'}</div>
                    </div>
                </div>
                <div class="city-admin-header-right">
                    <span class="city-badge">${villageCount} Villages</span>
                    <span class="city-toggle-icon" id="toggle-icon-${city.id}">▼</span>
                    <button class="btn-danger-sm" onclick="event.stopPropagation(); confirmDeleteCity('${city.id}','${city.name}')">Delete</button>
                </div>
            </div>
            <div class="village-list-admin" id="village-list-${city.id}">${villageChipsHTML}</div>
            <div class="add-village-row">
                ${tehsilOptions
                    ? `<select id="uc-select-${city.id}" class="admin-input" style="flex:1.5; padding:8px 10px;">${tehsilOptions}</select>`
                    : `<span style="color:#94a3b8; font-size:0.82rem; flex:1.5;">No UCs available</span>`}
                <input type="text" id="village-input-${city.id}" class="admin-input"
                       placeholder="Village name…"
                       onkeydown="if(event.key==='Enter') addVillage('${city.id}')">
                <button class="btn-add-village" onclick="addVillage('${city.id}')">+ Add</button>
            </div>`;
        container.appendChild(card);
    });
}

function toggleVillages(cityId) {
    const list = document.getElementById('village-list-' + cityId);
    const icon = document.getElementById('toggle-icon-' + cityId);
    list.classList.toggle('open');
    icon.textContent = list.classList.contains('open') ? '▲' : '▼';
}

function addVillage(cityId) {
    const nameInput = document.getElementById('village-input-' + cityId);
    const ucSelect  = document.getElementById('uc-select-' + cityId);
    const name      = nameInput.value.trim();
    if (!name) { alert('Please enter a village name.'); return; }
    if (!ucSelect) { alert('No Union Councils available.'); return; }
    const [tehsilId, ucId] = ucSelect.value.split('|');
    if (store.addVillage(cityId, tehsilId, ucId, name)) {
        nameInput.value = '';
        renderLocationAdmin();
        const list = document.getElementById('village-list-' + cityId);
        if (list) list.classList.add('open');
        const icon = document.getElementById('toggle-icon-' + cityId);
        if (icon) icon.textContent = '▲';
    } else {
        alert('"' + name + '" already exists.');
    }
}

function removeVillage(cityId, tehsilId, ucId, villageName) {
    if (!confirm('Remove "' + villageName + '"?')) return;
    const data   = store.getLocationData();
    const city   = data.cities.find(c => c.id === cityId);
    const tehsil = (city?.tehsils || []).find(t => t.id === tehsilId);
    const uc     = (tehsil?.unionCouncils || []).find(u => u.id === ucId);
    if (uc) {
        uc.villages = (uc.villages || []).filter(v => (typeof v === 'string' ? v : v.name) !== villageName);
        localStorage.setItem('psh_location_v3', JSON.stringify(data));
        renderLocationAdmin();
    }
}

function confirmDeleteCity(cityId, cityName) {
    if (confirm('⚠️ Delete "' + cityName + '" and ALL its data?')) {
        store.removeCity(cityId);
        renderLocationAdmin();
    }
}

// ── Toast ────────────────────────────────────────────────────────
function showDashToast(msg, type) {
    let stack = document.getElementById('dash-toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'dash-toast-stack';
        stack.className = 'lm-toast-stack';
        document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'lm-toast lm-toast-' + (type || 'success');
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderOverview();
});
