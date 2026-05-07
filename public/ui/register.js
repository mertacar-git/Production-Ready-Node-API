const form = document.getElementById('registerForm');
const output = document.getElementById('output');
const button = document.getElementById('registerBtn');
const statusText = document.getElementById('statusText');

if (form && output && button && statusText) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    statusText.className = 'status';
    statusText.innerHTML = '<span class="spinner"></span>Kayit istegi gonderiliyor...';
    output.textContent = 'Istek bekleniyor...';

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
      statusText.className = res.ok ? 'status' : 'status error';
      statusText.textContent = res.ok
        ? 'Kayit tamamlandi.'
        : `Kayit basarisiz: ${data.error || 'Bilinmeyen hata'}`;
    } catch (err) {
      statusText.className = 'status error';
      statusText.textContent = 'Baglanti hatasi olustu.';
      output.textContent = err instanceof Error ? err.message : String(err);
    } finally {
      button.disabled = false;
    }
  });
}
