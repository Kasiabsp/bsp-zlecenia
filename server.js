// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const APP_PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_prod';
const DATA_DIR = path.join(__dirname, 'data');
const ANN_FILE = path.join(DATA_DIR, 'announcements.json');

// Ensure data dir + file
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ANN_FILE)) fs.writeFileSync(ANN_FILE, JSON.stringify([]), 'utf8');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static('public')); // opcjonalnie: serwuj front z /public

// --- Konfiguracja konta (zmień tutaj) ---
const ADMIN_USER = process.env.ADMIN_USER || 'KASIA_rst';
const ADMIN_PASS = process.env.ADMIN_PASS || 'rstkasia.2020';

// --- Helpers ---
function readAnnouncements(){
  try { return JSON.parse(fs.readFileSync(ANN_FILE, 'utf8') || '[]'); }
  catch(e){ return []; }
}
function writeAnnouncements(arr){
  fs.writeFileSync(ANN_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// --- Public endpoints ---
app.get('/api/announcements', (req, res) => {
  const items = readAnnouncements();
  res.json({ ok: true, items });
});

// --- Auth endpoints ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ u: username }, JWT_SECRET, { expiresIn: '6h' });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware: verify token
function requireAuth(req, res, next){
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: 'Missing token' });
  const token = m[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Protected endpoints ---
app.post('/api/announcements', requireAuth, (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: 'Empty text' });
  const items = readAnnouncements();
  const item = { text: String(text).trim(), date: new Date().toISOString(), author: req.user.u || 'admin' };
  items.unshift(item);
  writeAnnouncements(items);
  res.json({ ok: true, item });
});

// Optional: delete or edit endpoints can be added similarly with requireAuth

app.listen(APP_PORT, () => console.log(`Server running on port ${APP_PORT}`));
