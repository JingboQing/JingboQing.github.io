import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { parse } from 'parse5';
import { basePath } from '../site.config.mjs';

const root = resolve('dist');
const failures = [];
const pages = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (extname(file) === '.html') pages.push(file);
  }
}
try { await walk(root); } catch { console.error('Run npm run build before npm run check.'); process.exit(1); }
const docs = new Map();
function traverse(node, fn) { fn(node); node.childNodes?.forEach(child => traverse(child, fn)); }
for (const file of pages) {
  const doc = parse(await readFile(file, 'utf8'));
  const ids = new Set();
  traverse(doc, node => {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    if (attrs.id) { if (ids.has(attrs.id)) failures.push(`${file}: duplicate id ${attrs.id}`); ids.add(attrs.id); }
    if (node.tagName === 'img' && !Object.hasOwn(attrs, 'alt')) failures.push(`${file}: image missing alt`);
    if (node.tagName === 'iframe' && !attrs.title) failures.push(`${file}: iframe missing title`);
  });
  docs.set(file, { doc, ids });
}
let linkCount = 0;
for (const [file, { doc }] of docs) {
  const relative = file.slice(root.length).replace(/index\.html$/, '');
  const pageURL = new URL(`${basePath}${relative}`, 'https://local.test');
  const jobs = [];
  traverse(doc, node => {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    for (const key of ['href', 'src', 'poster']) {
      const value = attrs[key];
      if (!value || /^(mailto:|tel:|data:|javascript:)/.test(value) || /^(https?:)?\/\//.test(value)) continue;
      linkCount++;
      jobs.push((async () => {
        const url = new URL(value, pageURL);
        if (basePath && !url.pathname.startsWith(`${basePath}/`) && url.pathname !== basePath) { failures.push(`${file}: path escapes BASE_PATH: ${value}`); return; }
        const pathname = decodeURIComponent(url.pathname.slice(basePath.length));
        let target = resolve(root, `.${pathname}`);
        if (!target.startsWith(`${root}/`) && target !== root) { failures.push(`${file}: unsafe path: ${value}`); return; }
        try {
          if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
          await stat(target);
          if (url.hash && docs.has(target) && !docs.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))) failures.push(`${file}: broken anchor: ${value}`);
        } catch { failures.push(`${file}: missing target: ${value}`); }
      })());
    }
  });
  await Promise.all(jobs);
}
// Drafts are never included in generated routes or feeds.
async function checkDrafts() {
  async function inspect(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) await inspect(file);
      else if (entry.name.endsWith('.md') && /^draft:\s*true\s*$/m.test((await readFile(file, 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '')) {
        const relative = file.slice(resolve('src/content/posts').length + 1).replace(/\.md$/, '');
        const parts = relative.split('/'); const lang = parts.pop();
        if (docs.has(join(root, lang, 'updates', ...parts, 'index.html'))) failures.push(`Draft leaked into output: ${relative}`);
      }
    }
  }
  await inspect(resolve('src/content/posts'));
}
await checkDrafts();

// Post folders: list drafts, and point out files nobody references or files too large for GitHub.
const notes = [];
async function checkPostFolders(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const docsHere = entries.filter(e => e.isFile() && e.name.endsWith('.md'));
  if (docsHere.length) {
    const text = (await Promise.all(docsHere.map(e => readFile(join(dir, e.name), 'utf8')))).join('\n');
    const folder = dir.slice(resolve('src/content/posts').length + 1);
    for (const e of docsHere) {
      if (/^draft:\s*true\s*$/m.test((await readFile(join(dir, e.name), 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '')) notes.push(`草稿，不发布：${folder}/${e.name}`);
    }
    async function files(sub) {
      for (const e of await readdir(join(dir, sub), { withFileTypes: true })) {
        const rel = sub ? `${sub}/${e.name}` : e.name;
        if (e.name.startsWith('.') || e.name.endsWith('.md')) continue;
        if (e.isDirectory()) { await files(rel); continue; }
        const size = (await stat(join(dir, rel))).size;
        if (size > 95e6) failures.push(`文件超过 GitHub 的 100 MB 上限：${folder}/${rel}（${(size / 1e6).toFixed(0)} MB）`);
        else if (size > 10e6) notes.push(`文件较大，建议压缩或改用外部链接：${folder}/${rel}（${(size / 1e6).toFixed(0)} MB）`);
        if (!text.includes(rel)) notes.push(`正文和封面都没有用到，可以删除：${folder}/${rel}`);
      }
    }
    await files('');
  }
  for (const e of entries) if (e.isDirectory()) await checkPostFolders(join(dir, e.name));
}
await checkPostFolders(resolve('src/content/posts'));

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
if (notes.length) console.log(notes.map(n => `提示：${n}`).join('\n'));
console.log(`Checked ${pages.length} HTML pages and ${linkCount} local links/assets. No broken targets, duplicate IDs, missing media labels, or published draft routes.`);
