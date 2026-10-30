import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import { generate, checkAll, checkAnswer } from '../src/lib/drills.ts';
import { splitMath } from '../src/lib/math.ts';
import type { Drill } from '../src/lib/exerciseTypes.ts';

function renderMath(text: string) {
  const parts = splitMath(text).filter(part => part.math);
  assert(parts.length > 0);
  for (const part of parts) katex.renderToString(part.text, { throwOnError: true });
}

// Singleton domains deterministically exercise fill through the real generator,
// not a duplicate implementation or a lucky random sample.
for (const exponent of [0, 1, -1, -2, 2]) {
  const drill: Drill = {
    id: 'tex-token-boundary', title: 'TeX token boundaries',
    vars: { power: { choices: [exponent] } }, answer: 'power', format: 'number',
    prompt: String.raw`$\lambda^{{power}}e^{-5\lambda} + \alpha^{{power:int}}x + x^{{power}}y$`,
    solution: String.raw`$\lambda^{{power}}\beta + \lambda^{{power}}2 + \lambda^{{power}} e + {\lambda}^{{power}}e + \sqrt[{power}]{x}$`,
  };
  const instance = generate(drill);
  assert(checkAnswer(instance, exponent));
  assert(!checkAnswer(instance, exponent + 3));
  if (exponent === 1) {
    assert.equal(instance.prompt, String.raw`$\lambda{}e^{-5\lambda} + \alpha{}x + xy$`);
    assert.equal(instance.solution, String.raw`$\lambda\beta + \lambda2 + \lambda e + {\lambda}e + \sqrt[1]{x}$`);
  } else {
    assert(instance.prompt.includes(String.raw`\lambda^{${exponent}}e`));
    assert(instance.prompt.includes(String.raw`\alpha^{${exponent}}x`));
  }
  renderMath(instance.prompt);
  renderMath(instance.solution);
}

// Reproduce the actual CI failure without changing bundled course content.
const course = JSON.parse(readFileSync('samples/math/math-probstats.json', 'utf8'));
const original = course.drills.find((drill: Drill) => drill.id === 'ps-d-gamma-poisson') as Drill;
assert(original);
const before = JSON.stringify(original);
for (const count of [0, 1, 2]) {
  const fixed: Drill = { ...original, vars: Object.fromEntries(Object.keys(original.vars).map(name => [name, { choices: [name === 'al' || name === 'be' ? 1 : name === 'c1' ? count : 0] }])) };
  const instance = generate(fixed);
  assert.equal(instance.values.tot, count);
  assert(checkAll(instance, ['' + instance.values.a2, '' + instance.values.b2, '' + instance.values.pm]).every(result => result.ok));
  if (count === 1) assert(instance.solution.includes(String.raw`\lambda{}e^{-5\lambda}`));
  renderMath(instance.prompt);
  renderMath(instance.solution);
}
assert.equal(JSON.stringify(original), before);
console.log('Drill TeX boundaries: deterministic exponent 0/1/negative, command adjacency, generation/grading/rendering and Gamma–Poisson fixture passed');
