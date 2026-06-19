const http = require('http');
const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  let fp = path.join(dist, p);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    fp = path.join(dist, 'index.html');
  }
  const ext = path.extname(fp);
  res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(fp));
}).listen(5189, () => {
  process.stdout.write('ready\n');
});
