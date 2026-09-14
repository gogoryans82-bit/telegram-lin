const fs = require('fs');   // ← add if not already present

// ...existing code...

// ═══════════════════════════════════════════════════════════
// TELEGRAM REDIRECT PAGE (with env variable injection)
// ═══════════════════════════════════════════════════════════
app.get('/telegram', (req, res) => {
  const templatePath = path.join(__dirname, 'redirect.html');
  fs.readFile(templatePath, 'utf8', (err, html) => {
    if (err) {
      console.error('Failed to read redirect.html:', err);
      return res.status(500).send('Redirect page not found.');
    }

    const telegramUrl = process.env.TELEGRAM_URL || '';
    const rendered = html.replace(/%%TELEGRAM_URL%%/g, telegramUrl);

    res.set('Content-Type', 'text/html');
    res.send(rendered);
  });
});
