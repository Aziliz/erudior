import { readFileSync } from 'node:fs';

/** Public display/redirect data only. Never pass provider secrets or claims here. */
export interface PrivateAccountBrowserUiConfig {
  providers: readonly { id: string; label: string; authorizationEndpoint: string }[];
}
export const PRIVATE_ACCOUNT_UI_CONFIG_PATH = '/v1/ui/config';
const ASSETS = new Map([
  ['/v1/ui/settings.js', ['settings.js', 'text/javascript; charset=utf-8']],
  ['/v1/ui/settings.css', ['settings.css', 'text/css; charset=utf-8']],
]);
export const PRIVATE_ACCOUNT_UI_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'";

export function createPrivateAccountBrowserUi(config: PrivateAccountBrowserUiConfig, providerIds: readonly string[], returnPath: string, devicesEnabled: boolean, exportsEnabled = false) {
  if (returnPath === '/health' || returnPath.startsWith('/health/') || returnPath === '/v1' || returnPath.startsWith('/v1/') || /\/\//.test(returnPath)) throw new Error('Reserved private browser return path');
  if (!Array.isArray(config.providers) || config.providers.length !== providerIds.length) throw new Error('Invalid private browser providers');
  const seen = new Set<string>();
  const providers = config.providers.map(provider => {
    if (!provider || !providerIds.includes(provider.id) || seen.has(provider.id) || typeof provider.label !== 'string' || !provider.label.trim() || provider.label.length > 80 || /[\u0000-\u001f\u007f]/.test(provider.label)) throw new Error('Invalid private browser provider');
    seen.add(provider.id);
    const endpoint = new URL(provider.authorizationEndpoint);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash || endpoint.search || endpoint.href !== provider.authorizationEndpoint) throw new Error('Invalid private browser authorization endpoint');
    return { id: provider.id, label: provider.label.trim(), authorizationEndpoint: endpoint.href };
  });
  const publicConfig = JSON.stringify({ providers, devicesEnabled, exportsEnabled });
  return {
    config: (): string => publicConfig,
    matches: (path: string): boolean => path === returnPath || ASSETS.has(path),
    content: (path: string): { body: string; type: string } => {
      if (path === returnPath) return { type: 'text/html; charset=utf-8', body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Private account settings · Erudior</title><link rel="stylesheet" href="/v1/ui/settings.css"></head><body><main id="account-app"></main><noscript>JavaScript is required for private account settings.</noscript><script type="module" src="/v1/ui/settings.js"></script></body></html>' };
      const asset = ASSETS.get(path);
      if (!asset) throw new Error('Unknown private browser asset');
      // Filename comes exclusively from the fixed map, never from a request path.
      return { body: readFileSync(new URL(`../browser/${asset[0]}`, import.meta.url), 'utf8'), type: asset[1] };
    },
  };
}
