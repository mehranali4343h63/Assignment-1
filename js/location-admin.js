/**
 * PakServicesHub — Location Management System v2.0
 * Full CRUD: City → Tehsil → UC → Village
 */

const LocationAdmin = {
    _searchQuery: '',
    _expandedCities: new Set(),
    _expandedTehsils: new Set(),
    _pendingDelete: null,

    // ── Bootstrap ──────────────────────────────────────────────
    init() {
        this._ensureToastStack();
        this._bindSearch();
        this._renderCities();
    },

    _ensureToastStack() {
        if (!document.getElementById('lm-toast-stack')) {
            const el = document.createElement('div');
            el.id = 'lm-toast-stack';
            el.className = 'lm-toast-stack';
            document.body.appendChild(el);
        }
    },

    // ── Toast ───────────────────────────────────────────────────
    toast(msg, type = 'success') {
        const stack = document.getElementById('lm-toast-stack');
        const t = document.createElement('div');
        t.className = 'lm-toast lm-toast-' + type;
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        t.innerHTML = '<span>' + (icons[type] || '✅') + '</span> ' + msg;
        stack.appendChild(t);
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    },

    // ── Modal ───────────────────────────────────────────────────
    confirm(title, body, onConfirm) {
        const overlay = document.getElementById('lm-modal-overlay');
        if (!overlay) { if (window.confirm(title + '\n\n' + body)) onConfirm(); return; }
        document.getElementById('lm-modal-title').textContent = title;
        document.getElementById('lm-modal-body').textContent  = body;
        this._pendingDelete = onConfirm;
        overlay.classList.add('open');
    },

    closeModal() {
        const overlay = document.getElementById('lm-modal-overlay');
        if (overlay) overlay.classList.remove('open');
        this._pendingDelete = null;
    },

    executeConfirm() {
        if (this._pendingDelete) this._pendingDelete();
        this.closeModal();
    },

    // ── Stats ───────────────────────────────────────────────────
    _renderStats() {
        const data = store.getLocationData();
        let tehsils = 0, ucs = 0, villages = 0;
        data.cities.forEach(c => {
            (c.tehsils || []).forEach(t => {
                tehsils++;
                (t.unionCouncils || []).forEach(u => {
                    ucs++;
                    villages += (u.villages || []).length;
                });
            });
        });
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('lm-stat-cities',   data.cities.length);
        set('lm-stat-tehsils',  tehsils);
        set('lm-stat-ucs',      ucs);
        set('lm-stat-villages', villages);
    },

    // ── Search ──────────────────────────────────────────────────
    _bindSearch() {
        const inp = document.getElementById('lm-search-input');
        if (inp) {
            inp.addEventListener('input', (e) => {
                this._searchQuery = e.target.value.toLowerCase();
                this._renderCities();
            });
        }
    },

    // ── Render Cities ───────────────────────────────────────────
    _renderCities() {
        const container = document.getElementById('lm-cities-container');
        if (!container) return;

        const data = store.getLocationData();
        let cities = data.cities;

        if (this._searchQuery) {
            const q = this._searchQuery;
            cities = cities.filter(city => {
                if (city.name.toLowerCase().includes(q)) return true;
                return (city.tehsils || []).some(t => {
                    if (t.name.toLowerCase().includes(q)) return true;
                    return (t.unionCouncils || []).some(u => {
                        if (u.name.toLowerCase().includes(q)) return true;
                        return (u.villages || []).some(v =>
                            (typeof v === 'string' ? v : v.name).toLowerCase().includes(q)
                        );
                    });
                });
            });
        }

        this._renderStats();

        if (cities.length === 0) {
            container.innerHTML = '<div class="lm-no-results">No locations found' +
                (this._searchQuery ? ' for "' + this._searchQuery + '"' : '') + '.</div>';
            return;
        }

        container.innerHTML = cities.map(city => this._cityCardHTML(city)).join('');
    },

    // ── City Card HTML ──────────────────────────────────────────
    _cityCardHTML(city) {
        const isExpanded = this._expandedCities.has(city.id);
        let villageCount = 0;
        (city.tehsils || []).forEach(t =>
            (t.unionCouncils || []).forEach(uc => { villageCount += (uc.villages || []).length; })
        );

        return `
        <div class="lm-city-card ${isExpanded ? 'expanded' : ''}" id="lm-city-${city.id}">
            <div class="lm-city-header" onclick="LocationAdmin._toggleCity('${city.id}')">
                <div class="lm-city-meta">
                    <div class="lm-city-icon">🏙️</div>
                    <div class="lm-city-name-wrap">
                        <div class="lm-city-name">${city.name}</div>
                        <div class="lm-city-dist">${city.district || 'Punjab'}</div>
                    </div>
                </div>
                <div class="lm-city-actions">
                    <span class="lm-badge lm-badge-villages">${villageCount} Villages</span>
                    <span class="lm-badge lm-badge-tehsils">${(city.tehsils || []).length} Tehsils</span>
                    <span class="lm-toggle-icon">▼</span>
                    <button class="btn-danger-sm" onclick="event.stopPropagation(); LocationAdmin._deleteCity('${city.id}','${city.name}')">Delete</button>
                </div>
            </div>
            <div class="lm-city-body">
                ${this._renderTehsils(city)}
                <div class="lm-add-tehsil-section">
                    <div class="lm-add-tehsil-label">Add Tehsil</div>
                    <div class="lm-inline-add">
                        <input type="text" id="inp-tehsil-${city.id}" class="lm-inline-input" placeholder="Tehsil name…">
                        <button class="lm-btn-add lm-btn-add-green" onclick="LocationAdmin._addTehsil('${city.id}')">+ Add Tehsil</button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    _renderTehsils(city) {
        if (!city.tehsils || city.tehsils.length === 0) {
            return '<p class="lm-empty-state" style="padding:1rem 1.6rem;">No tehsils yet.</p>';
        }
        return city.tehsils.map(t => {
            const isExpanded = this._expandedTehsils.has(t.id);
            return `
            <div class="lm-tehsil-section">
                <div class="lm-tehsil-header" onclick="LocationAdmin._toggleTehsil('${t.id}')">
                    <div class="lm-tehsil-meta">
                        <div class="lm-tehsil-icon">🏛️</div>
                        <span class="lm-tehsil-name">${t.name}</span>
                    </div>
                    <div class="lm-tehsil-actions">
                        <span class="lm-badge lm-badge-ucs">${(t.unionCouncils || []).length} UCs</span>
                        <button class="lm-icon-btn lm-icon-btn-del"
                            onclick="event.stopPropagation(); LocationAdmin._deleteTehsil('${city.id}','${t.id}','${t.name}')">🗑️</button>
                    </div>
                </div>
                <div id="body-tehsil-${t.id}" style="display:${isExpanded ? 'block' : 'none'}">
                    ${this._renderUCs(city.id, t)}
                    <div class="lm-add-uc-section">
                        <div class="lm-inline-add">
                            <input type="text" id="inp-uc-${t.id}" class="lm-inline-input" placeholder="UC name…">
                            <input type="text" id="inp-uc-road-${t.id}" class="lm-inline-input" placeholder="Road (optional)">
                            <button class="lm-btn-add lm-btn-add-blue"
                                onclick="LocationAdmin._addUC('${city.id}','${t.id}')">+ Add UC</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    _renderUCs(cityId, tehsil) {
        if (!tehsil.unionCouncils || tehsil.unionCouncils.length === 0) {
            return '<p class="lm-empty-state" style="padding:0.5rem 1.1rem;">No union councils yet.</p>';
        }
        return '<div class="lm-uc-wrap">' + tehsil.unionCouncils.map(uc => `
            <div class="lm-uc-row">
                <div class="lm-uc-header">
                    <div class="lm-uc-meta">
                        <div class="lm-uc-dot">UC</div>
                        <span class="lm-uc-name">${uc.name}</span>
                    </div>
                    <div class="lm-uc-actions">
                        <span class="lm-badge lm-badge-villages">${(uc.villages || []).length}</span>
                        <button class="lm-icon-btn lm-icon-btn-del"
                            onclick="LocationAdmin._deleteUC('${cityId}','${tehsil.id}','${uc.id}','${uc.name}')">🗑️</button>
                    </div>
                </div>
                <div class="lm-uc-body">
                    <div class="lm-village-chips">
                        ${(uc.villages || []).length === 0
                            ? '<span class="lm-empty-state">No villages yet.</span>'
                            : (uc.villages || []).map(v => {
                                const vName = typeof v === 'string' ? v : v.name;
                                return `<span class="lm-village-chip">📍 ${vName}
                                    <span class="del-chip"
                                        onclick="LocationAdmin._deleteVillage('${cityId}','${tehsil.id}','${uc.id}','${vName.replace(/'/g,"\\'")}')">✕</span>
                                </span>`;
                            }).join('')
                        }
                    </div>
                    <div class="lm-add-village-section">
                        <div class="lm-inline-add">
                            <input type="text" id="inp-v-${uc.id}" class="lm-inline-input" placeholder="Village name…">
                            <button class="lm-btn-add"
                                onclick="LocationAdmin._addVillage('${cityId}','${tehsil.id}','${uc.id}')">+ Add</button>
                        </div>
                    </div>
                </div>
            </div>`).join('') + '</div>';
    },

    // ── Toggle ──────────────────────────────────────────────────
    _toggleCity(id) {
        this._expandedCities.has(id) ? this._expandedCities.delete(id) : this._expandedCities.add(id);
        this._renderCities();
    },

    _toggleTehsil(id) {
        const body = document.getElementById('body-tehsil-' + id);
        if (!body) return;
        const isVisible = body.style.display !== 'none';
        body.style.display = isVisible ? 'none' : 'block';
        if (isVisible) this._expandedTehsils.delete(id);
        else           this._expandedTehsils.add(id);
    },

    // ── CRUD ────────────────────────────────────────────────────
    _addTehsil(cityId) {
        const input = document.getElementById('inp-tehsil-' + cityId);
        const name  = input.value.trim();
        if (!name) { this.toast('Enter a tehsil name.', 'error'); return; }
        if (store.addTehsil(cityId, name)) {
            this.toast(name + ' added!');
            this._expandedCities.add(cityId);
            this._renderCities();
        } else {
            this.toast('Tehsil already exists.', 'error');
        }
    },

    _addUC(cityId, tehsilId) {
        const nameInput = document.getElementById('inp-uc-' + tehsilId);
        const roadInput = document.getElementById('inp-uc-road-' + tehsilId);
        const name = nameInput.value.trim();
        const road = roadInput ? roadInput.value.trim() : '';
        if (!name) { this.toast('Enter a UC name.', 'error'); return; }
        if (store.addUC(cityId, tehsilId, name, road)) {
            this.toast(name + ' UC added!');
            this._expandedTehsils.add(tehsilId);
            this._renderCities();
        } else {
            this.toast('UC already exists.', 'error');
        }
    },

    _addVillage(cityId, tehsilId, ucId) {
        const input = document.getElementById('inp-v-' + ucId);
        const name  = input.value.trim();
        if (!name) { this.toast('Enter a village name.', 'error'); return; }
        if (store.addVillage(cityId, tehsilId, ucId, name)) {
            this.toast(name + ' added!');
            this._renderCities();
        } else {
            this.toast('Village already exists.', 'error');
        }
    },

    _deleteVillage(cityId, tehsilId, ucId, villageName) {
        this.confirm(
            'Remove Village',
            'Remove "' + villageName + '" from this UC?',
            () => {
                const data = store.getLocationData();
                const city   = data.cities.find(c => c.id === cityId);
                const tehsil = (city?.tehsils || []).find(t => t.id === tehsilId);
                const uc     = (tehsil?.unionCouncils || []).find(u => u.id === ucId);
                if (uc) {
                    uc.villages = (uc.villages || []).filter(v =>
                        (typeof v === 'string' ? v : v.name) !== villageName
                    );
                    localStorage.setItem('psh_location_v3', JSON.stringify(data));
                    this.toast('"' + villageName + '" removed.');
                    this._renderCities();
                }
            }
        );
    },

    _deleteUC(cityId, tehsilId, ucId, ucName) {
        this.confirm(
            'Delete Union Council',
            'Delete "' + ucName + '" and all its villages?',
            () => {
                const data = store.getLocationData();
                const city   = data.cities.find(c => c.id === cityId);
                const tehsil = (city?.tehsils || []).find(t => t.id === tehsilId);
                if (tehsil) {
                    tehsil.unionCouncils = (tehsil.unionCouncils || []).filter(u => u.id !== ucId);
                    localStorage.setItem('psh_location_v3', JSON.stringify(data));
                    this.toast('"' + ucName + '" deleted.');
                    this._renderCities();
                }
            }
        );
    },

    _deleteTehsil(cityId, tehsilId, tehsilName) {
        this.confirm(
            'Delete Tehsil',
            'Delete "' + tehsilName + '" and all its UCs and villages?',
            () => {
                const data = store.getLocationData();
                const city = data.cities.find(c => c.id === cityId);
                if (city) {
                    city.tehsils = (city.tehsils || []).filter(t => t.id !== tehsilId);
                    localStorage.setItem('psh_location_v3', JSON.stringify(data));
                    this.toast('"' + tehsilName + '" deleted.');
                    this._renderCities();
                }
            }
        );
    },

    _deleteCity(cityId, cityName) {
        this.confirm(
            'Delete City',
            '⚠️ Delete "' + cityName + '" and ALL its data? This cannot be undone.',
            () => {
                store.removeCity(cityId);
                this._expandedCities.delete(cityId);
                this.toast('"' + cityName + '" deleted.');
                this._renderCities();
            }
        );
    }
};

// ── Page-level helpers ───────────────────────────────────────────
function addCity() {
    const name     = document.getElementById('lm-city-name').value.trim();
    const district = document.getElementById('lm-city-district').value.trim();
    const msg      = document.getElementById('lm-city-msg');

    if (!name) { showLmMsg(msg, 'Please enter a city name.', '#ef4444'); return; }

    if (store.addCity(name, district)) {
        showLmMsg(msg, '✅ "' + name + '" added!', '#059669');
        document.getElementById('lm-city-name').value     = '';
        document.getElementById('lm-city-district').value = '';
        LocationAdmin._renderCities();
    } else {
        showLmMsg(msg, '⚠️ City already exists.', '#f59e0b');
    }
}

function clearSearch() {
    const inp = document.getElementById('lm-search-input');
    if (inp) inp.value = '';
    LocationAdmin._searchQuery = '';
    LocationAdmin._renderCities();
}

function showLmMsg(el, text, color) {
    el.textContent   = text;
    el.style.color   = color;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => LocationAdmin.init());
