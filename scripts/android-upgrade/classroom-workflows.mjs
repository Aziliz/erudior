// Actual native state and App controls on the existing isolated upgrade emulator.
// Runs only after unchanged upgrade/SAF/shared-device assertions; no new permission/trust.
import assert from 'node:assert/strict';
export async function verifyClassroomWorkflows({page:initialPage,adb,pkg,screenshot,passed,restart}) {
  let page=initialPage;
  const heading=name=>page.getByRole('heading',{name,exact:true});
  const button=name=>page.getByRole('button',{name,exact:true});
  const phone=name=>page.getByRole('navigation',{name:'Phone navigation',exact:true}).getByRole('button',{name,exact:true});
  const password='Synthetic Android shared device password 2026';
  async function auth(label='Teacher password') {
    await page.getByLabel(label,{exact:true}).fill(password);await button('Open').click();
  }
  await phone('Family').click();await auth('Parent password');
  await page.getByRole('navigation',{name:'Parent sections',exact:true}).waitFor();
  const fixture=await page.evaluate(()=>window.__erudiorUpgradeE2E.prepareSyntheticClassroom());
  const [alice,bob]=fixture.learners;
  async function select(learner) {
    await heading("Who's learning?").waitFor();
    await page.locator('.who-card').filter({hasText:learner.name}).click();
    await heading('Shared device locked').waitFor();await auth();await heading('Library').waitFor();
  }
  async function teacher() {
    await phone('Classroom').click();await auth();
    await page.getByRole('navigation',{name:'Teacher sections',exact:true}).getByRole('button',{name:'Class collaboration',exact:true}).click();
    await heading('Class collaboration').waitFor();
  }
  async function learner() {await phone('Courses').click();await button('Open my classroom').click();await heading('My classroom').waitFor();}
  await page.reload();await select(alice);await teacher();await button('Notices').click();await button('New notice').click();
  const form=page.getByRole('form',{name:'notice editor',exact:true});
  await form.getByLabel('Title',{exact:true}).fill('Synthetic Android class notice');
  await form.getByLabel('Instructions',{exact:true}).fill('Read this local notice and acknowledge it.');
  await form.getByLabel(alice.name,{exact:true}).uncheck();
  await form.getByLabel(bob.name,{exact:true}).check();
  await form.getByRole('button',{name:'Save draft',exact:true}).click();
  const notice=()=>page.getByRole('region',{name:'Synthetic Android class notice',exact:true});
  await notice().getByRole('button',{name:'Publish',exact:true}).click();
  screenshot('13-classroom-native-published-notice');
  await button(`Student: ${alice.name}. Switch student`).click();await select(bob);await learner();await button('Notices').click();
  await notice().getByRole('button',{name:'Acknowledge',exact:true}).click();
  screenshot('14-classroom-native-acknowledgment');
  await notice().getByText('✓ Acknowledged on this device',{exact:true}).waitFor();
  await teacher();await button('Notices').click();
  await notice().getByRole('button',{name:'Review response',exact:true}).click();
  await notice().getByLabel('Review note',{exact:true}).fill('Synthetic native acknowledgment reviewed.');
  await notice().getByRole('button',{name:'Release review',exact:true}).click();
  await notice().getByText('Synthetic native acknowledgment reviewed.',{exact:true}).waitFor();
  const state=await page.evaluate(()=>window.__erudiorUpgradeE2E.classroomSnapshot());
  assert.equal(state.items.filter(i=>i.title==='Synthetic Android class notice'&&i.published).length,1);
  assert.equal(state.responses.filter(r=>r.studentId===bob.id&&r.kind==='acknowledgment').length,1);
  assert.equal(state.reviews.filter(r=>r.released).length,1);
  adb('shell','am','force-stop',pkg);page=await restart();await select(bob);await learner();await button('Notices').click();
  await notice().waitFor();
  await notice().getByText('Synthetic native acknowledgment reviewed.',{exact:true}).waitFor();
  const retained=await page.evaluate(()=>window.__erudiorUpgradeE2E.classroomSnapshot());
  assert.deepEqual(retained,state,'native classroom state survives process termination');
  screenshot('15-classroom-native-restarted-acknowledgment');
  passed('Actual native classroom notice publication and scoped learner acknowledgment persist through process restart and fresh adult authorization');
}
