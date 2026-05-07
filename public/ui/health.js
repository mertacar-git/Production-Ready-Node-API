const uptimeElement = document.getElementById('uptime');

if (uptimeElement) {
  let current = Number(uptimeElement.dataset.uptime || uptimeElement.textContent || '0');
  if (!Number.isFinite(current)) current = 0;

  setInterval(() => {
    current += 1;
    uptimeElement.textContent = String(current);
  }, 1000);
}
