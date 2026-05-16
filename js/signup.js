/**
 * PakServicesHub - Signup Logic
 * Password: min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */

function validatePassword(pw) {
    return {
        len:  pw.length >= 6,
        up:   /[A-Z]/.test(pw),
        low:  /[a-z]/.test(pw),
        num:  /[0-9]/.test(pw),
        spec: /[^A-Za-z0-9]/.test(pw)
    };
}

function updateCriteria(pw) {
    const v = validatePassword(pw);
    const set = (id, pass) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = (pass ? '✓ ' : '✗ ') + el.textContent.replace(/^[✓✗] /, '');
        el.className = 'c-item ' + (pass ? 'c-pass' : 'c-fail');
    };
    set('c-len',  v.len);
    set('c-up',   v.up);
    set('c-low',  v.low);
    set('c-num',  v.num);
    set('c-spec', v.spec);

    const allPass = v.len && v.up && v.low && v.num && v.spec;
    const bar = document.getElementById('pw-strength');
    if (bar) {
        if (pw.length === 0) {
            bar.innerHTML = '';
        } else if (allPass) {
            bar.innerHTML = '<span class="pw-strong">✅ Strong password</span>';
        } else {
            const score = [v.len, v.up, v.low, v.num, v.spec].filter(Boolean).length;
            const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
            const colors = ['pw-score-1', 'pw-score-1', 'pw-score-2', 'pw-score-3', 'pw-score-4', 'pw-score-5'];
            bar.innerHTML = `<div class="pw-bar-wrap"><div class="pw-bar pw-bar-score-${score}"></div></div><span class="pw-score-label ${colors[score]}">${labels[score]}</span>`;
        }
    }
}

function showError(msg) {
    const el = document.getElementById('signup-error');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    el.style.display = 'block';
    const s = document.getElementById('signup-success');
    if (s) { s.style.display = 'none'; s.classList.remove('show'); }
}

function showSuccess(msg) {
    const el = document.getElementById('signup-success');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    el.style.display = 'block';
    const e = document.getElementById('signup-error');
    if (e) { e.style.display = 'none'; e.classList.remove('show'); }
}

function clearMsgs() {
    ['signup-error', 'signup-success'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.classList.remove('show'); el.style.display = 'none'; }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (localStorage.getItem('psh_theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Live password criteria
    const pwInput = document.getElementById('su-password');
    if (pwInput) {
        pwInput.addEventListener('input', () => updateCriteria(pwInput.value));
    }

    // Redirect if already logged in as customer
    const existing = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (existing && existing.role === 'customer') {
        window.location.href = 'customer-dashboard.html';
    }
});

function handleSignup(e) {
    e.preventDefault();
    clearMsgs();

    const name     = document.getElementById('su-name').value.trim();
    const email    = document.getElementById('su-email').value.trim().toLowerCase();
    const phone    = document.getElementById('su-phone').value.trim();
    const password = document.getElementById('su-password').value;
    const confirm  = document.getElementById('su-confirm').value;
    const btn      = document.getElementById('su-btn');
    const btnLabel = document.getElementById('su-btn-label');

    // Validate fields
    if (!name)  { showError('Please enter your full name.'); return; }
    if (!email) { showError('Please enter your email address.'); return; }
    if (!phone) { showError('Please enter your phone number.'); return; }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address (e.g. ali@gmail.com).');
        return;
    }

    if (!/^03[0-9]{9}$/.test(phone.replace(/-/g, ''))) {
        showError('Please enter a valid Pakistani phone number (e.g. 03001234567).');
        return;
    }

    // Password strength
    const v = validatePassword(password);
    const missing = [];
    if (!v.len)  missing.push('at least 6 characters');
    if (!v.up)   missing.push('1 uppercase letter');
    if (!v.low)  missing.push('1 lowercase letter');
    if (!v.num)  missing.push('1 number');
    if (!v.spec) missing.push('1 special character (!@#$%...)');

    if (missing.length > 0) {
        showError('Password needs: ' + missing.join(', ') + '.');
        return;
    }

    if (password !== confirm) {
        showError('Passwords do not match. Please re-enter.');
        return;
    }

    // Check duplicate email
    const accounts = JSON.parse(localStorage.getItem('psh_customers') || '[]');
    if (accounts.find(a => a.email === email)) {
        showError('An account with this email already exists. Please login instead.');
        return;
    }

    // Save account
    const newAccount = { name, email, phone, password, role: 'customer', joinedAt: new Date().toISOString() };
    accounts.push(newAccount);
    localStorage.setItem('psh_customers', JSON.stringify(accounts));

    // Auto-login
    localStorage.setItem('currentUser', JSON.stringify({
        name, email, phone, role: 'customer', joinedAt: newAccount.joinedAt
    }));

    // UI feedback
    btn.disabled = true;
    btnLabel.textContent = '✅ Account Created!';
    showSuccess('✅ Account created successfully! Welcome, ' + name + '! Redirecting to your dashboard…');

    setTimeout(() => { window.location.href = 'customer-dashboard.html'; }, 1800);
}
