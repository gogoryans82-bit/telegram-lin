require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;
const TELEGRAM_URL = process.env.TELEGRAM_URL || '';
const REDIRECT_SECONDS = parseInt(process.env.REDIRECT_SECONDS || '5', 10);

// Serve static assets from /public (if you later add CSS/JS files)
app.use(express.static(path.join(__dirname, 'public')));

// ─── Health check ───
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    telegramUrl: TELEGRAM_URL ? 'configured' : 'MISSING',
    redirectSeconds: REDIRECT_SECONDS
  });
});

// ─── Redirect page ───
app.get('/', (req, res) => {
  const templatePath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(templatePath, 'utf8', (err, html) => {
    if (err) {
      console.error('❌ Failed to read redirect.html:', err);
      return res.status(500).send('Redirect page not found.');
    }

    // Replace placeholders with env values
    const rendered = html
      .replace(/%%TELEGRAM_URL%%/g, TELEGRAM_URL)
      .replace(/%%REDIRECT_SECONDS%%/g, REDIRECT_SECONDS.toString());

    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'no-store');
    res.send(rendered);
  });
});

// ─── Fallback (redirect all other routes to /) ───
app.get('*', (req, res) => {
  res.redirect('/');
});

// ─── Start server ───
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 Telegram Redirect Server              ║');
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║   Port:              ${PORT.toString().padEnd(22)}║`);
  console.log(`║   Redirect delay:    ${(REDIRECT_SECONDS + 's').padEnd(22)}║`);
  console.log(`║   Telegram URL:      ${(TELEGRAM_URL ? '✅ set' : '❌ MISSING').padEnd(22)}║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');

  if (!TELEGRAM_URL) {
    console.warn('⚠️  TELEGRAM_URL is not set. The page will show a configuration warning.');
    console.warn('   Set it in your .env file or Render environment variables.');
  }
});
