import assert from 'node:assert/strict';
import { parseStudentWorkspace, upsertWorkspaceEntry, removeWorkspaceEntry, STUDENT_WORKSPACE_LIMITS, type WorkspaceEntry } from '../src/lib/studentWorkspace';
const entry: WorkspaceEntry = { id:'note-1',kind:'note',title:'Independent notebook',body:'My own ideas\n<script>alert(1)</script>',status:'active',createdAt:'2026-10-30T10:00:00.000Z',updatedAt:'2026-10-30T10:00:00.000Z' };
const workspace={version:1 as const,entries:[entry]};
assert.deepEqual(parseStudentWorkspace(undefined),{version:1,entries:[]});
assert.deepEqual(parseStudentWorkspace(workspace),workspace);
for(const kind of ['task','note','reading','goal','project']) assert.equal(parseStudentWorkspace({version:1,entries:[{...entry,kind}]}).entries[0].kind,kind);
for(const kind of ['course','lesson','reading','reference','work']) {
 const link={kind,courseId:'course',...(kind==='course'?{}:{sourceId:'source'})};
 const copy=parseStudentWorkspace({version:1,entries:[{...entry,link}]});
 assert.deepEqual(copy.entries[0].link,link);assert.notEqual(copy.entries[0].link,link);
}
for(const value of [null,{},[],{...workspace,extra:true},{...workspace,version:2},{version:1,entries:new Array(1)},
 {version:1,entries:[entry,entry]}, {version:1,entries:Array.from({length:501},(_,i)=>({...entry,id:'entry'+i}))},
 ...[ {extra:true}, {id:'__proto__'}, {id:'../escape'}, {kind:'grade'}, {status:'passed'}, {title:''}, {title:' padded'},
 {title:'x'.repeat(161)}, {body:'x'.repeat(20001)}, {body:'\0'}, {createdAt:'2026-02-30T00:00:00.000Z'},
 {updatedAt:'2026-10-29T00:00:00.000Z'}, {dueDate:'2026-02-30'}, {dueDate:undefined},
 {link:{courseId:'a',kind:'https'}}, {link:{courseId:'a',kind:'course',sourceId:'x'}},
 {link:{courseId:'a',kind:'lesson'}}, {link:{courseId:'a',kind:'lesson',sourceId:'__proto__'}},
 {link:{courseId:'a',kind:'lesson',sourceId:'x',url:'https://example.org'}},
 ].map(patch=>({version:1,entries:[{...entry,...patch}]})),
 {version:1,entries:[Object.assign(Object.create({evil:true}),entry)]},
 {version:1,entries:[Object.defineProperty({...entry},'title',{get(){throw Error('Getter executed');},enumerable:true})]},
 {version:1,entries:Array.from({length:120},(_,i)=>({...entry,id:'large'+i,body:'x'.repeat(20000)}))},
 {version:1,entries:Array.from({length:60},(_,i)=>({...entry,id:'unicode'+i,body:'界'.repeat(20000)}))},
]) assert.throws(()=>parseStudentWorkspace(value),/Invalid student workspace/);
assert.equal(STUDENT_WORKSPACE_LIMITS.bytes,2097152);
const original=JSON.stringify(entry), changed={...entry,title:'Edited',updatedAt:'2026-10-30T11:00:00.000Z'};
assert.equal(upsertWorkspaceEntry(workspace,changed,original).entries[0].title,'Edited');
assert.deepEqual(upsertWorkspaceEntry(undefined,entry,null),workspace);
assert.throws(()=>upsertWorkspaceEntry(workspace,entry,null),/changed/);
assert.throws(()=>upsertWorkspaceEntry(undefined,entry,original),/changed/);
assert.throws(()=>upsertWorkspaceEntry(workspace,changed,JSON.stringify(changed)),/changed/);
assert.throws(()=>upsertWorkspaceEntry(workspace,{...changed,kind:'goal'},original),/kind/);
assert.deepEqual(removeWorkspaceEntry(workspace,entry.id,original),{version:1,entries:[]});
assert.throws(()=>removeWorkspaceEntry(workspace,entry.id,'stale'),/changed/);
assert.equal(workspace.entries[0].title,entry.title,'pure changes never mutate old progress');
console.log('Student workspace: strict bounded private entries, plain-text content, valid links, dates, copy isolation and conflict guards passed.');
