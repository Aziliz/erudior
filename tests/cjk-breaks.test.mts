// Soft line breaks inside Japanese/Chinese paragraphs join without a space.
// Run: npx tsx tests/cjk-breaks.test.mts
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://example.test', pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const { renderMarkdown, joinCjkBreaks } = await import('../src/components/Markdown.tsx');

const text = (html: string) => { const d = dom.window.document.createElement('div'); d.innerHTML = html; return d.textContent ?? ''; };
assert.equal(text(renderMarkdown('今日は\nいい天気です。')), '今日はいい天気です。\n');
const ruby = renderMarkdown('{今日|きょう}は\n{天気|てんき}です。\n[はし:2]です。');
assert.ok(!/\n/.test(ruby.replace(/\n$/, '')), ruby);
// English keeps its space; mixed boundaries keep the break.
assert.equal(text(renderMarkdown('one line\nnext line')), 'one line\nnext line\n');
assert.equal(text(renderMarkdown('日本語\nEnglish')), '日本語\nEnglish\n');
assert.equal(joinCjkBreaks('<p>です。\n「はい」</p>'), '<p>です。「はい」</p>');
// Code blocks are untouched.
assert.ok(renderMarkdown('```\n日本\n語\n```').includes('日本\n語'));
console.log('CJK soft breaks: joined inside Japanese, kept elsewhere — passed');
