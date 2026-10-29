import assert from "node:assert/strict";
import { LiveRoom } from "../worker/src/live.ts";
import { liveSourceQuestions, liveQuestionUsable, liveSocket } from "../src/lib/live.ts";
const socket = () => ({ messages: [] as any[], send(raw: string) { this.messages.push(JSON.parse(raw)); }, close() {}, last() { return this.messages.at(-1); } });
const room: any = new LiveRoom({ storage: { setAlarm: async () => {} } } as any, {});
const host = socket(); room.host = host;
const command = (m: unknown) => room.onHost(JSON.stringify(m));
const questions = [
  { stem: "One?", choices: ["Yes", "No"], answer: [0] },
  { stem: "Two?", choices: ["Yes", "No"], answer: [1] },
];
command(null); command([]); command({ t: "setup", questions: [null] });
assert.equal(room.questions.length, 0);
command({ t: "setup", title: "Team battle", questions, mode: "teams", teamCount: 2 });
const a = socket(), b = socket(), c = socket();
for (const [s, name] of [[a,"Private Alice"],[b,"Private Bob"],[c,"Private Carol"]] as const) room.onPlayer(s, JSON.stringify({ t: "join", name }));
assert.deepEqual([...room.players.values()].map((p:any) => p.team), [0,1,0]);
const bid = b.last().player;
command({ t: "assign", player: bid, team: 0 }); assert.equal(room.players.get(bid).team, 0);
command({ t: "shuffleTeams" }); assert.deepEqual(room.teamTotals().map((t:any) => t.members).sort(), [1,2]);
command({ t: "show", index: -1 }); command({ t: "show", index: -1 }); assert.equal(room.index, 0);
assert.equal(a.last().answer, undefined);
assert(!JSON.stringify(a.last()).includes("Private Bob"));
command({ t: "assign", player: bid, team: 7 }); assert(room.players.get(bid).team < 2);
room.onPlayer(a, JSON.stringify({ t: "answer", index: 0, choices: [0,1] })); assert.equal(room.players.get(a.last().player).answer, undefined);
room.onPlayer(a, JSON.stringify({ t: "answer", index: 0, choices: [0] }));
room.onPlayer(a, JSON.stringify({ t: "answer", index: 0, choices: [1] }));
command({ t: "reveal", index: 0 }); command({ t: "reveal", index: 0 });
assert.equal(a.last().score, 1);
assert.equal(room.teamTotals().reduce((n:number,t:any)=>n+t.score,0),1);
command({ t: "show", index: -1 }); assert.equal(room.index, 0);
command({ t: "show", index: 0 }); assert.equal(room.index, 1);
command({ t: "end", index: 0 }); assert.equal(room.phase, "question");
command({ t: "end", index: 1 }); command({ t: "end", index: 1 });
assert.equal(room.phase,"ended"); assert.equal(a.last().score,1);
command({ t: "show" }); assert.equal(room.phase,"ended");
command({ t: "setup", questions }); assert.equal(room.phase,"ended");
room.reset(); room.host=host;
command({ t:"setup",questions,mode:"cooperative" });
room.onPlayer(a,JSON.stringify({t:"join",name:"A"}));room.onPlayer(b,JSON.stringify({t:"join",name:"B"}));
command({t:"show"});room.onPlayer(a,JSON.stringify({t:"answer",index:0,choices:[0]}));room.onPlayer(b,JSON.stringify({t:"answer",index:0,choices:[1]}));
assert.deepEqual(a.last().cooperative,{correct:1,answered:2});assert.deepEqual(a.last().teams,[]);
assert(!JSON.stringify(a.last()).includes('"name":"B"'));
const q:any={...questions[0],id:"q",type:"choice"};
const course:any={banks:[{questions:[q]},{questions:[{...q,id:"other"}]}]};
assert.deepEqual(liveSourceQuestions(course,["other"]).map(q=>q.id),["other"]);
course.banks[1].questions.push(q);assert.deepEqual(liveSourceQuestions(course,["q"]),[]);
course.banks[1].questions[0].audio={};assert.equal(liveSourceQuestions(course).length,0);
room.close("done");
console.log("live modes: balanced teams, privacy, cooperative totals, validation, stale/repeated controls and source identity passed");


class FakeSocket {
  static OPEN = 1; static instances: FakeSocket[] = [];
  readyState = 1; sent: string[] = []; onopen?: () => void; onmessage?: (event: any) => void; onclose?: (event: any) => void;
  constructor(_url: string) { FakeSocket.instances.push(this); }
  send(raw: string) { this.sent.push(raw); }
  close() {}
}
Object.assign(globalThis, { WebSocket: FakeSocket });
let messages = 0, statuses = 0;
const client = liveSocket("ws://test", { onMessage() { messages++; }, onStatus() { statuses++; }, onEnd() {} }, () => ({ t: "join" }));
const first = FakeSocket.instances.at(-1)!;
client.stop(); first.onopen?.(); first.onmessage?.({data:'{"t":"hello"}'});
assert.equal(messages,0);assert.equal(first.sent.length,0);assert.equal(client.send({t:"answer"}),false);
assert.equal(statuses,1);
console.log("live socket stopped-event guard passed");

assert.equal(liveQuestionUsable({...q,listen:{text:"Listen"}}), false);
assert.equal(liveQuestionUsable({...q,blend:{word:"cat"}}), false);
assert.equal(liveQuestionUsable({...q,stem:"![Required diagram](asset)"}), false);
assert.equal(liveQuestionUsable({...q,stem:"` `".replaceAll(" ","") + "`widget"}), false);
