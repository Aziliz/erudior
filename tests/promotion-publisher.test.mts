import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { newKeyPair, signBytes, sha256Hex, verifySignature, b64 } from '../src/lib/courseSign.ts';
import { emptyCourse, exportCourseSnapshot } from '../src/lib/course.ts';
import { importValidatedCourseSnapshot } from '../src/lib/courseIntegrity.ts';
import { verifyPromotionHandoff, type PromotionHandoff } from '../src/lib/promotionReview.ts';
import { promotionFixture, promotionOrigin } from './helpers/promotion-fixture.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'erudior-promotion-publisher-'));
const originalPins = fs.readFileSync(path.join(root, 'src/lib/courseKeys.ts'));
let checks = 0;
try {
  fs.mkdirSync(path.join(temp, 'src/lib'), { recursive: true });
  fs.cpSync(path.join(root, 'src/lib'), path.join(temp, 'src/lib'), { recursive: true });
  fs.mkdirSync(path.join(temp, 'scripts')); fs.mkdirSync(path.join(temp, 'samples')); fs.mkdirSync(path.join(temp, 'previous'));
  for (const name of ['verify-promotion-handoff.ts', 'publish-courses.ts']) fs.copyFileSync(path.join(root, 'scripts', name), path.join(temp, 'scripts', name));
  fs.writeFileSync(path.join(temp, 'package.json'), '{"type":"module"}');
  fs.symlinkSync(fs.realpathSync(path.join(root, 'node_modules')), path.join(temp, 'node_modules'), 'dir');
  // Test-only public pin inside the disposable copy. No production pin, secret, environment or release is changed.
  const keys = newKeyPair();
  fs.writeFileSync(path.join(temp, 'src/lib/courseKeys.ts'), `export const COURSE_PUBLIC_KEYS: string[] = ${JSON.stringify([keys.publicKey])};\n`);
  const env = { PATH: process.env.PATH, HOME: temp, NODE_ENV: 'test', COURSE_SIGNING_KEY: keys.secretKey };
  const run = (script: string, argv: string[]) => spawnSync(process.execPath, ['--import', path.join(root, 'node_modules/tsx/dist/loader.mjs'), path.join(temp, 'scripts', script), ...argv], { cwd: temp, env, encoding: 'utf8', timeout: 60000, maxBuffer: 2 * 1024 * 1024 });
  const write = (name: string, value: unknown) => fs.writeFileSync(path.join(temp, name), JSON.stringify(value, null, 2));
  const signedBaseline = (courses: unknown[], signingKeys = keys) => {
    const raw = Buffer.from(JSON.stringify({ format: 'examiner-catalog', version: 1, courses }));
    fs.writeFileSync(path.join(temp, 'previous/catalog.json'), raw);
    fs.writeFileSync(path.join(temp, 'previous/catalog.json.sig'), signBytes(raw, b64.decode(signingKeys.secretKey)));
  };
  const imported = process.env.PROMOTION_TEST_HANDOFF;
  const mediaOrigin = imported ? process.env.PROMOTION_TEST_MEDIA_ORIGIN : promotionOrigin;
  const expectedExternal = process.env.PROMOTION_TEST_HANDOFF_SHA256;
  if (imported) assert(expectedExternal, 'External transport test requires independently captured expected digest.');
  const fixture = await promotionFixture();
  const handoff = imported ? await verifyPromotionHandoff(fs.readFileSync(imported), { communityImageOrigin: mediaOrigin, expectedHandoffSha256: expectedExternal }) : fixture.handoff;
  let activeOrigin = mediaOrigin;
  let activeApproval: string | undefined;
  const configure = (value: PromotionHandoff, origin: string | undefined = promotionOrigin) => {
    activeOrigin = origin; activeApproval = undefined;
    write('handoff.json', value); write('candidate.json', value.candidate.course);
    const independent = {
      format: 'erudior-independent-publisher-review', version: 1, handoffSha256: value.handoffSha256,
      courseId: value.candidate.course.id, revision: value.candidate.course.revision ?? 1,
      publisher: 'synthetic-independent-publisher', reviewedAt: new Date(Math.max(Date.now(), Date.parse(value.review.reviewedAt) + 1000)).toISOString(),
      authorizedPublisher: true, independentlyReviewedContent: true, independentlyReviewedRights: true, verifiedSourceEvidence: true,
      authorizationReference: 'Synthetic ephemeral-key test publisher only; no real publication authority.',
      contentEvidence: 'Synthetic test data independently checked in this test only.',
      rightsEvidence: 'Synthetic fixture statement, not a real license or legal review.',
      sourceEvidence: 'Synthetic exact transport and captured evidence verified by this fixture.',
    };
    write('publisher.json', independent);
    const catalog = [{ id: value.candidate.course.id, revision: value.candidate.course.revision ?? 1, file: 'candidate.json' }];
    // The exported fixture carries vocabulary from another course. Supply that
    // explicit prerequisite inside this disposable test catalog, without editing
    // candidate bytes or weakening the production cross-course reference check.
    const sources = new Map<string, Set<string>>();
    for (const word of value.candidate.course.vocab ?? []) {
      if (!word.from || word.from === value.candidate.course.id) continue;
      const lessons = sources.get(word.from) ?? new Set<string>();
      if (word.lesson) lessons.add(word.lesson);
      sources.set(word.from, lessons);
    }
    for (const [id, lessons] of sources) {
      const file = `prerequisite-${catalog.length}.json`;
      const course = { ...emptyCourse('Synthetic vocabulary prerequisite'), id, revision: 1,
        lessons: [...lessons].map(id => ({ id, module: 'm1', title: 'Synthetic source lesson', body: 'Disposable vocabulary source fixture.' })) };
      write('samples/' + file, course);
      catalog.push({ id, revision: 1, file });
    }
    write('samples/catalog.json', catalog);
    write('samples/candidate.json', value.candidate.course);
    write('samples/states.json', { format: 'examiner-states', version: 'test-only', states: [] });
    return independent;
  };
  const baselineFor = async (value: PromotionHandoff) => {
    const revision = value.candidate.course.revision ?? 1;
    if (revision === 1) { signedBaseline([]); return; }
    // Synthetic predecessor only, inside the disposable test release. The exported rN bytes stay unchanged.
    const raw = Buffer.from(JSON.stringify({ ...value.candidate.course, revision: revision - 1 }, null, 2));
    const prior = { id: value.candidate.course.id, revision: revision - 1, file: `${value.candidate.course.id}.r${revision - 1}.json`, bytes: raw.length, sha256: await sha256Hex(raw) };
    fs.writeFileSync(path.join(temp, 'previous', prior.file), raw); signedBaseline([prior]);
  };
  let independent = configure(handoff, mediaOrigin); await baselineFor(handoff);
  const cliArgs = (value = handoff) => ['--handoff', path.join(temp, 'handoff.json'), '--expected-handoff-sha256', value.handoffSha256, '--course', path.join(temp, 'candidate.json'), '--publisher-review', path.join(temp, 'publisher.json'), '--previous-dir', path.join(temp, 'previous'), ...(activeOrigin ? ['--community-origin', activeOrigin] : []), ...(activeApproval ? ['--spreadsheet-approval', activeApproval] : [])];
  const pass = (argv = cliArgs()) => {
    const result = run('verify-promotion-handoff.ts', argv); assert.equal(result.status, 0, result.stderr + result.stdout);
    const report = JSON.parse(result.stdout); assert.equal(report.status, 'preflight-passed-not-published'); assert.equal(report.verified.signedPreviousCatalog, true);
    assert(report.notEstablished.includes('Legal rights and licensing truth')); assert.equal(fs.existsSync(path.join(temp, '.keys')), false); checks++; return report;
  };
  const blocked = (pattern: RegExp, argv = cliArgs()) => {
    const result = run('verify-promotion-handoff.ts', argv); assert.equal(result.status, 1, result.stderr + result.stdout); assert.match(result.stderr, pattern); checks++;
  };
  if (handoff.candidate.course.spreadsheetAssignments?.length) {
    blocked(/Spreadsheet publication blocked.*approval missing/);
    const sourceCourse = importValidatedCourseSnapshot(JSON.stringify(handoff.candidate.course));
    const sheetApproval = { courseId: sourceCourse.id, revision: sourceCourse.revision ?? 1, snapshotSha256: await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(sourceCourse))), reviewer: 'synthetic-independent-spreadsheet-reviewer', reviewedAt: new Date().toISOString() };
    activeApproval = path.join(temp, 'external-spreadsheet-review.json'); write('external-spreadsheet-review.json', sheetApproval);
    fs.mkdirSync(path.join(temp, 'samples/reviews'), { recursive: true }); write(`samples/reviews/${sourceCourse.id}.json`, sheetApproval);
  }
  const report = pass(); assert.equal(report.handoffSha256, imported ? expectedExternal : fixture.handoff.handoffSha256);
  assert.equal(fs.existsSync(path.join(temp, 'dist-courses')), false, 'Verifier never publishes.');
  const fixtureCatalog = JSON.parse(fs.readFileSync(path.join(temp, 'samples/catalog.json'), 'utf8'));
  if (fixtureCatalog.length > 1) {
    write('samples/catalog.json', [fixtureCatalog[0]]);
    const missingPrerequisite = run('publish-courses.ts', ['--previous-dir', path.join(temp, 'previous')]);
    assert.notEqual(missingPrerequisite.status, 0);
    assert.match(missingPrerequisite.stderr, /Carried vocabulary .* unknown source lesson/); checks++;
    write('samples/catalog.json', fixtureCatalog);
  }
  const published = run('publish-courses.ts', ['--previous-dir', path.join(temp, 'previous')]);
  assert.equal(published.status, 0, published.stderr + published.stdout);
  const publishedCatalogBytes = fs.readFileSync(path.join(temp, 'dist-courses/v1/catalog.json'));
  assert(verifySignature(publishedCatalogBytes, fs.readFileSync(path.join(temp, 'dist-courses/v1/catalog.json.sig'), 'utf8'), [keys.publicKey]));
  const publishedCatalog = JSON.parse(publishedCatalogBytes.toString('utf8')), entry = publishedCatalog.courses[0];
  const publishedBytes = fs.readFileSync(path.join(temp, 'dist-courses/v1', entry.file));
  assert.equal(await sha256Hex(publishedBytes), entry.sha256); assert.deepEqual(publishedBytes, fs.readFileSync(path.join(temp, 'candidate.json')));
  assert.equal(entry.id, handoff.candidate.course.id); assert.equal(entry.revision, handoff.review.intendedOfficial.revision); checks++;
  // The unchanged publisher still rejects unauthenticated previous releases.
  signedBaseline([], newKeyPair());
  blocked(/pinned keys/);
  const deniedPublish = run('publish-courses.ts', ['--previous-dir', path.join(temp, 'previous')]); assert.notEqual(deniedPublish.status, 0); assert.match(deniedPublish.stderr, /signature verification failed/); checks++;
  await baselineFor(handoff);
  blocked(/Unknown/, [...cliArgs(), '--dev', 'true']);
  blocked(/Unknown/, [...cliArgs(), '--handoff', 'again.json']);
  blocked(/expected-handoff-sha256/, cliArgs().filter((_, i) => i !== 2 && i !== 3));
  const wrongExpected = cliArgs(); wrongExpected[3] = '0'.repeat(64); blocked(/retained export digest/, wrongExpected);
  write('publisher.json', { ...independent, independentlyReviewedRights: false }); blocked(/Independent authorized/);
  write('publisher.json', { ...independent, publisher: handoff.review.reviewer }); blocked(/independent reviewer/);
  write('publisher.json', { ...independent, reviewedAt: '2000-01-01T00:00:00.000Z' }); blocked(/predates/);
  write('publisher.json', { ...independent, revision: independent.revision + 1 }); blocked(/intended identity/);
  write('publisher.json', { ...independent, official: true }); blocked(/unknown publisher/);
  write('publisher.json', independent);
  write('candidate.json', { ...handoff.candidate.course, title: 'Substitution' }); blocked(/differs from/);
  write('candidate.json', handoff.candidate.course);
  fs.writeFileSync(path.join(temp, 'handoff.json'), '{"version":1,"version":1}'); blocked(/Duplicate/);
  fs.writeFileSync(path.join(temp, 'handoff.json'), Buffer.from([0xc3, 0x28])); blocked(/encoded|encoding/);
  write('handoff.json', handoff);
  fs.writeFileSync(path.join(temp, 'previous/catalog.json.sig'), 'broken'); blocked(/pinned keys/);
  signedBaseline([{ id: handoff.candidate.course.id, revision: 1, file: '../escape.json', sha256: '0'.repeat(64) }]); blocked(/unsafe previous/);
  signedBaseline([]);
  // Pin an existing identity to these exact course bytes; changing the revision's bytes must fail.
  const courseBytes = fs.readFileSync(path.join(temp, 'candidate.json'));
  const prior = { id: handoff.candidate.course.id, revision: handoff.candidate.course.revision ?? 1, file: `${handoff.candidate.course.id}.r${handoff.candidate.course.revision ?? 1}.json`, bytes: courseBytes.length, sha256: await sha256Hex(courseBytes) };
  fs.writeFileSync(path.join(temp, 'previous', prior.file), courseBytes); signedBaseline([prior]);
  assert.equal(pass().verified.revisionContinuity, 'unchanged-identical');
  fs.appendFileSync(path.join(temp, 'previous', prior.file), ' '); blocked(/artifact digest/);
  const changedPrior = Buffer.from(JSON.stringify({ ...handoff.candidate.course, title: 'Previous title' }));
  fs.writeFileSync(path.join(temp, 'previous', prior.file), changedPrior); signedBaseline([{ ...prior, bytes: changedPrior.length, sha256: await sha256Hex(changedPrior) }]); blocked(/revision collision/);
  // Spreadsheet approval is independent of admin and publisher checklists and binds exact runtime snapshot.
  const sheet = await promotionFixture({ spreadsheet: true }); independent = configure(sheet.handoff); signedBaseline([]);
  const sheetArgs = cliArgs(sheet.handoff); blocked(/Spreadsheet publication blocked.*approval missing/, sheetArgs);
  const runtime = importValidatedCourseSnapshot(JSON.stringify(sheet.candidate.course));
  const approval = { courseId: runtime.id, revision: runtime.revision ?? 1, snapshotSha256: await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(runtime))), reviewer: 'synthetic-spreadsheet-reviewer', reviewedAt: new Date().toISOString() };
  write('spreadsheet-review.json', approval);
  pass([...sheetArgs, '--spreadsheet-approval', path.join(temp, 'spreadsheet-review.json')]);
  write('spreadsheet-review.json', { ...approval, snapshotSha256: '0'.repeat(64) }); blocked(/snapshot digest mismatch/, [...sheetArgs, '--spreadsheet-approval', path.join(temp, 'spreadsheet-review.json')]);
  const sheetPublishDenied = run('publish-courses.ts', ['--previous-dir', path.join(temp, 'previous')]); assert.notEqual(sheetPublishDenied.status, 0); assert.match(sheetPublishDenied.stderr, /Spreadsheet publication blocked/); checks++;
  fs.mkdirSync(path.join(temp, 'samples/reviews'), { recursive: true }); write(`samples/reviews/${runtime.id}.json`, approval);
  const sheetPublish = run('publish-courses.ts', ['--previous-dir', path.join(temp, 'previous')]); assert.equal(sheetPublish.status, 0, sheetPublish.stderr); checks++;
  // An official ID that has never shipped cannot silently adopt an authored revision > 1.
  const revised = await promotionFixture({ revision: 2 }); configure(revised.handoff); signedBaseline([]); blocked(/begin at revision 1/, cliArgs(revised.handoff));
  const firstBytes = Buffer.from(JSON.stringify(fixture.candidate.course, null, 2));
  const first = { id: fixture.candidate.course.id, revision: 1, file: `${fixture.candidate.course.id}.r1.json`, bytes: firstBytes.length, sha256: await sha256Hex(firstBytes) };
  fs.writeFileSync(path.join(temp, 'previous', first.file), firstBytes); signedBaseline([first]); assert.equal(pass(cliArgs(revised.handoff)).verified.revisionContinuity, 'compatible-update');
  assert.deepEqual(fs.readFileSync(path.join(root, 'src/lib/courseKeys.ts')), originalPins);
  console.log(`Promotion publisher: ${checks} checks passed; ${imported ? 'external synthetic' : 'synthetic'} handoff → read-only verifier → unchanged signed release pipeline in disposable ephemeral-key fixture. No production publication or legal authority established.`);
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
