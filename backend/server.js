require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

// ✅ Hardcoded fallback — works even if env fails
const TELEGRAM_URL = (process.env.TELEGRAM_URL || '').trim() || 'https://t.me/goodreview12';
const REDIRECT_SECONDS = parseInt(process.env.REDIRECT_SECONDS || '5', 10);

// Static files
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath, {index: false }));

// 🔍 Debug route — shows exactly what the server sees
app.get('/debug', (req, res) => {
  res.json({
    telegramUrl: TELEGRAM_URL,
    envValue: process.env.TELEGRAM_URL || '(not set)',
    usingFallback: !process.env.TELEGRAM_URL,
    redirectSeconds: REDIRECT_SECONDS,
    nodeVersion: process.version
  });
});

// Health check
app.get('/health', (req, res) => res.json({ ok: true, telegramUrl: TELEGRAM_URL }));

// Redirect page
app.get('/', (req, res) => {
  const templatePath = path.join(publicPath, 'index.html');

  fs.readFile(templatePath, 'utf8', (err, html) => {
    if (err) {
      console.error('❌ Failed to read index.html:', err);
      return res.status(500).send('Redirect page not found.');
    }

    const rendered = html
      .replace(/%%TELEGRAM_URL%%/g, TELEGRAM_URL)
      .replace(/%%REDIRECT_SECONDS%%/g, REDIRECT_SECONDS.toString());

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'no-store');
    res.send(rendered);
  });
});

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  console.log(`📲 Telegram URL: ${TELEGRAM_URL}`);
  console.log(`⏱️  Redirect delay: ${REDIRECT_SECONDS}s`);
});
