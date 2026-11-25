// Path handling for Markdown content.
// - Site paths (/demos/..., /media/...) get the GitHub Pages project subpath.
// - Relative paths inside a post folder (./clip.mp4, ./notes.pdf, <img src="./a.png">) point to that
//   folder's files, which scripts/post-files.mjs publishes under /media/posts/<post folder>/.
//   Markdown images written as ![...](./a.jpg) are left to Astro, which optimises them.
import path from 'node:path';

const ATTRS = ['href', 'src', 'poster'];
const isRelative = (value) => /^\.{1,2}\//.test(value);

export default function contentPaths({ base = '', postsDir = '' } = {}) {
  return (tree, file) => {
    const localImages = new Set(file.data?.astro?.localImagePaths ?? []);
    const filePath = typeof file.path === 'string' ? file.path : '';
    const postFolder = postsDir && filePath.startsWith(postsDir + path.sep) ? path.dirname(path.relative(postsDir, filePath)) : '';
    const visit = (node) => {
      if (node.type === 'element') {
        for (const key of ATTRS) {
          const value = node.properties?.[key];
          if (typeof value !== 'string') continue;
          if (value.startsWith('/') && !value.startsWith('//')) {
            node.properties[key] = `${base}${value}`;
          } else if (postFolder && isRelative(value) && !(node.tagName === 'img' && localImages.has(value))) {
            const [, file, suffix = ''] = value.match(/^([^?#]*)(.*)$/);
            const target = path.posix.normalize(path.posix.join(postFolder.split(path.sep).join('/'), file));
            node.properties[key] = `${base}/media/posts/${target.split('/').map(encodeURIComponent).join('/')}${suffix}`;
          }
        }
        if (node.tagName === 'img') {
          node.properties.loading ??= 'lazy';
          node.properties.decoding ??= 'async';
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
