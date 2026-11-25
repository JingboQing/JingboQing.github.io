// The same build works at username.github.io/ or username.github.io/repository/.
const repository = process.env.GITHUB_REPOSITORY || '';
const [owner, repo] = repository.split('/');
const userSite = owner && repo?.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const derivedBase = owner && repo && !userSite ? `/${repo}` : '';
const requestedBase = process.env.BASE_PATH ?? derivedBase;
export const basePath = requestedBase === '/' ? '' : `/${requestedBase}`.replace(/\/+/g, '/').replace(/\/$/, '');
export const siteURL = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'http://localhost:4321');
if (!/^https?:\/\//.test(siteURL)) throw new Error('SITE_URL must be an http(s) URL.');
