import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
const { createElement, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { AudioResourceEditor, EmbeddedAudioInput, playableEmbeddedAudio } = await import('../src/components/AudioResourceEditor.tsx');
assert.equal(playableEmbeddedAudio('https://example.test/clip.mp3'), undefined);
assert.equal(playableEmbeddedAudio('audio/local.wav'), undefined);
assert.equal(playableEmbeddedAudio('data:text/html;base64,AA=='), undefined);
assert.equal(playableEmbeddedAudio('data:audio/wav;base64,AB=='), undefined);
const clip = 'data:audio/wav;base64,AA==', replacement = 'data:audio/wav;base64,AQ==';
assert.equal(playableEmbeddedAudio(clip), clip);
const root = createRoot(document.getElementById('root')!);
let audio: Record<string, string> = { first: clip, second: 'say:second' };
let changes = 0; const pending: boolean[] = [];
const render = () => root.render(createElement(AudioResourceEditor, { audio, onPendingChange: v => pending.push(v), onChange: next => { audio = next ?? {}; changes++; render(); } }));
const button = (name: string) => { const node = [...document.querySelectorAll('button')].find(n => n.textContent === name); assert.ok(node, name); return node; };
const field = (name: string) => { const label = [...document.querySelectorAll('label')].find(n => [...n.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent).join('') === name); assert.ok(label, name); return label.querySelector('input,textarea,select') as HTMLInputElement; };
async function click(name: string) { await act(async () => button(name).click()); }
async function fill(name: string, value: string) { const node = field(name); const proto = node.tagName === 'SELECT' ? dom.window.HTMLSelectElement.prototype : node.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype; await act(async () => { Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(node, value); node.dispatchEvent(new dom.window.Event(node.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); }); }
await act(async () => render());
assert.equal(changes, 0); assert.equal(document.querySelector('audio'), null, 'no media element before explicit preview');
await click('Preview Library recording');
const player = document.querySelector('audio')!; assert.equal(player.getAttribute('src'), clip); assert.equal(player.preload, 'none'); assert.equal(player.autoplay, false); assert.equal(player.controls, true);
await click('Close Library recording preview'); assert.equal(document.querySelector('audio'), null);
await click('Remove audio entry'); await click('Keep audio entry'); assert.equal(audio.first, clip);
await click('Remove audio entry'); audio = { ...audio, first: replacement }; await act(async () => render()); await click('Confirm audio entry removal'); assert.equal(audio.first, replacement, 'stale confirmation never removes changed entry'); assert.match(document.body.textContent!, /entry changed/);
await fill('Audio entry', 'second'); audio = { second: audio.second, first: audio.first }; await act(async () => render()); assert.equal(field('Clip key').value, 'second', 'reordering keeps selected identity');
await fill('Clip key', 'Ｆｉｒｓｔ'); assert.equal(field('Clip key').value, 'second', 'normalized collision cannot rename');
let reader: DeferredReader;
class DeferredReader { result = clip; onload = () => {}; onerror = () => {}; readAsDataURL() { reader = this; } }
Object.assign(globalThis, { FileReader: DeferredReader });
async function upload() { const input = document.querySelector('input[type=file]')!; Object.defineProperty(input, 'files', { value: [new dom.window.File(['a'], 'sample.wav', { type: 'audio/wav' })], configurable: true }); await act(async () => input.dispatchEvent(new dom.window.Event('change', { bubbles: true }))); }
await upload(); assert.equal(pending.at(-1), true); assert.equal(button('Remove audio entry').disabled, true); assert.equal(field('Audio entry').disabled, true); assert.equal(field('Clip key').disabled, true);
// External replacement of a speech-only entry still invalidates its older recording read.
audio = { ...audio, second: 'say:newer text' }; await act(async () => render()); assert.equal(pending.at(-1), false); await act(async () => reader.onload()); assert.equal(audio.second, 'say:newer text');
await upload(); await click('Cancel audio upload'); await act(async () => reader.onload()); assert.equal(audio.second, 'say:newer text');
await upload(); await act(async () => reader.onload()); assert.equal(audio.second, clip); assert.equal(pending.at(-1), false);
await click('Remove Library recording'); await click('Keep Library recording'); assert.equal(audio.second, clip);
await click('Remove Library recording'); await click('Confirm removal of Library recording'); assert.equal(Object.hasOwn(audio, 'second'), false);
await click('Remove audio entry'); await click('Confirm audio entry removal'); assert.deepEqual(audio, {});
// Invalid/unresolved sources never become media URLs even when supplied externally.
await act(async () => root.render(createElement(EmbeddedAudioInput, { label: 'Unsafe', value: 'https://example.test/private.mp3', onChange: () => {} })));
assert.equal(document.querySelector('audio'), null); assert.equal([...document.querySelectorAll('button')].some(n => n.textContent?.startsWith('Preview')), false);
await act(async () => root.unmount()); dom.window.close();
console.log('audio resource workflow: explicit embedded preview, identity selection, guarded removal, late reads and external changes passed');
