import { spawn } from 'node:child_process';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const PORT = process.env.SMOKE_PORT || '3999';

/** Minimal env so dotenv / host overrides cannot break CI or Windows smoke runs */
const childEnv = {
  PATH: process.env.PATH ?? '',
  NODE_ENV: 'test',
  PORT,
  JWT_SECRET: 'smoke-test-jwt-secret-must-be-long-enough-for-hs256!!',
  REDIS_URL: '',
};
if (process.env.SystemRoot) childEnv.SystemRoot = process.env.SystemRoot;
if (process.env.PATHEXT) childEnv.PATHEXT = process.env.PATHEXT;

const child = spawn(process.execPath, ['src/server.js'], {
  cwd: rootDir,
  env: childEnv,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let childOutput = '';
child.stderr.on('data', (d) => {
  childOutput += d.toString();
});
child.stdout.on('data', (d) => {
  childOutput += d.toString();
});

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      })
      .on('error', reject);
  });
}

async function waitForHealth() {
  const url = `http://127.0.0.1:${PORT}/health`;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await httpGet(url);
      if (r.status === 200) {
        const json = JSON.parse(r.body);
        if (json.status === 'OK') return true;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(
    `Server did not become ready in time. Child output:\n${childOutput || '(no output)'}`
  );
}

try {
  await waitForHealth();
  console.log('Smoke test OK: GET /health returned 200');
  child.kill('SIGTERM');
  process.exit(0);
} catch (err) {
  console.error('Smoke test failed:', err.message);
  child.kill('SIGTERM');
  process.exit(1);
}
