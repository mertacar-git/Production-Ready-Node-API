export function root(req, res) {
  const acceptsHtml = req.accepts(['html', 'json']) === 'html';
  if (acceptsHtml) {
    res.type('html').send(`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Node API Dashboard</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
        color: #e2e8f0;
        background:
          radial-gradient(1200px 600px at -10% -10%, #1d4ed8 0%, transparent 60%),
          radial-gradient(900px 500px at 110% 10%, #0f766e 0%, transparent 55%),
          #020617;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      .card {
        width: min(840px, 96vw);
        border-radius: 28px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.78);
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
        padding: 28px;
      }
      h1 { margin: 0; font-size: 34px; }
      .muted { color: #94a3b8; margin-top: 10px; }
      .grid {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
      }
      .btn {
        display: block;
        text-decoration: none;
        color: #0f172a;
        border-radius: 14px;
        padding: 14px 16px;
        font-weight: 700;
        text-align: center;
        transition: transform .18s ease, box-shadow .18s ease;
      }
      .btn:hover { transform: translateY(-2px); }
      .btn-register {
        background: linear-gradient(90deg, #22c55e, #4ade80);
        box-shadow: 0 12px 28px rgba(34, 197, 94, .28);
      }
      .btn-login {
        background: linear-gradient(90deg, #38bdf8, #60a5fa);
        box-shadow: 0 12px 28px rgba(56, 189, 248, .28);
      }
      .mini {
        margin-top: 16px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .chip {
        color: #cbd5e1;
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Production Ready Node API</h1>
      <p class="muted">Auth akisini tarayicidan test etmek icin asagidaki ekranlara git.</p>
      <section class="grid">
        <a class="btn btn-register" href="/auth/register">Register Sayfasi</a>
        <a class="btn btn-login" href="/auth/login">Login Sayfasi</a>
      </section>
      <section class="mini">
        <span class="chip">Health: /health</span>
        <span class="chip">Env: /env</span>
        <span class="chip">Protected: /me</span>
      </section>
    </main>
  </body>
</html>`);
    return;
  }

  res.json({ message: 'API is running successfully' });
}

export function health(req, res) {
  const payload = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  const acceptsHtml = req.accepts(['html', 'json']) === 'html';
  if (acceptsHtml) {
    const uptimeSeconds = Math.floor(payload.uptime);
    res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Health</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at 20% 20%, #1f2937, #020617 70%);
        font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
        color: #e2e8f0;
      }
      .card {
        width: min(680px, 92vw);
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 24px;
        padding: 28px;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(8px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        position: relative;
        overflow: hidden;
      }
      .pulse {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.8);
        animation: pulse 1.8s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.75); }
        70% { box-shadow: 0 0 0 16px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
      }
      .status {
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 0.2px;
      }
      .subtitle {
        color: #94a3b8;
        margin-bottom: 22px;
      }
      .grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .tile {
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 14px;
        padding: 14px;
        background: rgba(30, 41, 59, 0.55);
      }
      .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
      .value { margin-top: 6px; font-size: 17px; font-weight: 600; word-break: break-word; }
      .bar {
        margin-top: 18px;
        height: 6px;
        border-radius: 99px;
        background: #1e293b;
        overflow: hidden;
      }
      .bar > span {
        display: block;
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, #22c55e, #38bdf8, #22c55e);
        background-size: 200% 100%;
        animation: flow 2.5s linear infinite;
      }
      @keyframes flow {
        from { background-position: 0% 50%; }
        to { background-position: 200% 50%; }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="header">
        <div class="pulse" aria-hidden="true"></div>
        <div class="status">System Healthy</div>
      </div>
      <div class="subtitle">Service is up and responding normally.</div>
      <section class="grid">
        <article class="tile">
          <div class="label">Status</div>
          <div class="value">${payload.status}</div>
        </article>
        <article class="tile">
          <div class="label">Uptime (seconds)</div>
          <div class="value" id="uptime" data-uptime="${uptimeSeconds}">${uptimeSeconds}</div>
        </article>
        <article class="tile">
          <div class="label">Timestamp</div>
          <div class="value">${payload.timestamp}</div>
        </article>
      </section>
      <div class="bar"><span></span></div>
    </main>
    <script defer src="/ui/health.js"></script>
  </body>
</html>`);
    return;
  }

  res.json(payload);
}

export function envInfo(req, res) {
  res.json({
    environment: process.env.NODE_ENV || 'development',
  });
}
