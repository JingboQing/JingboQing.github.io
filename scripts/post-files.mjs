// Publishes the files kept inside each post folder (images, videos, PDFs, data) at /media/posts/<post folder>/.
// Markdown files are not published. Images referenced as ![...](./a.jpg) are also optimised by Astro;
// the copies here serve raw HTML (<img>, <video>, links) and downloads.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP = /\.(md|mdx)$/i;
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.csv': 'text/csv; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip' };

function listFiles(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return listFiles(path.join(dir, entry.name), rel);
    return SKIP.test(entry.name) ? [] : [rel];
  });
}

// A folder's files are published only if at least one of its language versions is not a draft.
const publishedCache = new Map();
function isPublished(folder) {
  if (!publishedCache.has(folder)) {
    const docs = fs.existsSync(folder) ? fs.readdirSync(folder).filter((name) => SKIP.test(name)) : [];
    publishedCache.set(folder, docs.some((name) => {
      const head = fs.readFileSync(path.join(folder, name), 'utf8').match(/^---\n([\s\S]*?)\n---/);
      return !(head && /^draft:\s*true\s*$/m.test(head[1]));
    }));
  }
  return publishedCache.get(folder);
}

export default function postFiles({ postsDir }) {
  let base = '';
  return {
    name: 'post-files',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        base = (config.base || '').replace(/\/$/, '');
        const prefix = `${base}/media/posts/`;
        updateConfig({
          vite: {
            plugins: [{
              name: 'post-files-dev',
              configureServer(server) {
                server.middlewares.use((req, res, next) => {
                  const url = decodeURIComponent((req.url || '').split('?')[0]);
                  if (!url.startsWith(prefix)) return next();
                  const file = path.join(postsDir, url.slice(prefix.length));
                  if (!file.startsWith(postsDir + path.sep) || SKIP.test(file) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
                  res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
                  fs.createReadStream(file).pipe(res);
                });
              },
            }],
          },
        });
      },
      'astro:build:done': ({ dir }) => {
        const out = path.join(fileURLToPath(dir), 'media', 'posts');
        for (const rel of listFiles(postsDir)) {
          if (!isPublished(path.join(postsDir, path.dirname(rel)))) continue;
          const target = path.join(out, rel);
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.copyFileSync(path.join(postsDir, rel), target);
        }
      },
    },
  };
}
