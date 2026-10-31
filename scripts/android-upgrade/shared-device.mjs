// Real App/WebView lifecycle on the same disposable emulator as the upgrade test.
// No second install, data clearing, production permissions, or authentication hook.
import assert from 'node:assert/strict';
export async function verifySharedDevice({ page: initialPage, adb, pkg, sleep, screenshot, passed, restart }) {
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

  // Actual Android HOME/foreground, not synthetic visibility events or changed clocks.
  adb('shell','input','keyevent','KEYCODE_HOME');
  await sleep(32000);
  adb('shell','monkey','-p',pkg,'-c','android.intent.category.LAUNCHER','1');
  await heading('Shared device locked').waitFor({timeout:45000});
  assert.equal(await heading('Student dashboard and notebook').isVisible(),false);
  screenshot('10-shared-device-background-locked');
  await button('Unlock device').click(); await authenticate();
  await heading('Student dashboard and notebook').waitFor();
  passed('Native HOME background beyond grace period remains locked on foreground until fresh adult authentication');

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
