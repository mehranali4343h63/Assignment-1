/**
 * PakServicesHub - Login Page Logic
 * Supports both Admin and Customer login
 */

let _loginMode = 'customer';

document.addEventListener('DOMContentLoaded', () => {
    // Init admin hash
    store.initAdminHash();

    // Redirect if already logged in
    const existing = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (existing) {
        const redir = new URLSearchParams(window.location.search).get('redirect');
        if (existing.role === 'admin') {
            window.location.href = 'dashboard.html';
            return;
        } else if (existing.role === 'customer') {
            window.location.href = redir ? decodeURIComponent(redir) : 'customer-dashboard.html';
            return;
        }
    }

    // Apply saved theme
    if (localStorage.getItem('psh_theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Default to customer mode
    setLoginMode('customer');
});

function setLoginMode(mode) {
    _loginMode = mode;
    const adminBtn  = document.getElementById('mode-admin');
    const custBtn   = document.getElementById('mode-customer');
    const title     = document.getElementById('login-mode-title');
    const hint      = document.getElementById('login-hint');
    const userLabel = document.getElementById('username-label');
    const userInput = document.getElementById('username');

    if (mode === 'admin') {
        if (adminBtn) adminBtn.classList.add('mode-btn-active');
        if (custBtn)  custBtn.classList.remove('mode-btn-active');
        if (title)    title.textContent = 'Admin Login';
        if (hint)     hint.style.display = 'flex';
        if (userLabel) userLabel.textContent = 'Username';
        if (userInput) userInput.placeholder = 'admin';
    } else {
        if (custBtn)  custBtn.classList.add('mode-btn-active');
        if (adminBtn) adminBtn.classList.remove('mode-btn-active');
        if (title)    title.textContent = 'Customer Login';
        if (hint)     hint.style.display = 'none';
        if (userLabel) userLabel.textContent = 'Email / Phone';
        if (userInput) userInput.placeholder = 'your@email.com';
    }
}

function togglePw() {
    const input = document.getElementById('password');
    const btn   = document.getElementById('pw-toggle-btn');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btn) btn.textContent = '👁️';
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username  = document.getElementById('username').value.trim();
    const password  = document.getElementById('password').value;
    const errorBox  = document.getElementById('login-error');
    const submitBtn = document.getElementById('submit-btn');
    const btnLabel  = document.getElementById('btn-label');
    const redirect  = new URLSearchParams(window.location.search).get('redirect');

    submitBtn.disabled = true;
    btnLabel.textContent = '⏳ Verifying…';
    if (errorBox) { errorBox.classList.remove('show'); errorBox.textContent = ''; }

    await new Promise(r => setTimeout(r, 400));

    if (_loginMode === 'admin') {
        const ok = await store.verifyAdmin(username, password);
        if (ok) {
            localStorage.setItem('currentUser', JSON.stringify({ name: username, role: 'admin' }));
            btnLabel.textContent = '✅ Redirecting to Admin Panel…';
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
        } else {
            submitBtn.disabled = false;
            btnLabel.textContent = 'Login →';
            if (errorBox) {
                errorBox.textContent = '❌ Invalid admin credentials. Check username and password.';
                errorBox.classList.add('show');
            }
            document.getElementById('password').value = '';
        }

    } else {
        // Customer login
        const accounts = JSON.parse(localStorage.getItem('psh_customers') || '[]');

        // Match by email OR phone, case-insensitive
        const found = accounts.find(a =>
            (a.email && a.email.toLowerCase() === username.toLowerCase()) ||
            (a.phone && a.phone === username)
        );

        if (!found) {
            submitBtn.disabled = false;
            btnLabel.textContent = 'Login →';
            if (errorBox) {
                errorBox.textContent = '❌ No account found with this email/phone. Please sign up first.';
                errorBox.classList.add('show');
            }
            return;
        }

        if (found.password !== password) {
            submitBtn.disabled = false;
            btnLabel.textContent = 'Login →';
            if (errorBox) {
                errorBox.textContent = '❌ Incorrect password. Please try again.';
                errorBox.classList.add('show');
            }
            document.getElementById('password').value = '';
            return;
        }

        // Success
        localStorage.setItem('currentUser', JSON.stringify({
            name:     found.name,
            email:    found.email,
            phone:    found.phone,
            role:     'customer',
            joinedAt: found.joinedAt
        }));
        btnLabel.textContent = '✅ Welcome back, ' + found.name + '!';
        setTimeout(() => {
            window.location.href = redirect ? decodeURIComponent(redirect) : 'customer-dashboard.html';
        }, 600);
    }
}
