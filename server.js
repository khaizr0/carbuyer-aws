require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const SSL_DOMAIN = process.env.SSL_DOMAIN || 'carbuyer.com';

// SSL certificate paths (Let's Encrypt default location)
const sslKeyPath = `/etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem`;
const sslCertPath = `/etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem`;

// Check if SSL certificates exist
const hasSSL = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);

if (hasSSL && PORT === 443) {
  console.log('SSL certificates found. Starting HTTPS server...');
  
  // HTTPS Server (Port 443)
  const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };
  
  https.createServer(httpsOptions, app).listen(443, () => {
    console.log('✅ HTTPS Server running on port 443');
  });
  
  // HTTP Server (Port 80) - Redirect to HTTPS
  http.createServer((req, res) => {
    res.writeHead(301, { 
      Location: `https://${req.headers.host}${req.url}` 
    });
    res.end();
  }).listen(80, () => {
    console.log('✅ HTTP Server redirecting to HTTPS (port 80)');
  });
  
} else {
  // Development: HTTP Server
  http.createServer(app).listen(PORT, () => {
    console.log(`✅ HTTP Server running on port ${PORT}`);
  });
}
