import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('.', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.ttf': 'font/ttf' };

createServer(async (request, response) => {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const file = normalize(join(root, requested));
  if (!file.startsWith(normalize(root))) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    await stat(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(4173, '127.0.0.1');
