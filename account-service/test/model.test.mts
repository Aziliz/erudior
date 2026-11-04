import assert from 'node:assert/strict';
import { isAccountId, isAccountTimestamp, validateAccountRequest, validateAccountSnapshot, type AccountSnapshot } from '../src/model.ts';
import { accountFixture, accountFixtureIds as i, accountRequest } from './fixtures.mts';

const original = accountFixture();
const parsed = validateAccountSnapshot(original);
assert.equal(parsed.ok, true, 'Complete synthetic server graph is structurally valid');
if (!parsed.ok) throw Error('Fixture invalid');
original.accounts[0].status = 'erased';
assert.equal(parsed.value.accounts[0].status, 'active', 'Validator returns an independent snapshot');

const malformed: [string, (s: AccountSnapshot) => unknown][] = [
  ['extra self-asserted authority', s => ({ ...s, verifiedGuardian: true })],
  ['unknown format version', s => ({ ...s, version: 2 })],
  ['non-finite revision', s => ({ ...s, revision: Infinity })],
  ['duplicate IDs', s => { s.accounts.push({ ...s.accounts[0] }); return s; }],
  ['foreign identity account', s => { s.identities[0].accountId = 'missing-account-0001'; return s; }],
  ['same provider identity linked twice', s => { s.identities[2].issuer = s.identities[0].issuer; s.identities[2].subject = s.identities[0].subject; return s; }],
  ['school identity labeled personal', s => { s.identities[1].trust = 'personal'; return s; }],
  ['credential material in graph', s => { (s.identities[0] as unknown as Record<string, unknown>).password = 'not-a-contract-field'; return s; }],
  ['guardian authority from another learner', s => { s.authorities.find(a => a.id === i.guardianAuthority)!.learnerId = i.otherChild; return s; }],
  ['privacy grant is collection authority', s => { s.guardians[0].privacyAuthorityId = i.guardianAuthority; return s; }],
  ['school learning owned by teacher account', s => { s.authorities.find(a => a.id === i.enrollmentAuthority)!.accountId = i.adult; return s; }],
  ['class in another institution', s => { s.enrollments[0].classId = i.foreignClassroom; return s; }],
  ['school link points at another learner', s => { s.familySchoolLinks[0].enrollmentId = i.otherEnrollment; return s; }],
  ['school record bound to family receipt', s => { s.records.find(r => r.id === i.grade)!.authorityId = i.guardianAuthority; return s; }],
  ['implicit administrator power on teacher role', s => { s.schoolMemberships[0].administrativeActions = ['school.manage']; return s; }],
  ['wildcard action', s => { (s.guardians[0].actions as string[]).push('*'); return s; }],
  ['school session includes Family context', s => { s.sessions.find(x => x.id === i.schoolSession)!.contexts.push({ workspaceId: i.family, workspaceVersion: 1, schoolPolicyVersion: null }); return s; }],
  ['restricted principal elevated to account', s => { s.sessions.find(x => x.id === i.childSession)!.principal = { kind: 'account', id: i.adult, version: 1 }; return s; }],
  ['active context not in session grants', s => { s.sessions.find(x => x.id === i.schoolSession)!.activeWorkspaceId = i.family; return s; }],
  ['duplicate context grants', s => { s.sessions[0].contexts.push({ ...s.sessions[0].contexts[0] }); return s; }],
  ['adult default guardian control', s => { s.learners[0].guardianAccess = 'guardian-managed'; return s; }],
  ['missing rights revision', s => { (s.authorities[0] as unknown as Record<string, unknown>).learnerVersion = null; return s; }],
];
for (const [label, change] of malformed) assert.equal(validateAccountSnapshot(change(accountFixture())).ok, false, label);

assert.equal(isAccountId('alice@example.com'), false);
assert.equal(isAccountId('Alice'), false);
assert.equal(isAccountId('8a13b00d-f281-4285-98d7-7e986aa1d1c4'), true);
assert.equal(isAccountTimestamp(NaN), false);
assert.equal(isAccountTimestamp(1.5), false);
assert.equal(isAccountTimestamp(-1), false);

const request = accountRequest(accountFixture(), 'account.close', i.personalSession, 'account', i.adult);
assert.equal(validateAccountRequest(request).ok, true);
for (const value of [null, [], {}, { ...request, action: '*' }, { ...request, authorized: true }, { ...request, target: { ...request.target, version: 0 } }]) {
  assert.equal(validateAccountRequest(value).ok, false, 'Malformed or self-authorized request denied');
}
assert.equal(validateAccountSnapshot({ get format() { throw Error('untrusted getter'); } }).ok, false, 'Boundary does not throw');
console.log(`Account contracts: valid isolated graph, strict fields, identity/relationship/custody bindings and ${malformed.length} malformed scenarios passed.`);
