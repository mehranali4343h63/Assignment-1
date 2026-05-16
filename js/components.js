/**
 * PakServicesHub - Professional Component Engine
 */

const components = {
    getNavbar() {
        const isSubPage = window.location.pathname.includes('/pages/');
        const prefix = isSubPage ? '../' : '';
        const homeLink = isSubPage ? '../index.html' : 'index.html';

        const catIdMap = {
            'home': 'home', 'domestic': 'domestic', 'edu': 'edu', 'auto': 'auto',
            'health': 'health', 'travel': 'travel', 'food': 'food', 'shop': 'shop',
            'workers': 'workers', 'industrial': 'industrial'
        };

        const createMega = (id, title, icon, list1, list2) => {
            const catId = catIdMap[id] || id;
            const makeLink = (item) => {
                // Strip ALL leading non-letter characters (emojis, symbols, spaces)
                const cleanName = item.replace(/^[^a-zA-Z\u0600-\u06FF]+/, '').trim();
                const slug = cleanName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+/, '');
                return `<a href="${prefix}pages/service-details.html?service=${slug}&cat=${catId}">${item}</a>`;
            };
            return `
            <div class="mega-dropdown" id="mega-${id}" onmouseenter="keepMega('${id}')" onmouseleave="hideMega('${id}')">
                <div class="mega-sidebar">
                    <div class="sidebar-icon">${icon}</div>
                    <h3>${title.toUpperCase()}</h3>
                </div>
                <div class="mega-content">
                    <div class="mega-list">${list1.map(makeLink).join('')}</div>
                    <div class="mega-list">${list2.map(makeLink).join('')}</div>
                </div>
            </div>
        `;
        };

        return `
        <div class="top-bar">
            <span>📞 Call: 0339-0005654</span>
            <span>✉️ support@pakserviceshub.com</span>
        </div>
        <nav class="nav-wrapper">
            <a href="${homeLink}" class="logo">Pak<span>Services</span>Hub</a>

            <!-- Full navbar links -->
            <div class="nav-links" id="nav-links">
                <a href="${homeLink}" class="nav-link">🏠 Home</a>
                <a href="${prefix}pages/services.html" class="nav-link">🛠️ Services</a>
                <a href="${prefix}pages/cart.html" class="nav-link nav-link-cart" id="nav-cart-btn">🛒 Cart <span class="cart-count" id="cart-count" style="display:none;">0</span></a>
                <a href="javascript:history.back()" class="nav-link">← Back</a>
            </div>

            <div class="nav-btns">
                <!-- Dark/Light theme toggle -->
                <button class="btn-theme" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle dark/light mode">🌙</button>

                <!-- Dynamic login/dashboard/signup based on auth state -->
                <span id="nav-auth-area"></span>
            </div>
        </nav>
        
        <div class="category-nav-outer">
            <div class="category-nav-scroll" id="cat-scroll">
                <div class="cat-item" onmouseenter="showMega('home')" onmouseleave="hideMega('home')">🏠 Home & Garden Services</div>
                <div class="cat-item" onmouseenter="showMega('domestic')" onmouseleave="hideMega('domestic')">👥 Domestic Workers</div>
                <div class="cat-item" onmouseenter="showMega('edu')" onmouseleave="hideMega('edu')">🎓 Education & Training</div>
                <div class="cat-item" onmouseenter="showMega('auto')" onmouseleave="hideMega('auto')">🚗 Auto Services</div>
                <div class="cat-item" onmouseenter="showMega('health')" onmouseleave="hideMega('health')">✨ Health & Beauty</div>
                <div class="cat-item" onmouseenter="showMega('travel')" onmouseleave="hideMega('travel')">✈️ Travel & Transportation</div>
                <div class="cat-item" onmouseenter="showMega('food')" onmouseleave="hideMega('food')">🍴 Food & Restaurants</div>
                <div class="cat-item" onmouseenter="showMega('shop')" onmouseleave="hideMega('shop')">🛍️ Shopping & Retail</div>
                <div class="cat-item" onmouseenter="showMega('workers')" onmouseleave="hideMega('workers')">👷 Workers & Helpers</div>
                <div class="cat-item" onmouseenter="showMega('industrial')" onmouseleave="hideMega('industrial')">🏭 Industrial Workers</div>
            </div>
            
            ${createMega("home", "Home & Garden", "🏠", 
                ["🔧 Plumbers", "❄️ AC Repair", "🖌️ Painters", "🦟 Pest Control", "💧 Waterproofing", "🛋️ Furniture Repair", "🔥 Geyser Repair", "🔌 Generator Services"],
                ["⚡ Electricians", "🔨 Carpenters", "🧹 Home Cleaning", "🌱 Gardening", "☀️ Solar Panel", "🔑 Locksmith", "🔋 UPS Repair", "🧪 Water Tank Cleaning"]
            )}
            ${createMega("domestic", "Domestic Workers", "👥", 
                ["🧹 Maid / Housemaid", "🚗 Driver", "🌱 Mali / Gardener", "🧺 Dhobi", "👦 House Boy", "🦮 Pet Sitter"],
                ["🍳 Cook", "👮 Chowkidar", "👶 Nanny / Ayah", "🧼 Sweeper", "👵 Elderly Care", "🚿 Car Washer"]
            )}
            ${createMega("edu", "Education & Training", "🎓", 
                ["📚 Home Tuition", "👩‍🏫 Female Teachers", "📖 Hifz-e-Quran", "🗣️ English Speaking", "💻 Computer Courses", "📝 Matric/FSc Coaching", "🚗 Driving Schools"],
                ["🌐 Online Tuition", "☪️ Quran Teacher", "🇦🇪 Arabic Teacher", "🎓 IELTS Prep", "🏫 Academies", "📋 Entry Test Prep", "🧸 Montessori Schools"]
            )}
            ${createMega("auto", "Auto Services", "🚗", 
                ["👨‍🔧 Car Mechanic", "🎨 Denting & Painting", "🚿 Car Wash", "⛽ CNG Installation", "🏍️ Bike Mechanic", "🛢️ Oil Change", "🏎️ Car Dealers", "🔍 Vehicle Inspection"],
                ["⚡ Car Electrician", "❄️ Car AC Service", "🛞 Tyre Shop", "⚙️ Spare Parts", "📡 Tracker Install", "🪟 Windscreen Repair", "🛡️ Auto Insurance"]
            )}
            ${createMega("health", "Health & Beauty", "✨", 
                ["👨‍⚕️ General Physician", "🦷 Dentists", "🧘 Physiotherapy", "💊 Pharmacy", "💈 Men's Salon", "🎨 Mehndi Artist", "🍎 Nutritionist", "👁️ Eye Specialist"],
                ["🩺 Specialist Doctors", "🧪 Diagnostic Labs", "💅 Beauty Parlor", "🧖 Ladies Salon", "💆 Massage & Spa", "🔬 Skin Specialist", "🦷 Orthodontist"]
            )}
            ${createMega("travel", "Travel & Transportation", "✈️", 
                ["🎫 Travel Agency", "🕋 Umrah/Hajj", "🚗 Car Rentals", "🚌 School Van", "🛺 Rickshaw/Taxi", "📦 Packers & Movers", "🚍 Inter-City Bus"],
                ["🛂 Visa Consultant", "🗺️ Tour Packages", "👤 Car with Driver", "🏢 Office Pick & Drop", "🚚 Courier Service", "🚢 Cargo Service", "🚆 Train Booking"]
            )}
            ${createMega("food", "Food & Restaurants", "🍴", 
                ["🍽️ Restaurants", "🍗 BBQ & Grill", "🥡 Chinese Food", "🍚 Biryani", "🦐 Seafood", "☕ Chai Dhaba", "🥐 Bakery"],
                ["🍲 Desi Food", "🍔 Fast Food", "🍕 Pizza Places", "🥘 Karahi & Handi", "🍳 Breakfast", "🍰 Cafes", "🍬 Mithai Shops"]
            )}
            ${createMega("shop", "Shopping & Retail", "🛍️", 
                ["🛒 Grocery Store", "🍎 Fruits & Veg", "🥩 Meat Shop", "🥛 Milk Shop", "📱 Mobile Shops", "💻 Laptop/PC"],
                ["👔 Men's Fashion", "👗 Ladies Fashion", "👶 Kids Wear", "💍 Jewelry", "⌚ Watches", "👟 Shoes"]
            )}
            ${createMega("workers", "Workers & Helpers", "👷", 
                ["🧱 Mason / Mistri", "🏗️ Labor", "📦 Loader", "👮 Security Guard", "🧤 Bodyguard", "📹 CCTV Operator"],
                ["👔 Office Boy", "🍽️ Waiter", "🚲 Delivery Boy", "🏍️ Rider", "🌱 Gardener", "🧹 Sweeper"]
            )}
            ${createMega("industrial", "Industrial Workers", "🏭", 
                ["🔥 Welder", "🛠️ Fabricator", "⚙️ Turner", "🔧 Machinist", "🔩 Fitter", "⚡ Industrial Electrician"],
                ["❄️ Industrial AC", "🔥 Boiler Operator", "🛗 Lift Tech", "☀️ Solar Tech", "📡 Network Tech"]
            )}
        </div>
        `;
    }
};

