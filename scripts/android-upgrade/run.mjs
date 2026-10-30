// Acceptance is driven through the real App update button and Android approval UI.
// ADB installs ONLY the baseline; it never installs the upgrade or clears app data.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:https';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { _android as android } from 'playwright';

assert.equal(process.env.GITHUB_ACTIONS, 'true');
assert.equal(process.env.ERUDIOR_UPGRADE_E2E, '1');
const pkg = 'com.erudior.app';
const root = path.resolve('.android-upgrade');
const out = path.resolve('artifacts/android-upgrade');
mkdirSync(out, { recursive: true });
const results = { ok: false, steps: [], requests: [], error: null };
function report() { writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2)); }
function passed(name, details = {}) { results.steps.push({ name, ...details }); report(); console.log('PASS:', name); }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const serials = execFileSync('adb', ['devices'], { encoding:'utf8' }).split('\n')
  .map(line => line.match(/^(emulator-\d+)\s+device$/)?.[1]).filter(Boolean);
assert.equal(serials.length, 1, 'Exactly one disposable emulator is required');
const serial = serials[0];
function adb(...args) { return execFileSync('adb', ['-s',serial,...args], { encoding:'utf8',timeout:20000,maxBuffer:16*1024*1024 }).trim(); }
assert.equal(adb('shell','getprop','ro.kernel.qemu'), '1', 'Never run this on a physical phone');
async function until(fn, message, timeout=45000) {
  const end = Date.now()+timeout; let last;
  while (Date.now()<end) { try { const value=await fn(); if(value) return value; } catch(e) {last=e;} await sleep(500); }
  throw new Error(`${message}${last ? ': '+last.message : ''}`);
}
function versionCode() { return Number(adb('shell','dumpsys','package',pkg).match(/versionCode=(\d+)/)?.[1]); }
function foreground() { return adb('shell','dumpsys','activity','activities').split('\n').filter(l=>/mResumedActivity|topResumedActivity/.test(l)).join('\n'); }
function screenshot(name) { writeFileSync(path.join(out,name+'.png'),execFileSync('adb',['-s',serial,'exec-out','screencap','-p'],{timeout:20000,maxBuffer:10*1024*1024})); }
function nodes() {
  adb('shell','uiautomator','dump','/sdcard/erudior-upgrade-window.xml');
  const xml=adb('shell','cat','/sdcard/erudior-upgrade-window.xml');
  writeFileSync(path.join(out,'last-window.xml'),xml);
  return [...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(x=>[x[1],x[2]])));
}
async function tapNative(predicate, label) {
  const node=await until(()=>{
    const found=nodes().filter(n=>n.enabled==='true'&&predicate(n));
    assert.ok(found.length<=1,`Ambiguous native control: ${label}`);
    return found[0];
  },`Native control unavailable: ${label}`,20000);
  const b=node.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
  assert.ok(b,'control bounds');
  adb('shell','input','tap',String(Math.round((+b[1]+ +b[3])/2)),String(Math.round((+b[2]+ +b[4])/2)));
}
let mode='good', device, page, server;
const apk=readFileSync(path.join(root,'b.apk'));
const manifest={schema:1,version:'0.25.2',build:'b'.repeat(40),
  apk:'https://github.com/Aziliz/erudior/releases/download/android-preview/Erudior-Android-arm64.apk',
  sha256:createHash('sha256').update(apk).digest('hex'),bytes:apk.length,notes:'Disposable upgrade acceptance fixture'};
