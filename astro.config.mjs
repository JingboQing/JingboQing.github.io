import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { basePath, siteURL } from './site.config.mjs';
import contentPaths from './scripts/rehype-content-paths.mjs';
import figures from './scripts/rehype-figures.mjs';
import postFiles from './scripts/post-files.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { unified } from '@astrojs/markdown-remark';

const postsDir = fileURLToPath(new URL('./src/content/posts', import.meta.url));

export default defineConfig({
  site: siteURL,
  base: basePath,
  output: 'static',
  trailingSlash: 'always',
  integrations: [postFiles({ postsDir })],
  markdown: {
    // Light code blocks to match the rest of the site.
    shikiConfig: { theme: 'github-light' },
    processor: unified({
      remarkPlugins: [remarkMath],
      // figures before KaTeX, so that $...$ in figure captions is typeset too.
      rehypePlugins: [rehypeRaw, figures, rehypeKatex, [contentPaths, { base: basePath, postsDir }]],
    }),
  },
});
