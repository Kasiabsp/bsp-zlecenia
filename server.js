const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const ADMIN_USER = process.env.ADMIN_USER || 'KASIA_rst';
const ADMIN_PASS = process.env.ADMIN_PASS || 'rstkasia.2020';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

const DATA_DIR = path.join(__dirname, 'data');
const ANN_FILE = path.join(DATA_DIR, 'announcements.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ANN_FILE)) fs.writeFileSync(ANN_FILE, JSON.stringify([]), 'utf8');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

function readAnnouncements(){
  try { return JSON.parse(fs.readFileSync(ANN_FILE, 'utf8') || '[]'); }
  catch(e){ return []; }
}
function writeAnnouncements(arr){
  fs.writeFileSync(ANN_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

app.get('/api/announcements', (req, res) => {
  res.json({ ok: true, items: readAnnouncements() });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ u: username }, JWT_SECRET, { expiresIn: '6h' });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

function requireAuth(req, res, next){
  const auth = req.headers.authorization || '';
