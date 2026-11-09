import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><div id="root"></div><button id="outside">Outside</button>', { url:'https://example.test' });
Object.assign(globalThis, { window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT:true });
Object.defineProperty(globalThis, 'navigator', { configurable:true, value:dom.window.navigator });
const { createElement, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { default:Markdown } = await import('../src/components/Markdown.tsx');
const root = createRoot(document.getElementById('root')!);
let parentEscapes = 0;
await act(async () => root.render(createElement('section', { onKeyDown:(event:any) => { if(event.key==='Escape') parentEscapes++; } },
  createElement(Markdown, { source:'Read [[notice]] and [[missing]].', glossary:[{term:'notice',definition:'A synthetic definition.'}] }),
  createElement(Markdown, { source:'<button class="fn-ref" data-fn="n1">1</button>', html:true, notes:[{id:'n1',n:1,text:'A synthetic footnote.'}] }),
)));
const triggers = [...document.querySelectorAll<HTMLButtonElement>('button.gloss,button.fn-ref')];
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');
const key = async (name:string,shiftKey=false) => {
  const event = new dom.window.KeyboardEvent('keydown',{key:name,shiftKey,bubbles:true,cancelable:true});
  await act(async () => { document.activeElement!.dispatchEvent(event); });return event;
};
for (const [index,trigger] of triggers.entries()) {
  trigger.focus();await act(async () => trigger.click());
  assert.ok(dialog());assert.equal(dialog()!.getAttribute('aria-modal'),'true');
  const close = dialog()!.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!;
  assert.equal(document.activeElement,close,'opening moves focus into the definition');
  assert.match(dialog()!.textContent!,index===0?/A synthetic definition/:index===1?/isn't in the glossary/:/A synthetic footnote/);
  assert.equal((await key('Tab')).defaultPrevented,true);assert.equal(document.activeElement,close);
  assert.equal((await key('Tab',true)).defaultPrevented,true);assert.equal(document.activeElement,close);
  assert.equal((await key('Escape')).defaultPrevented,true);assert.equal(dialog(),null);
  assert.equal(document.activeElement,trigger,'Escape returns focus to the exact originating link');
  assert.equal(parentEscapes,0,'closing a definition must not also dismiss an enclosing screen');
  await act(async () => trigger.click());
  await act(async () => dialog()!.querySelector<HTMLButtonElement>('button')!.click());
  assert.equal(dialog(),null);assert.equal(document.activeElement,trigger,'Close returns focus');
  await act(async () => trigger.click());
  await act(async () => document.querySelector<HTMLElement>('.pop-scrim')!.click());
  assert.equal(dialog(),null);assert.equal(document.activeElement,trigger,'outside dismissal returns focus');
}
// Unmounting with an open definition must not steal focus from the replacement screen.
await act(async () => triggers[0].click());
await act(async () => root.unmount());
assert.equal(document.querySelector('[role="dialog"]'),null);
dom.window.close();
console.log('Markdown glossary/footnote keyboard entry, Tab containment, Escape, dismissal and origin focus passed');