assert.ok(apk.length<41943040,'Fixture must pass the unchanged native size limit');
async function attach() {
  await device?.close().catch(()=>{});
  device=(await android.devices()).find(d=>d.serial()===serial);
  assert.ok(device,'emulator visible to Playwright');
  const view=await device.webView({pkg},{timeout:45000});
  page=await view.page(); page.setDefaultTimeout(20000);
  page.on('console', msg=>{ if(msg.type()==='error') console.error('WEBVIEW:',msg.text()); });
  await page.waitForFunction(()=>Boolean(window.__erudiorUpgradeE2E));
  await page.locator('.shell').waitFor();
  return page;
}
async function launch() {
  adb('shell','monkey','-p',pkg,'-c','android.intent.category.LAUNCHER','1');
  return attach();
}
async function clickUpdate() {
  const button=page.getByRole('button',{name:'Verify and open installer',exact:true});
  await button.waitFor({state:'visible',timeout:45000});
  await until(()=>button.isEnabled(),'Update button remains disabled');
  await button.click();
}
async function snapshot() { return page.evaluate(()=>window.__erudiorUpgradeE2E.snapshot()); }
try {
  server=createServer({key:readFileSync(path.join(root,'tls-key.pem')),cert:readFileSync(path.join(root,'ca.pem'))},(req,res)=>{
    const request={path:req.url,mode}; results.requests.push(request);
    if(req.url==='/android-update.json') {
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(manifest));
    } else if(req.url==='/Erudior-Android-arm64.apk') {
      const body=Buffer.from(apk);if(mode==='corrupt')body[body.length-1]^=1;
      res.writeHead(200,{'Content-Type':'application/vnd.android.package-archive','Content-Length':body.length,'Cache-Control':'no-store'});res.end(body);
    } else {res.writeHead(404);res.end();}
  });
  await new Promise(resolve=>server.listen(38473,'127.0.0.1',resolve));
  adb('reverse','tcp:38473','tcp:38473');
  const existing=execFileSync('adb',['-s',serial,'shell','pm','list','packages',pkg],{encoding:'utf8'});
  assert.ok(!existing.includes('package:'+pkg),'Baseline must begin on an empty disposable emulator');
  // The sole adb install in the test is initial version A. Version B goes through Android UI.
  assert.match(adb('install','--no-streaming',path.join(root,'a.apk')),/Success/);
  assert.equal(versionCode(),250001);
  adb('shell','appops','set',pkg,'REQUEST_INSTALL_PACKAGES','deny');
  await launch();
  assert.equal(await page.evaluate(()=>window.__erudiorUpgradeE2E.version()),'0.25.1');
  const seeded=await page.evaluate(()=>window.__erudiorUpgradeE2E.seed());
  assert.equal(seeded.course?.revision,7);
  assert.equal(seeded.lessonsDone['upgrade-proof-course/lesson'],'2026-10-01');
  assert.equal(seeded.profileLessons['upgrade-proof-course/lesson'],'2026-10-02');
  assert.equal(seeded.theme,'dark');
  adb('shell','am','force-stop',pkg);await launch();
  const before=await snapshot();assert.deepEqual(before,seeded,'Baseline survives a real process restart');
  writeFileSync(path.join(out,'records-before.json'),JSON.stringify(before,null,2));
  passed('Version A stores and reloads valid course, profile progress, study settings and review records');

  mode='corrupt';await clickUpdate();
  await page.getByText(/APK checksum mismatch|Native APK checksum mismatch/).first().waitFor({state:'visible',timeout:45000});
  assert.equal(versionCode(),250001);assert.match(foreground(),/com\.erudior\.app/);
  screenshot('01-corrupt-download-rejected');passed('Actual update action rejects corrupted native download before installer');

  mode='good';await clickUpdate();
  await until(()=>/com\.android\.settings/.test(foreground()),'App did not open its installation permission screen');
  screenshot('02-source-permission');
  await tapNative(n=>n.checkable==='true'&&n.checked==='false','Allow from this source');
  adb('shell','input','keyevent','KEYCODE_BACK');
  await until(()=>/com\.erudior\.app/.test(foreground()),'App did not resume from permission settings');
  passed('App-origin installer handoff requests Android per-app permission');

  await clickUpdate();
  await until(()=>/packageinstaller/i.test(foreground()),'App-origin FileProvider grant did not open Android installer');
  screenshot('03-update-approval');
  const approval=nodes();assert.ok(approval.some(n=>/Erudior/i.test(n.text)),'Installer identifies Erudior');
  await tapNative(n=>/^cancel$/i.test(n.text),'Cancel');
  await until(()=>/com\.erudior\.app/.test(foreground()),'App did not resume after cancellation');
  assert.equal(versionCode(),250001);assert.deepEqual(await snapshot(),before);
  passed('Cancellation leaves version A and saved records unchanged');

  await clickUpdate();
  await until(()=>/packageinstaller/i.test(foreground()),'Installer did not reopen');
  screenshot('04-before-approval');
  await tapNative(n=>/^(update|install)$/i.test(n.text),'Approve update');
  await until(()=>versionCode()===250002,'Android did not replace version A with version B',60000);
  screenshot('05-version-b-installed');
  passed('Android system installer completes distinct versionCode 250001 → 250002 without adb reinstall');
  await launch();
  assert.equal(await page.evaluate(()=>window.__erudiorUpgradeE2E.version()),'0.25.2');
  const after=await snapshot();writeFileSync(path.join(out,'records-after.json'),JSON.stringify(after,null,2));
  assert.deepEqual(after,before,'Version B must reload the exact saved learner records');
  await page.getByText('Upgrade persistence proof',{exact:true}).first().waitFor();
  screenshot('06-retained-course-visible');
  await sleep(2500);
  assert.equal(await page.getByRole('button',{name:'Verify and open installer',exact:true}).count(),0,'Installed build must not offer itself again');
  assert.ok(results.requests.filter(r=>r.path==='/android-update.json').length>0);
  assert.ok(results.requests.filter(r=>r.path==='/Erudior-Android-arm64.apk').length>=4);
  passed('Version B reopens stored course and all saved records; no repeated same-build offer');
  results.ok=true;report();
} catch(error) {
  results.error=error.stack??String(error);report();
  try{screenshot('failure');writeFileSync(path.join(out,'foreground.txt'),foreground());}catch{}
  throw error;
} finally {
  try {writeFileSync(path.join(out,'logcat.txt'),adb('logcat','-d','-t','1500'));}catch{}
  await device?.close().catch(()=>{});
  if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
  try{adb('reverse','--remove','tcp:38473');}catch{}
}
