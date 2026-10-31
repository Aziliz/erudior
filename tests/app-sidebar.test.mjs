import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync('src/components/AppSidebar.tsx', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');
const css = readFileSync('src/app-sidebar.css', 'utf8');
test('native brand opens navigation and preserves the public website brand link', () => {
  assert.match(app, /import AppSidebar from/);
  assert.match(app, /<AppSidebar key=\{sessionEpoch\}/);
  assert.match(app, /blocked=\{localLocked \|\| !!gate \|\| concealed\}/);
  assert.match(app, /aria-label="Erudior home page"/);
  assert.doesNotMatch(app, /aria-label="Erudior: library"/);
});
test('sidebar is navigation, never a new source of account authority', () => {
  assert.match(source, /api\.go\(target\)/);
  assert.doesNotMatch(source, /unlockLocal|chooseStudent\(|setFamily\(|localStorage|fetch\(/);
  assert.match(source, /Online sign-in, account recovery and multi-device cloud sync are not available yet/);
  for (const tab of ['students','settings','learner-privacy']) assert.ok(source.includes(`tab: "${tab}"`));
  assert.match(source, /managementLabel && destination/);
  assert.match(source, /showCommunity && destination/);
});
test('modal lifecycle, dismissal and device concealment remain explicit', () => {
  assert.match(source, /modal\.showModal\(\)/);
  assert.match(source, /onCancel=/);
  assert.match(source, /!blocked && <dialog/);
  assert.match(source, /onPointerDown=/);
  assert.match(source, /onPointerUp=/);
  assert.match(source, /aria-expanded=\{open && !blocked\}/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /100dvh/);
});
