import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test', pretendToBeVisual: true });
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

// Canonical source remains exact; runtime aliases/defaults must still reach the editor/runner.
const React = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const { default: CodeExercise } = await import('../src/components/CodeExercise.tsx');
for (const [alias, language] of [['py', 'python'], ['python3', 'python'], ['js', 'javascript']]) {
  const q: any = { id: 'code', type: 'code', topic: 'Code', stem: 'Run code', choices: [], answer: [], code: { language: alias, tests: [{ stdout: 'ok' }] } };
  const before = structuredClone(q);
  const html = renderToStaticMarkup(React.createElement(CodeExercise, { q, chosen: [], review: true }));
  assert(html.includes(`data-lang="${language}"`), alias);
  assert(!html.includes('undefined'), 'missing starter derives an empty editor value');
  assert.deepEqual(q, before);
}
const { createRoot } = await import('react-dom/client');
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
// No layout frames are needed for this execution-boundary test in JSDOM.
dom.window.requestAnimationFrame = () => 0;
dom.window.cancelAnimationFrame = () => {};
Object.assign(globalThis, { MutationObserver: dom.window.MutationObserver });
const previousWorker = globalThis.Worker;
const workers: string[] = [], requests: any[] = [];
class FakeWorker extends EventTarget {
  constructor(url: URL) { super(); workers.push(url.pathname); }
  postMessage(message: any) { requests.push(message); queueMicrotask(() => this.dispatchEvent(new MessageEvent('message', { data: { i: 0, result: { stdout: 'ok' }, done: true } }))); }
  terminate() {}
}
globalThis.Worker = FakeWorker as any;
const host = document.createElement('div'); document.body.append(host); const root = createRoot(host);
const q: any = { id: 'js-runtime', type: 'code', topic: 'Code', stem: 'Run', choices: [], answer: [], code: { language: 'js', tests: [{ stdout: 'ok' }] } };
const before = structuredClone(q);
try {
  await React.act(async () => { root.render(React.createElement(CodeExercise, { q, chosen: [] })); });
  const run = [...host.querySelectorAll('button')].find(button => button.textContent === 'Run tests'); assert(run);
  await React.act(async () => { run.click(); });
  assert.equal(workers.length, 1); assert(workers[0].endsWith('/code.jsworker.ts'), 'js alias must select JavaScript, not Python');
  assert.equal(requests[0].code, '', 'missing starter defaults only at runtime');
  assert(host.textContent?.includes('All 1 tests passed.'));
  assert.deepEqual(q, before);
} finally { await React.act(async () => root.unmount()); host.remove(); globalThis.Worker = previousWorker; }
console.log('canonical code runtime: language aliases and starter defaults derived without source mutation; JavaScript execution lane verified');
