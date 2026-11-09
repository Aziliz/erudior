// Synthetic-only fixture. This function runs in the actual App's browser realm.
// It uses production storage/model APIs; it never changes session authorization.
export async function seedFamilyRecovery({ password }) {
  const store = await import('/src/lib/storage.ts');
  const { createFamily } = await import('/src/lib/family.ts');
  const { emptyCourse } = await import('/src/lib/course.ts');
  const records = await import('/src/lib/records.ts');
  const { putFile } = await import('/src/lib/documents.ts');
  const { emptyHomeschoolPlanning } = await import('/src/lib/homeschoolPlanning.ts');
  const { family } = await createFamily({
    mode: 'homeschool', state: '', route: 'Synthetic local recovery acceptance',
    year: { start: '2026-08-01', end: '2027-07-31' }, dailyMinutes: 180, password,
    students: [{ name: 'Synthetic Recovery Alice', grade: 10 }, { name: 'Synthetic Recovery Bob', grade: 9 }],
  });
  const course = {
    ...emptyCourse('AAA Synthetic recovered science'), id: 'synthetic-family-recovery',
    modules: [{ id: 'synthetic-unit', title: 'Synthetic unit' }],
    lessons: [{ id: 'synthetic-lesson', module: 'synthetic-unit', title: 'Synthetic recovery lesson', body: 'Synthetic lesson retained by encrypted recovery.' }],
  };
  await store.saveCourse(course);
  for (const student of family.students) await store.updateProfileProgress(student.id, () => ({
    ...store.emptyProgress(), catalogV1: true, enrolled: [],
    lessonsDone: { [course.id + '/synthetic-lesson']: '2026-11-01' },
  }));
  const fileId = 'synthetic-recovery-present';
  const attachmentText = 'Synthetic attachment bytes recovered from the real encrypted download.';
  await putFile(fileId, { mime: 'text/plain', data: btoa(attachmentText) });
  await records.saveRecords(family.students[0].id, {
    ...records.emptyRecords(),
    manual: [{ id: 'synthetic-original', date: '2026-11-01', minutes: 25, subject: 'Science', note: 'Synthetic original backup record' }],
    documents: [
      { id: 'synthetic-ref-present', fileId, name: 'Synthetic present portfolio.txt', mime: 'text/plain', bytes: attachmentText.length, kind: 'Other', date: '2026-11-01', note: 'Synthetic fixture' },
      { id: 'synthetic-ref-missing', fileId: 'synthetic-recovery-missing', name: 'Synthetic missing portfolio.txt', mime: 'text/plain', bytes: 42, kind: 'Other', date: '2026-11-01', note: 'Deliberately absent fixture bytes' },
    ],
    planning: { ...emptyHomeschoolPlanning(), placements: [{ id: 'synthetic-placement', subject: 'Science', level: 'Synthetic planning level', rationale: 'Synthetic parent planning note, not earned credit.' }] },
  });
  return { alice: family.students[0].id, bob: family.students[1].id, courseId: course.id, fileId, attachmentText };
}

// Corrupt actual ciphertext, not a mocked decryption result or malformed JSON.
export function corruptEncryptedBackup(text) {
  const envelope = JSON.parse(text);
  const bytes = Buffer.from(envelope.data, 'base64');
  if (bytes.length < 17) throw Error('Expected an authenticated encrypted fixture.');
  bytes[Math.floor(bytes.length / 2)] ^= 1;
  return JSON.stringify({ ...envelope, data: bytes.toString('base64') });
}

// An independent Node WebCrypto check of the bytes the UI downloaded. The UI
// acceptance still verifies and restores using the production browser service.
export async function decryptDownloadedBackup(text, passphrase) {
  const envelope = JSON.parse(text);
  if (envelope.format !== 'examiner-backup-encrypted' || envelope.version !== 1) throw Error('Expected real encrypted Family export.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: Buffer.from(envelope.kdf.salt, 'base64'), iterations: envelope.kdf.iterations }, material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(envelope.iv, 'base64') }, key, Buffer.from(envelope.data, 'base64'));
  return JSON.parse(new TextDecoder().decode(plaintext));
}