let megaTimers = {};

function showMega(id) {
    // Clear all pending hide timers
    Object.values(megaTimers).forEach(t => clearTimeout(t));
    
    // Hide all other megas immediately
    document.querySelectorAll('.mega-dropdown').forEach(el => {
        if(el.id !== 'mega-' + id) {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.transform = 'translateY(10px)';
        }
    });

    const el = document.getElementById('mega-' + id);
    if (el) {
        // Calculate position: bottom of category-nav-outer
        const catNav = document.querySelector('.category-nav-outer');
        if (catNav) {
            const rect = catNav.getBoundingClientRect();
            el.style.top = rect.bottom + 'px';
        }
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'translateY(0)';
    }
}

function hideMega(id) {
    megaTimers[id] = setTimeout(() => {
        const el = document.getElementById('mega-' + id);
        if(el) {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.transform = 'translateY(10px)';
        }
    }, 200); // Increased buffer to prevent "hanging"
}

function keepMega(id) {
    clearTimeout(megaTimers[id]);
    showMega(id);
}

document.addEventListener('DOMContentLoaded', () => {
    const navPH = document.getElementById('navbar-placeholder');
    if (navPH) navPH.innerHTML = components.getNavbar();
    const footPH = document.getElementById('footer-placeholder');
    if (footPH) footPH.innerHTML = components.getFooter();

    // Update auth area after navbar is injected
    updateNavAuth();

    // Apply saved theme
    if (localStorage.getItem('psh_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.textContent = '☀️';
    }

    // Update cart badge
    if (typeof Cart !== 'undefined') Cart.updateBadge();
});

function updateNavAuth() {
    const authArea = document.getElementById('nav-auth-area');
    if (!authArea) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const prefix = isSubPage ? '../' : '';

    let user = null;
    try { user = JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch(e) {}

    if (user) {
        const dashLink = user.role === 'admin'
            ? prefix + 'pages/dashboard.html'
            : prefix + 'pages/customer-dashboard.html';
        const dashLabel = user.role === 'admin' ? '📊 Admin Dashboard' : '📊 My Dashboard';
        authArea.innerHTML = `
            <a href="${dashLink}" class="btn-login nav-dashboard-btn" title="${dashLabel}">${dashLabel}</a>
            <button class="btn-signup" onclick="navLogout()">🚪 Logout</button>
        `;
    } else {
        authArea.innerHTML = `
            <a href="${prefix}pages/login.html" class="btn-login">👤 Log In</a>
            <a href="${prefix}pages/signup.html" class="btn-signup">👥 Sign Up</a>
        `;
    }
}

function navLogout() {
    if (confirm('Log out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('psh_theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

// Append getFooter to components object
components.getFooter = function() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const prefix = isSubPage ? '../' : '';
    return `
    <footer class="site-footer">
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="${prefix}index.html" class="logo">Pak<span>Services</span>Hub</a>
                <p>Connecting verified local professionals with communities across Pasrur, Sialkot and Narowal.</p>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <a href="${prefix}index.html">Home</a>
                <a href="${prefix}pages/services.html">Services</a>
                <a href="${prefix}pages/about.html">About Us</a>
                <a href="${prefix}pages/contact.html">Contact</a>
            </div>
            <div class="footer-col">
                <h4>Services</h4>
                <a href="#">Plumbers</a>
                <a href="#">Electricians</a>
                <a href="#">Home Tutors</a>
                <a href="#">Car Mechanics</a>
            </div>
            <div class="footer-col">
                <h4>Legal</h4>
                <a href="${prefix}pages/privacy.html">Privacy Policy</a>
                <a href="${prefix}pages/terms.html">Terms of Service</a>
                <a href="${prefix}pages/faq.html">FAQ</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 PakServicesHub. All rights reserved. | 📞 0339-0005654 | ✉️ support@pakserviceshub.com</p>
        </div>
    </footer>
    `;
};
