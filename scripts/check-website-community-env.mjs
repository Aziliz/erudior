import { pathToFileURL } from 'node:url';

/** Deployment configuration is public, but must never point credentials or reads at a relative page. */
export function validateWebsiteCommunityOrigin(value) {
  const input = typeof value === 'string' ? value.trim() : '';
  let url;
  try { url = new URL(input); } catch { throw Error('Website build requires VITE_COMMUNITY_API to be an absolute HTTPS API origin.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || !url.hostname.includes('.') || url.hostname === 'localhost') {
    throw Error('Website build requires VITE_COMMUNITY_API to be an HTTPS origin without credentials, path, query or fragment.');
  }
  return url.origin;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateWebsiteCommunityOrigin(process.env.VITE_COMMUNITY_API);
  console.log('Website community API origin validated before compilation.');
}
