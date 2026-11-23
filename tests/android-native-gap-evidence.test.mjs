import test from 'node:test';
import assert from 'node:assert/strict';
import { unknownResumeEvidence } from '../scripts/android-upgrade/shared-device.mjs';

const drop = 'drop-native-pause sequence=6';
const notify = 'notify sequence=7 paused=false backgroundMs=0 webView=true revocation=7';
const ack = 'evaluated sequence=7 result=false';
const visible = 'visible sequence=7';
const trace = (...lines) => lines.join('\n');

test('valid unknown-duration native resume requires ordered matching ACK and reveal', () => {
  assert.deepEqual(unknownResumeEvidence(trace(drop, notify, ack, visible)),
    { sequence: 7, backgroundMs: 0, revocation: 7 });
});
test('partial logs never count as acceptance', () => {
  for (const log of ['', drop, trace(drop,notify), trace(drop,notify,ack),
    trace(notify,ack,visible), trace(drop,notify,'evaluated sequence=8 result=false')]) {
    assert.equal(unknownResumeEvidence(log), null);
  }
});
test('original zero-revocation failure is rejected', () => {
  assert.throws(() => unknownResumeEvidence(trace(drop,notify.replace('revocation=7','revocation=0'),ack,visible)), /fresh revocation/);
});
test('fabricated time and detached WebView cannot pass', () => {
  assert.throws(() => unknownResumeEvidence(trace(drop,notify.replace('backgroundMs=0','backgroundMs=32000'),ack,visible)), /unmeasured/);
  assert.throws(() => unknownResumeEvidence(trace(drop,notify.replace('webView=true','webView=false'),ack,visible)), /attached WebView/);
});
test('stale or extra sequence transitions cannot masquerade as an unpaired resume', () => {
  for (const n of [6,8,9007199254740992]) {
    assert.throws(() => unknownResumeEvidence(trace(drop,notify.replace('sequence=7',`sequence=${n}`),ack,visible)), /advances exactly once/);
  }
});
test('missing ACK, wrong-sequence ACK and early reveal fail closed', () => {
  for (const lines of [[drop,notify,visible], [drop,notify,'evaluated sequence=70 result=false',visible],
    [drop,notify,visible,ack], [drop,ack,notify,visible], [drop,visible,notify,ack]]) {
    assert.throws(() => unknownResumeEvidence(trace(...lines)), /ACK must precede/);
  }
});
test('an earlier successful case cannot supply this case evidence', () => {
  const old = trace('notify sequence=4 paused=false backgroundMs=32179 webView=true revocation=4',
    'evaluated sequence=4 result=false','visible sequence=4');
  assert.equal(unknownResumeEvidence(trace(old,drop,notify,ack)),null);
  assert.deepEqual(unknownResumeEvidence(trace(old,drop,notify,ack,visible)),{sequence:7,backgroundMs:0,revocation:7});
});
test('the third fault must omit the callback, not only the JS evaluation', () => {
  assert.throws(() => unknownResumeEvidence(trace(drop,'notify sequence=7 paused=true backgroundMs=0 webView=true revocation=0',notify,ack,visible)), /must not record a native pause/);
});
test('repeated native callback omission and invalid prior sequences are rejected', () => {
  assert.throws(() => unknownResumeEvidence(trace(drop,drop,notify,ack,visible)), /exactly one/);
  for (const n of [0,9007199254740992]) assert.throws(() => unknownResumeEvidence(`drop-native-pause sequence=${n}`), /pre-pause sequence/);
});
test('unacknowledged and wrong-sequence reveal cannot complete a case', () => {
  assert.equal(unknownResumeEvidence(trace(drop,notify,ack,'visible sequence=70')),null);
  assert.throws(() => unknownResumeEvidence(trace(drop,notify,'evaluated sequence=7 result=true',visible)), /ACK must precede/);
});
