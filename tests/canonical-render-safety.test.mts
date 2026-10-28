import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const { renderMarkdown } = await import('../src/components/Markdown.tsx');
const { renderFigure } = await import('../src/lib/figure.ts');
for (const [open, close] of [['````markdown','````'], ['~~~text','~~~'], ['   ````text','   ````'], ['`````','']]) {
  const body = '```sim projectile\nspeed: 20\n```\n```assignment\nwriting: hidden\n```\n[[term]] $x^2$ <script>evil()</script>\n';
  let assignments = 0;
  const html = renderMarkdown(`${open}\n${body}${close}`, undefined, () => { assignments++; return undefined; });
  const root = document.createElement('div'); root.innerHTML = html;
  assert.equal(root.querySelectorAll('pre code').length, 1, open);
  assert(root.textContent?.includes('```sim projectile'), open);
  assert(root.textContent?.includes('[[term]] $x^2$'), open);
  assert.equal(assignments, 0);
  assert.equal(root.querySelectorAll('button,script,.katex,[data-sim]').length, 0, html);
}
const active = renderMarkdown('```sim projectile\nspeed: 20\n```');
assert(!active.includes('<pre><code'), 'top-level supported widgets still render');
const start = performance.now();
for (const coordinates of [1e12, 1e308]) {
  const svg = renderFigure({type:'plot', x:[0,1e-100], y:[0,1], grid:false, segments:[{from:[-coordinates,0],to:[coordinates,1],label:'Bounded'}]} as any);
  assert(svg.includes('<svg'));
}
assert(performance.now()-start < 2000, 'off-screen figure label sampling bounded');
console.log('canonical renderer: nested literal fences inert, active widgets retained, extreme figure sampling bounded');
const nestedCode = renderMarkdown('```code javascript\nconst literal = "```sim projectile";\nconsole.log(literal);\n```');
const codeRoot=document.createElement('div');codeRoot.innerHTML=nestedCode;
assert.equal(codeRoot.querySelectorAll('.code-block').length,1);
assert(codeRoot.querySelector('code')?.textContent?.includes('```sim projectile'));
assert(!renderMarkdown('prefix ```plot\n{"functions":["x"]}\n```').includes('<svg'));
