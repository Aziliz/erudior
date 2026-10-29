import { SaxesParser } from 'saxes';

const ELEMENTS = new Set('svg g defs title desc path rect circle ellipse line polyline polygon text tspan textPath marker clipPath mask linearGradient radialGradient stop pattern use style'.split(' '));
const ATTRS = new Set('id class data-name viewBox width height x y x1 y1 x2 y2 cx cy r rx ry d points fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity transform font-size font-family font-weight font-style text-anchor text-decoration letter-spacing word-spacing dominant-baseline baseline-shift dx dy rotate textLength lengthAdjust paint-order marker-start marker-mid marker-end markerWidth markerHeight markerUnits refX refY orient clip-path clip-rule mask gradientUnits gradientTransform spreadMethod offset stop-color stop-opacity patternUnits patternContentUnits patternTransform preserveAspectRatio role aria-label aria-labelledby aria-describedby focusable style href xlink:href xml:space xmlns xmlns:xlink'.split(' '));
const CSS = new Set('fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity font-size font-family font-weight font-style text-anchor text-decoration letter-spacing word-spacing dominant-baseline baseline-shift paint-order marker-start marker-mid marker-end clip-path stop-color stop-opacity'.split(' '));
const localUrl = /url\(\s*#[A-Za-z_][\w.-]*\s*\)/g;
function safeValue(value: string): boolean {
  const rest = value.replace(localUrl, '');
  return !/[\\<>@{}]|\/\*|\*\/|url\s*\(|(?:javascript|data|https?|file|vbscript)\s*:|expression\s*\(/i.test(rest);
}
function declarations(value: string): boolean {
  return value.split(';').filter(v => v.trim()).every(declaration => {
    const match = /^\s*([a-z-]+)\s*:\s*(.+?)\s*$/.exec(declaration);
    return !!match && CSS.has(match[1]) && safeValue(match[2]);
  });
}
/** Strict static SVG, parsed as XML, never rendered or normalized. Original bytes survive. */
export function validateStaticSvg(source: string, options: { allowFragmentNamespace?: boolean } = {}): string[] {
  const errors: string[] = [];
  const fail = (message: string) => { if (errors.length < 12 && !errors.includes(message)) errors.push(message); };
  if (source.length > 2 * 1024 * 1024) return ['SVG exceeds the asset limit'];
  let depth = 0, nodes = 0, root = false, inStyle = false, css = '';
  const parser = new SaxesParser({ xmlns: true });
  parser.on('error', () => fail('Malformed SVG XML'));
  parser.on('doctype', () => fail('SVG document types/entities are not permitted'));
  parser.on('processinginstruction', () => fail('SVG processing instructions are not permitted'));
  parser.on('opentag', tag => {
    if (inStyle) fail('SVG style may contain only CSS text');
    depth++; nodes++;
    if (depth > 64 || nodes > 20000) throw Error('SVG structural limit exceeded');
    if (!root) { root = true; if (tag.name !== 'svg') fail('SVG root required'); }
    if (tag.prefix || (tag.uri !== 'http://www.w3.org/2000/svg' && !(options.allowFragmentNamespace && !tag.uri)) || !ELEMENTS.has(tag.local)) fail('Unsupported or active SVG element');
    if (tag.local === 'style') { inStyle = true; css = ''; }
    for (const attribute of Object.values(tag.attributes)) {
      const { name, value } = attribute;
      if (!ATTRS.has(name)) { fail('Unsupported or active SVG attribute'); continue; }
      if (name === 'xmlns' && value === 'http://www.w3.org/2000/svg' || name === 'xmlns:xlink' && value === 'http://www.w3.org/1999/xlink') continue;
      if (name.startsWith('xmlns')) { fail('Unsupported SVG namespace'); continue; }
      if (name === 'href' || name === 'xlink:href') { if (!/^#[A-Za-z_][\w.-]*$/.test(value)) fail('SVG references must be internal'); continue; }
      if (name === 'style') { if (!declarations(value)) fail('Unsupported SVG style'); continue; }
      if (!safeValue(value)) fail('Unsafe SVG attribute value');
    }
  });
  parser.on('text', value => { if (inStyle) css += value; });
  parser.on('cdata', value => { if (inStyle) css += value; });
  parser.on('closetag', tag => {
    if (tag.local === 'style') {
      let rest = css;
      rest = rest.replace(/([A-Za-z_#.][\w.#, >:+-]*)\{([^{}]*)\}/g, (_whole, selector, body) => {
        if (!/^[A-Za-z_#.][\w.#, >:+-]*$/.test(selector) || !declarations(body)) fail('Unsupported SVG stylesheet');
        return '';
      });
      if (rest.trim()) fail('Unsupported SVG stylesheet');
      inStyle = false;
    }
    depth--;
  });
  try { parser.write(source).close(); } catch { fail('Malformed or excessive SVG'); }
  if (!root) fail('SVG root required');
  return errors;
}
export function validateImageAsset(src: string, options: { mode?: 'source' | 'publication'; maxBytes?: number; communityImageOrigin?: string } = {}): string[] {
  // This origin is trusted application configuration, never an authored field.
  // The publication boundary additionally verifies every image ID is owned.
  if (options.communityImageOrigin) {
    try {
      const configured = new URL(options.communityImageOrigin), url = new URL(src);
      if (url.protocol === 'https:' && url.origin === configured.origin && !url.username && !url.password && !url.search && !url.hash && /^\/images\/[A-Za-z0-9_-]+$/.test(url.pathname)) return [];
    } catch { /* Not a verified community asset URL. */ }
  }
  if (options.mode === 'source' && /^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:png|jpe?g|gif|webp|svg)$/i.test(src) && !src.split('/').includes('..')) return [];
  const match = /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,([A-Za-z0-9+/]*={0,2})$/.exec(src);
  if (!match) return ['Unresolved or unsupported image asset'];
  const max = options.maxBytes ?? 2 * 1024 * 1024;
  if (!match[2].length || match[2].length > Math.ceil(max / 3) * 4) return ['Image exceeds the asset limit or is empty'];
  try {
    const bytes = atob(match[2]);
    if (btoa(bytes) !== match[2] || bytes.length > max) return ['Noncanonical or oversized image base64'];
    if (match[1] === 'svg+xml') {
      const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(Uint8Array.from(bytes, c => c.charCodeAt(0)));
      return validateStaticSvg(text);
    }
    return [];
  } catch { return ['Invalid image encoding']; }
}
