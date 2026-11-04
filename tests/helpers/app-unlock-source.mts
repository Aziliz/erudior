import assert from 'node:assert/strict';
/** Retain explicit credential-capture auditing across all extracted App adapters. */
export function assertExplicitCredentialCaptures(app: string) {
  assert.match(app,/const documentUnlockedCredential = useRef<string \| null>\(null\)/);
  const writes=[...app.matchAll(/documentUnlockedCredential\.current\s*=\s*([^;]+);/g)].map(match=>match[1]);
  assert.equal(writes.length,4,'Only three explicit unlock paths and one lock revocation may write credentials');
  assert.equal(writes.filter(value=>value==='null').length,1);
  assert.equal(writes.filter(value=>value==='JSON.stringify(f.parent.password)').length,3);
  const finish=app.slice(app.indexOf('  const finishGate ='),app.indexOf('  useEffect(()=>{ if(localLocked'));
  assert.match(finish,/const fresh = await loadFamily\(\)/);
  assert.match(finish,/JSON\.stringify\(fresh\.parent\) !== JSON\.stringify\(f\.parent\)/);
  assert.match(finish,/requested !== gateRef\.current/);
  assert.match(finish,/bindLocalSessionCredential\(f\.parent\)/);
  assert.match(finish,/documentUnlockedCredential\.current = JSON\.stringify\(f\.parent\.password\)/);
  assert.match(app,/<ParentGate[^\n]+onUnlock=\{f => \{ unlockLocalAdult\(\)/);
  assert.match(app,/if \(isClassroom\(f\)\) \{[\s\S]{0,350}documentUnlockedCredential\.current = JSON\.stringify\(f\.parent\.password\)/);
}
