import type { APIRoute } from 'astro';
import { languages, posts, postURL, path } from '../lib/site';
const escapeXML = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export const GET: APIRoute = async ({ site }) => {
  const routes = ['/', ...languages.flatMap(lang => [`/${lang}/`, `/${lang}/publications/`, `/${lang}/updates/`, `/${lang}/cv/`]), ...(await posts()).map(postURL)];
  const entries = routes.map(route => `<url><loc>${escapeXML(new URL(path(route), site).href)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
