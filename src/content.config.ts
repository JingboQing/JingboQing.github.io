import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { categoryIds } from './lib/categories';

const optionalLink = z.union([z.literal(''), z.url()]).optional();
const profiles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/profiles' }),
  // `photo` is an image next to the profile files, e.g. `photo: ./photo.jpg`; without it the wave drawing is shown.
  schema: ({ image }) => z.object({
    name: z.string(), role: z.string(), field: z.string().optional(), description: z.string().optional(), affiliations: z.array(z.string()),
    researchAreas: z.array(z.string()), email: z.email(),
    scholar: optionalLink, orcid: optionalLink, github: optionalLink, researchgate: optionalLink,
    cvLabel: z.string().optional(),
    photo: image().optional(), photoAlt: z.string().optional(),
  }),
});
const cv = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/cv' }),
  schema: z.object({ title: z.string(), description: z.string() }),
});
// Each post is a folder: zh.md / en.md plus its own images, videos and files.
// `cover` is a file in that folder, e.g. `cover: ./cover.jpg`.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(), date: z.coerce.date(),
    datePrecision: z.enum(['day', 'month', 'year']).default('day'),
    type: z.enum(categoryIds), summary: z.string(),
    // true: shown in the overview's research & updates list (set it in both zh.md and en.md); false: only on the updates page.
    inOverview: z.boolean().default(false), draft: z.boolean().default(false),
    cover: image().optional(), coverAlt: z.string().optional(), coverCaption: z.string().optional(),
    // false: the cover appears only in lists, not at the top of the post page.
    coverOnPage: z.boolean().default(true),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }).superRefine((data, ctx) => {
    if (data.cover && !data.coverAlt) ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: '有封面时需要填写 coverAlt（封面图的文字说明）。' });
    for (const [index, link] of data.links.entries()) {
      if (!/^(https?:\/\/|\/[^/]|\.\/|mailto:)/.test(link.url)) ctx.addIssue({ code: 'custom', path: ['links', index, 'url'], message: '链接应为 https:// 网址、以 / 开头的站内路径，或以 ./ 开头的本文件夹文件。' });
    }
  }),
});
const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(), authors: z.array(z.string()), journal: z.string(), year: z.number(),
    volume: z.string().optional(), issue: z.string().optional(), pages: z.string().optional(),
    url: z.url(), doi: z.string().optional(), selected: z.boolean().default(false),
    tags: z.array(z.string()).default([]), jcr: z.string().optional(), impactFactor: z.string().optional(),
    // Authors who contributed equally (co-first authors), written exactly as in `authors`; they are marked with †.
    equalContribution: z.array(z.string()).default([]),
    // true: listed under the CV's selected journal articles (both languages); false: publications page only.
    inCV: z.boolean().default(true),
  }),
});
export const collections = { profiles, cv, posts, publications };
