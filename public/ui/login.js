const form = document.getElementById('loginForm');
const output = document.getElementById('output');
const meButton = document.getElementById('meButton');
const button = document.getElementById('loginBtn');
const statusText = document.getElementById('statusText');

if (form && output && button && statusText) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    statusText.className = 'status';
    statusText.innerHTML = '<span class="spinner"></span>Login istegi gonderiliyor...';
    output.textContent = 'Istek bekleniyor...';

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
      if (data.token) {
        localStorage.setItem('demoToken', data.token);
      }
      statusText.className = res.ok ? 'status' : 'status error';
      statusText.textContent = res.ok
        ? 'Login basarili. Token kaydedildi.'
        : `Login basarisiz: ${data.error || 'Bilinmeyen hata'}`;
    } catch (err) {
      statusText.className = 'status error';
      statusText.textContent = 'Baglanti hatasi olustu.';
      output.textContent = err instanceof Error ? err.message : String(err);
    } finally {
      button.disabled = false;
    }
  });
}

if (meButton && output) {
  meButton.addEventListener('click', async () => {
    const token = localStorage.getItem('demoToken');
    if (!token) {
      output.textContent = 'Token yok. Once login ol.';
      return;
    }

    output.textContent = 'Me endpoint test ediliyor...';
    try {
      const res = await fetch('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      output.textContent = err instanceof Error ? err.message : String(err);
    }
  });
}
