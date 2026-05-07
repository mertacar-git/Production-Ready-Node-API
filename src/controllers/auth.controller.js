import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUserByEmail, insertUser } from '../db/postgres.js';

export function registerPage(req, res) {
  res.type('html').send(`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
        background: radial-gradient(circle at 10% 0%, #14532d, #020617 68%);
        color: #e2e8f0;
      }
      .panel {
        width: min(560px, 95vw);
        border: 1px solid rgba(74, 222, 128, 0.28);
        border-radius: 20px;
        padding: 24px;
        background: rgba(6, 24, 18, 0.84);
      }
      h1 { margin: 0 0 8px; font-size: 30px; }
      .hint { color: #86efac; margin-bottom: 14px; }
      label { display: block; margin: 10px 0 6px; }
      input {
        width: 100%;
        border: 1px solid rgba(74, 222, 128, 0.35);
        border-radius: 10px;
        background: rgba(2, 6, 23, 0.5);
        color: #f8fafc;
        padding: 11px;
      }
      .btn {
        width: 100%;
        margin-top: 12px;
        border: 0;
        border-radius: 10px;
        padding: 12px;
        color: #052e16;
        font-weight: 700;
        background: linear-gradient(90deg, #22c55e, #86efac);
        cursor: pointer;
      }
      .btn:disabled { opacity: 0.75; cursor: wait; }
      .status {
        margin-top: 10px;
        min-height: 22px;
        color: #bbf7d0;
        font-size: 14px;
      }
      .status.error { color: #fecaca; }
      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #86efac;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: -2px;
        animation: spin .9s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .row { margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; }
      .nav {
        border: 1px solid rgba(134, 239, 172, 0.35);
        background: transparent;
        color: #d1fae5;
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      pre {
        margin-top: 14px;
        border: 1px solid rgba(74, 222, 128, 0.25);
        background: rgba(2, 6, 23, 0.75);
        border-radius: 10px;
        padding: 10px;
        min-height: 60px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <main class="panel">
      <h1>Kullanici Kayit</h1>
      <div class="hint">Bu ekran yalnizca register icin tasarlandi.</div>
      <form id="registerForm">
        <label for="email">Email</label>
        <input id="email" type="email" required value="test@example.com" />
        <label for="password">Password</label>
        <input id="password" type="password" required value="secret123" />
        <button class="btn" id="registerBtn" type="submit">Register Ol</button>
      </form>
      <div class="status" id="statusText">Hazir.</div>
      <div class="row">
        <a class="nav" href="/">Ana Sayfa</a>
        <a class="nav" href="/auth/login">Login Ekrani</a>
        <a class="nav" href="/health">Health</a>
      </div>
      <pre id="output">Hazir.</pre>
    </main>
    <script defer src="/ui/register.js"></script>
  </body>
</html>`);
}

export function loginPage(req, res) {
  res.type('html').send(`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
        background: radial-gradient(circle at 90% 0%, #1d4ed8, #020617 68%);
        color: #e2e8f0;
      }
      .panel {
        width: min(560px, 95vw);
        border: 1px solid rgba(96, 165, 250, 0.28);
        border-radius: 20px;
        padding: 24px;
        background: rgba(12, 22, 40, 0.84);
      }
      h1 { margin: 0 0 8px; font-size: 30px; }
      .hint { color: #93c5fd; margin-bottom: 14px; }
      label { display: block; margin: 10px 0 6px; }
      input {
        width: 100%;
        border: 1px solid rgba(96, 165, 250, 0.35);
        border-radius: 10px;
        background: rgba(2, 6, 23, 0.5);
        color: #f8fafc;
        padding: 11px;
      }
      .btn {
        width: 100%;
        margin-top: 12px;
        border: 0;
        border-radius: 10px;
        padding: 12px;
        color: #082f49;
        font-weight: 700;
        background: linear-gradient(90deg, #38bdf8, #93c5fd);
        cursor: pointer;
      }
      .btn:disabled { opacity: 0.75; cursor: wait; }
      .status {
        margin-top: 10px;
        min-height: 22px;
        color: #bfdbfe;
        font-size: 14px;
      }
      .status.error { color: #fecaca; }
      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #93c5fd;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: -2px;
        animation: spin .9s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .row { margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; }
      .nav {
        border: 1px solid rgba(147, 197, 253, 0.35);
        background: transparent;
        color: #dbeafe;
        border-radius: 8px;
        padding: 8px 10px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      pre {
        margin-top: 14px;
        border: 1px solid rgba(96, 165, 250, 0.25);
        background: rgba(2, 6, 23, 0.75);
        border-radius: 10px;
        padding: 10px;
        min-height: 60px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <main class="panel">
      <h1>Kullanici Giris</h1>
      <div class="hint">Bu ekran yalnizca login icin tasarlandi.</div>
      <form id="loginForm">
        <label for="email">Email</label>
        <input id="email" type="email" required value="test@example.com" />
        <label for="password">Password</label>
        <input id="password" type="password" required value="secret123" />
        <button class="btn" id="loginBtn" type="submit">Login Ol</button>
      </form>
      <div class="status" id="statusText">Hazir.</div>
      <div class="row">
        <a class="nav" href="/">Ana Sayfa</a>
        <a class="nav" href="/auth/register">Register Ekrani</a>
        <button class="nav" type="button" id="meButton">Me Test</button>
      </div>
      <pre id="output">Hazir.</pre>
    </main>
    <script defer src="/ui/login.js"></script>
  </body>
</html>`);
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'email and password required' });
      return;
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'invalid payload' });
      return;
    }

    const normalized = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await insertUser(normalized, passwordHash);
    if (!inserted) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    res.status(201).json({
      message: 'Registered successfully',
      email: normalized,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'email and password required' });
      return;
    }

    const normalized = email.toLowerCase().trim();
    const user = await findUserByEmail(normalized);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { sub: user.email, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      tokenType: 'Bearer',
      expiresIn: env.JWT_EXPIRES_IN,
    });
  } catch (err) {
    next(err);
  }
}

export function me(req, res) {
  const email = req.user?.email ?? req.user?.sub;
  res.json({
    user: { email },
  });
}
