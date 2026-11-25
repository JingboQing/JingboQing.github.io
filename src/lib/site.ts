import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { categories } from './categories';
export type Lang = 'zh' | 'en';
export const languages: Lang[] = ['zh', 'en'];
export const text = (lang: Lang, zh: string, en: string) => lang === 'zh' ? zh : en;
export function path(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${href}`;
}
export const postLang = (post: CollectionEntry<'posts'>) => post.id.split('/').at(-1) as Lang;
export const postSlug = (post: CollectionEntry<'posts'>) => post.id.split('/').slice(0, -1).join('/');
export const postURL = (post: CollectionEntry<'posts'>) => `/${postLang(post)}/updates/${postSlug(post)}/`;
// A link in a post's `links`: ./file points to a file in the post folder, /path to the site, anything else is external.
export function postLink(post: CollectionEntry<'posts'>, url: string) {
  if (!url.startsWith('./')) return path(url);
  const [, file, suffix = ''] = url.slice(2).match(/^([^?#]*)(.*)$/)!;
  return path(`/media/posts/${postSlug(post)}/${file.split('/').map(encodeURIComponent).join('/')}${suffix}`);
}
export async function profile(lang: Lang) {
  const entry = await getEntry('profiles', lang);
  if (!entry) throw new Error(`Missing profile: ${lang}`);
  return entry;
}
export async function posts(lang?: Lang) {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .filter(p => !lang || postLang(p) === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}
// A post belongs to a paper when one of its links contains that paper's DOI.
export function paperFor(post: CollectionEntry<'posts'>, papers: CollectionEntry<'publications'>[]) {
  return papers.find(paper => paper.data.doi && post.data.links.some(link => link.url.includes(paper.data.doi!)));
}
// Author names shown in bold in publication lists.
export const isSelf = (author: string) => /^(Qing J\.?|Jingbo Qing)$/i.test(author);
export const isExternal = (url: string) => /^(https?:|mailto:)/.test(url);
export function dateLabel(post: CollectionEntry<'posts'>, lang: Lang) {
  const date = post.data.date;
  if (post.data.datePrecision === 'year') return String(date.getUTCFullYear());
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric', month: 'short', ...(post.data.datePrecision === 'day' ? { day: 'numeric' as const } : {}), timeZone: 'UTC',
  }).format(date);
}
export function typeLabel(type: string, lang: Lang) {
  const category = categories.find(c => c.id === type);
  return category ? category[lang] : type;
}
