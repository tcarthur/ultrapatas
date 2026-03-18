require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/oauth2callback', (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    res.status(400).send(`<h2>Autorização falhou</h2><p>${error}</p>`);
    return;
  }

  if (!code) {
    res.status(400).send('<h2>Código de autorização não encontrado.</h2>');
    return;
  }

  console.log('\n=== Código de autorização recebido ===');
  console.log(code);
  console.log('====================================\n');

  res.send(`
    <html>
      <head><meta charset="utf-8"><title>Autorização Concluída</title></head>
      <body style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.6">
        <h2>Autorização concluída</h2>
        <p>Você pode fechar esta janela. Volte ao terminal onde está executando o script.</p>
      </body>
    </html>
  `);

  // Graceful exit after short delay to allow response to be delivered
  setTimeout(() => process.exit(0), 1500);
});

app.listen(PORT, () => {
  console.log(`Callback server listening on http://localhost:${PORT}/oauth2callback`);
  console.log('Abra a URL de autorização no navegador agora.');
});
