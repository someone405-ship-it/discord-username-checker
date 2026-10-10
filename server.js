import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkUsername, checkMany } from './utils/check.js';
import { generate, PRESET_NAMES } from './utils/generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/presets', (_req, res) => {
  res.json({ presets: PRESET_NAMES });
});

app.post('/api/generate', (req, res) => {
  try {
    const { preset = '3L', limit = 2000 } = req.body || {};
    const capped = Math.min(Math.max(parseInt(limit, 10) || 1000, 1), 50000);
    const list = generate(preset, capped);
    res.json({ ok: true, count: list.length, usernames: list });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post('/api/check', async (req, res) => {
  try {
    const { usernames = [] } = req.body || {};
    if (!Array.isArray(usernames) || !usernames.length) {
      return res.status(400).json({ ok: false, error: 'usernames array required' });
    }
    const capped = usernames.slice(0, 500);
    const results = await checkMany(capped, {
      concurrency: config.maxConcurrentChecks || 4,
      delayMs: config.delayBetweenChecksMs || 80
    });
    const summary = {
      available: results.filter((r) => r.status === 'available').length,
      taken: results.filter((r) => r.status === 'taken').length,
      invalid: results.filter((r) => r.status === 'invalid').length,
      error: results.filter((r) => r.status === 'error').length
    };
    res.json({ ok: true, summary, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/check-one', async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ ok: false, error: 'username required' });
    const result = await checkUsername(username);
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || config.webPort || 3847;
app.listen(port, () => {
  console.log(`Discord Username Checker → http://localhost:${port}`);
});
