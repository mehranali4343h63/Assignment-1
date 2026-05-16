/**
 * PakServicesHub - Professional Interaction Engine v3.0
 * Features: Admin-controlled Location Sync, Debounced Search, Scroll Reveal
 */

const App = {
    allServices: [],
    locationData: null,
    _villageDebounceTimer: null,
    _serviceDebounceTimer: null,

    init() {
        this.loadLocationData();
        this.handleScrollAnimations();
        this.setupLiveSearch();
        this.setupLocationSearch();
        this.renderHomeContent();
        console.log('PakServicesHub v3.0 — Admin Sync Engine Initialized');
    },

    // Load data from LocalStorage (Admin Control) or use Defaults
    loadLocationData() {
        const savedData = localStorage.getItem('pakServicesLocationData');
        if (savedData) {
            this.locationData = JSON.parse(savedData);
        } else {
            // Default Initial Data
            this.locationData = {
                cities: [
                    { id: 'c1', name: 'Sialkot', district: 'Sialkot', villages: ['Pasrur', 'Daska', 'Sambrial', 'Badiana'], popularVillages: ['Pasrur', 'Daska'] },
                    { id: 'c2', name: 'Lahore', district: 'Lahore', villages: ['Model Town', 'Johar Town', 'Wagah'], popularVillages: ['Model Town'] }
                ]
            };
            localStorage.setItem('pakServicesLocationData', JSON.stringify(this.locationData));
        }
    },

    renderHomeContent() {
        const servicesContainer = document.getElementById('services-container');
        if (servicesContainer && typeof store !== 'undefined') {
            const services = store.getServices();
            servicesContainer.innerHTML = services.map(s => `
                <div class="searched-card animate-up" onclick="location.href='pages/services.html?q=${s.title}'">
                    <div class="icon-circle" style="background: ${s.color}15; color: ${s.color};">${s.icon}</div>
                    <h4>${s.title}s</h4>
                    <p>${s.desc}</p>
                </div>
            `).join('');
        }
    },

    handleScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
    },

    setupLiveSearch() {
        const searchInput = document.getElementById('main-search');
        const resultsPanel = document.getElementById('search-results');
        if (!searchInput || !resultsPanel) return;

        this.indexSearchTerms();

        searchInput.addEventListener('input', (e) => {
            clearTimeout(this._serviceDebounceTimer);
            this._serviceDebounceTimer = setTimeout(() => {
                const query = e.target.value.trim().toLowerCase();
                if (query.length < 1) {
                    resultsPanel.classList.remove('active');
                    return;
                }
                const filtered = this.allServices.filter(s =>
                    s.name.toLowerCase().includes(query) ||
                    s.cat.toLowerCase().includes(query)
                ).slice(0, 10);

                if (filtered.length > 0) {
                    resultsPanel.innerHTML = `
                        <div class="search-header-label">Services Found</div>
                        ${filtered.map(s => `
                            <div class="search-item" onclick="location.href='pages/services.html?q=${s.name}'">
                                <div class="search-icon">${s.icon}</div>
                                <div class="search-text">
                                    <div class="search-title">${s.name}</div>
                                    <div class="search-cat">${s.cat}</div>
                                </div>
                            </div>
                        `).join('')}
                    `;
                } else {
                    resultsPanel.innerHTML = `<div class="search-item">No services found for "${query}"</div>`;
                }
                resultsPanel.classList.add('active');
            }, 150);
        });
    },

    setupLocationSearch() {
        const citySelect = document.getElementById('city-select');
        const villageInput = document.getElementById('village-search');
        const villageResults = document.getElementById('village-results');
        const villageWrapper = document.getElementById('village-search-wrapper');

        if (!citySelect || !villageInput) return;

        // Reset and populate cities
        citySelect.innerHTML = '<option value="">Select City</option>';
        this.locationData.cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city.id;
            opt.textContent = city.name;
            citySelect.appendChild(opt);
        });

        let selectedCityObj = null;

        citySelect.addEventListener('change', () => {
            const cityId = citySelect.value;
            selectedCityObj = this.locationData.cities.find(c => c.id === cityId);

            if (selectedCityObj) {
                villageInput.disabled = false;
                villageInput.placeholder = `Search in ${selectedCityObj.name}...`;
                villageWrapper.classList.add('village-active');
            } else {
                villageInput.disabled = true;
                villageWrapper.classList.remove('village-active');
            }
        });

        villageInput.addEventListener('input', (e) => {
            clearTimeout(this._villageDebounceTimer);
            this._villageDebounceTimer = setTimeout(() => {
                if (!selectedCityObj) return;
                const query = e.target.value.toLowerCase();
                const filtered = selectedCityObj.villages.filter(v => v.toLowerCase().includes(query));

                if (query.length > 0 && filtered.length > 0) {
                    villageResults.innerHTML = filtered.map(v => `
                        <div class="search-item" onclick="App.selectVillage('${v}')">
                            <div class="search-icon">📍</div>
                            <div class="search-title">${v}</div>
                        </div>
                    `).join('');
                    villageResults.classList.add('active');
                } else {
                    villageResults.classList.remove('active');
                }
            }, 150);
        });
    },

    selectVillage(v) {
        document.getElementById('village-search').value = v;
        document.getElementById('village-results').classList.remove('active');
    },

    indexSearchTerms() {
        const rawTerms = [
            { cat: 'Home & Garden', icon: '🏠', items: ['Plumbers', 'Electricians', 'Carpenters'] },
            { cat: 'Auto Services', icon: '🚗', items: ['Car Mechanic', 'Car Wash'] }
        ];
        this.allServices = [];
        rawTerms.forEach(rt => rt.items.forEach(item => this.allServices.push({ name: item, cat: rt.cat, icon: rt.icon })));
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());