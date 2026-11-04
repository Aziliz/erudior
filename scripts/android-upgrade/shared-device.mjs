// Real App/WebView lifecycle on the same disposable emulator as the upgrade test.
// No second install, data clearing, production permissions, or authentication hook.
import assert from 'node:assert/strict';
export async function verifySharedDevice({ page: initialPage, adb, pkg, sleep, screenshot, passed, restart, lifecycleEvidence }) {
  let page = initialPage;
  const fixture = await page.evaluate(() => window.__erudiorUpgradeE2E.seedSyntheticFamily());
  const [alice, bob] = fixture.learners;
  const heading = name => page.getByRole('heading', {name,exact:true});
  const button = name => page.getByRole('button', {name,exact:true});
  async function authenticate() {
    await page.getByLabel('Parent password', {exact:true}).fill(fixture.password);
    await button('Open').click();
    await heading('Shared device locked').waitFor({state:'hidden'});
  }
  async function select(learner) {
    await heading("Who's learning?").waitFor();
    await page.locator('.who-card').filter({hasText:learner.name}).click();
    await heading('Shared device locked').waitFor();
    assert.equal(await heading('Library').isVisible(),false,'chooser must not disclose learner view before adult auth');
    await authenticate(); await heading('Library').waitFor();
  }
  async function workspace() {
    await page.getByRole('navigation',{name:'Phone navigation',exact:true}).getByRole('button',{name:'Courses',exact:true}).click();
    await button('Open student workspace').click();
    await heading('Student dashboard and notebook').waitFor();
    await button('Notebook').click();
  }
  await page.reload(); await select(alice);
  await workspace(); await button('Add note').click();
  await page.getByLabel('Title',{exact:true}).fill('Synthetic Android unsaved note');
  await page.getByLabel('Notes',{exact:true}).fill('Draft survives native shared-device lock.');
  await button('Lock device').click(); await heading('Shared device locked').waitFor();
  assert.equal(await page.getByLabel('Notes',{exact:true}).isVisible(),false,'locked native UI conceals draft');
  screenshot('07-shared-device-locked-draft');
  await button('Unlock device').click(); await authenticate();
  assert.equal(await page.getByLabel('Title',{exact:true}).inputValue(),'Synthetic Android unsaved note');
  assert.equal(await page.getByLabel('Notes',{exact:true}).inputValue(),'Draft survives native shared-device lock.');
  await button('Save entry').click();
  await page.getByRole('article',{name:'note: Synthetic Android unsaved note',exact:true}).waitFor();
  screenshot('08-shared-device-resumed-draft');
  passed('Native explicit lock conceals and fresh adult authentication restores unsaved learner draft');

  await button(`Student: ${alice.name}. Switch student`).click(); await select(bob);
  await workspace();
  assert.equal(await page.getByRole('article',{name:'note: Synthetic Android unsaved note',exact:true}).count(),0,'sibling never receives Alice notebook');
  screenshot('09-shared-device-sibling-isolation');
  passed('Native sibling selection requires adult authentication and keeps learner notebook isolated');

  // Read-only diagnostics: observe real delivery without changing clocks, native
  // state, grants, focus, or visibility. Only timing and booleans leave the page.
  await page.evaluate(() => {
    const snapshot = (phase, detail) => {
      const state = { phase, at: Date.now(), hidden: document.hidden,
        focused: document.hasFocus(), shellHidden: !!document.querySelector('.shell')?.hidden,
        lockMounted: !!document.querySelector('.local-session-lock') };
      if (detail && typeof detail.paused === 'boolean' && typeof detail.backgroundMs === 'number') {
        state.paused = detail.paused; state.backgroundMs = detail.backgroundMs;
        state.sequence = detail.sequence; state.revocation = detail.revocation;
      }
      console.info('ERUDIOR_LIFECYCLE_E2E ' + JSON.stringify(state));
    };
    window.addEventListener('erudior-native-lifecycle', event => snapshot('native-received', event.detail));
    document.addEventListener('visibilitychange', () => snapshot('visibilitychange'));
    window.addEventListener('blur', () => snapshot('blur'));
    window.addEventListener('focus', () => snapshot('focus'));
    snapshot('before-home');
  });
  const lifecyclePid = adb('shell','pidof',pkg);
  assert.match(lifecyclePid,/^\d+$/,'one version-B application process supplies lifecycle evidence');
  const nativeLifecycleLog = () => adb('logcat','-d',`--pid=${lifecyclePid}`,'-s','ErudiorLifecycleE2E:I','*:S');
  async function waitForNativeReveal(expectDrop) {
    const deadline = Date.now()+45000;
    while (Date.now()<deadline) {
      const log = nativeLifecycleLog();
      const drops = [...log.matchAll(/drop-resume sequence=(\d+)/g)];
      const pauseDrops = [...log.matchAll(/drop-pause sequence=(\d+)/g)];
      assert.ok(pauseDrops.length<=1,'fault injection must drop exactly one pause');
      assert.ok(drops.length<=1, 'fault injection must drop exactly one native evaluation');
      if (!expectDrop) assert.equal(drops.length+pauseDrops.length,0,'first HOME must exercise unchanged normal delivery');
      const resumed = [...log.matchAll(/notify sequence=(\d+) paused=false backgroundMs=(\d+)/g)]
        .filter(match=>Number(match[2])>=30000).at(-1);
      if (resumed && (!expectDrop || drops.length===1 && pauseDrops.length===1 && Number(pauseDrops[0][1])<Number(resumed[1]) && drops[0][1]===resumed[1]) &&
          log.includes(`evaluated sequence=${resumed[1]} result=false`) &&
          log.includes(`visible sequence=${resumed[1]}`)) return resumed[1];
      await sleep(250);
    }
    throw Error('Native resume must be consumed and visually committed before reveal');
  }
  // Actual Android HOME/foreground, not synthetic visibility events or changed clocks.
  adb('shell','input','keyevent','KEYCODE_HOME');
  lifecycleEvidence('after-home', adb('shell','dumpsys','activity','activities'));
  await sleep(32000);
  adb('shell','monkey','-p',pkg,'-c','android.intent.category.LAUNCHER','1');
  lifecycleEvidence('after-foreground', adb('shell','dumpsys','activity','activities'));
  try {
    await heading('Shared device locked').waitFor({timeout:45000});
  } finally {
    // Keep the original assertion/timeout authoritative even when evidence fails.
    try {
      lifecycleEvidence('lock-assertion-state', await page.evaluate(() => ({
        hidden: document.hidden, focused: document.hasFocus(),
        shellHidden: !!document.querySelector('.shell')?.hidden,
        lockMounted: !!document.querySelector('.local-session-lock'),
      })));
    } catch (error) { console.error('Lifecycle snapshot unavailable:', error.message); }
  }
  assert.equal(await heading('Student dashboard and notebook').isVisible(),false);
  await waitForNativeReveal(false);
  screenshot('10-shared-device-background-locked');
  await button('Unlock device').click(); await authenticate();
  await heading('Student dashboard and notebook').waitFor();
  passed('Native HOME background beyond grace period remains locked on foreground until fresh adult authentication');

  // The generated CI plugin drops the pause and first resume evaluation of this second long
  // absence. The production pending-state retry, not this harness, must recover it.
  adb('shell','input','keyevent','KEYCODE_HOME');
  lifecycleEvidence('drop-case-after-home', adb('shell','dumpsys','activity','activities'));
  await sleep(32000);
  adb('shell','monkey','-p',pkg,'-c','android.intent.category.LAUNCHER','1');
  lifecycleEvidence('drop-case-after-foreground', adb('shell','dumpsys','activity','activities'));
  await heading('Shared device locked').waitFor({timeout:45000});
  assert.equal(await heading('Student dashboard and notebook').isVisible(),false);
  // Require same-sequence consumer ACK and the native compositor fence too.
  const droppedSequence = await waitForNativeReveal(true);
  screenshot('10b-shared-device-replayed-resume-locked');
  await button('Unlock device').click(); await authenticate();
  await heading('Student dashboard and notebook').waitFor();
  passed('Dropped native pause and resume evaluations replay the same owed revocation and still require fresh adult authentication', {sequence:droppedSequence});

  adb('shell','am','force-stop',pkg);
  page = await restart();
  await heading("Who's learning?").waitFor();
  assert.equal(await heading('Student dashboard and notebook').count(),0,'process restart carries no learner grant');
  screenshot('11-shared-device-restart-chooser');
  await select(alice); await workspace();
  await page.getByRole('article',{name:'note: Synthetic Android unsaved note',exact:true}).waitFor();
  screenshot('12-shared-device-restart-persisted-note');
  passed('Native process restart requires explicit authorized learner selection and preserves saved notebook');
}
