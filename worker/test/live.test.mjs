// Live room protocol test against `npm run dev` (http://localhost:8787).
//   node test/live.test.mjs
const API = process.env.API ?? "http://localhost:8787";
const WS = API.replace(/^http/, "ws");
let fails = 0;
const ok = (name, cond, extra) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra === undefined ? "" : JSON.stringify(extra).slice(0, 400));
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(url) {
  const ws = new WebSocket(url);
  const msgs = [];
  const closed = { code: 0, reason: "" };
  ws.addEventListener("message", (e) => msgs.push(JSON.parse(e.data)));
  ws.addEventListener("close", (e) => Object.assign(closed, { code: e.code, reason: e.reason }));
  const open = new Promise((res, rej) => {
    ws.addEventListener("open", res);
    ws.addEventListener("error", rej);
  });
  return { ws, msgs, closed, open, last: (t) => [...msgs].reverse().find((m) => !t || m.t === t), send: (m) => ws.send(JSON.stringify(m)) };
}

const created = await fetch(`${API}/live/rooms`, { method: "POST", headers: { Origin: "tauri://localhost" } }).then((r) => r.json());
ok("room created", /^[A-Z0-9]{6}$/.test(created.code) && created.token, created);
const base = `${WS}/live/rooms/${created.code}/ws`;

const bad = connect(`${base}?role=host&token=wrong`);
await bad.open.catch(() => {});
await sleep(300);
ok("wrong host token closed", bad.closed.code === 4003, bad.closed);

const host = connect(`${base}?role=host&token=${created.token}`);
await host.open;
await sleep(200);
ok("host gets state", host.last("state")?.phase === "lobby");

const questions = [
  { stem: "2 + 2?", choices: ["3", "4", "5"], answer: [1] },
  { stem: "Pick the primes", choices: ["2", "4", "5"], answer: [0, 2] },
];
host.send({ t: "setup", title: "Warm-up", questions, timed: false });

const a = connect(`${base}?role=player`);
const b = connect(`${base}?role=player`);
await Promise.all([a.open, b.open]);
await sleep(200);
ok("player hello", a.last("hello")?.title === "Warm-up");
a.send({ t: "join", name: "Ana" });
b.send({ t: "join", name: "ana" });
await sleep(300);
ok("duplicate nickname refused", /taken/.test(b.last("error")?.message ?? ""));
b.send({ t: "join", name: "Ben" });
await sleep(300);
ok("players joined", host.last("state").players.length === 2);
ok("player sees lobby, no answers", a.last("play")?.phase === "lobby" && a.last("play").answer === undefined);

host.send({ t: "show" });
await sleep(300);
const q1 = a.last("play");
ok("question sent without the answer", q1.phase === "question" && q1.stem === "2 + 2?" && q1.answer === undefined && q1.multi === false, q1);
a.send({ t: "answer", index: 0, choices: [1] });
await sleep(200);
ok("host sees 1 answered", host.last("state").answered === 1);
a.send({ t: "answer", index: 0, choices: [0] });
await sleep(100);
b.send({ t: "answer", index: 0, choices: [2] });
await sleep(400);
const r1 = a.last("play");
ok("everyone answered = reveal", r1.phase === "reveal" && r1.right === true && r1.score === 1, r1);
ok("first answer counts", r1.yours.join() === "1");
ok("class totals, no names", r1.counts.join() === "0,1,1" && r1.classRight === 1 && r1.classAnswered === 2 && !JSON.stringify(r1).includes("Ben"), r1);
ok("Ben wrong", b.last("play").right === false && b.last("play").score === 0);

host.send({ t: "show" });
await sleep(300);
ok("multi question", a.last("play").multi === true);
a.send({ t: "answer", index: 1, choices: [2, 0] });
await sleep(200);
host.send({ t: "reveal" });
await sleep(300);
ok("multi right", a.last("play").right === true && a.last("play").score === 2);
ok("Ben didn't answer", b.last("play").yours === null && b.last("play").classAnswered === 1);

// Reconnect keeps the player.
const aid = a.last("play").player;
a.ws.close();
await sleep(300);
const a2 = connect(`${base}?role=player&player=${aid}`);
await a2.open;
await sleep(300);
ok("rejoin keeps score", a2.last("play")?.score === 2 && a2.last("play").name === "Ana");

host.send({ t: "end" });
await sleep(300);
ok("ended", a2.last("play").phase === "ended" && host.last("state").phase === "ended");
ok("host sees scores", host.last("state").players.find((p) => p.name === "Ana").correct === 2);

// Timed room: speed points and auto reveal.
const t = await fetch(`${API}/live/rooms`, { method: "POST" }).then((r) => r.json());
const th = connect(`${WS}/live/rooms/${t.code}/ws?role=host&token=${t.token}`);
await th.open;
th.send({ t: "setup", title: "Timed", questions: [questions[0]], timed: true, seconds: 5 });
const tp = connect(`${WS}/live/rooms/${t.code}/ws?role=player`);
const tq = connect(`${WS}/live/rooms/${t.code}/ws?role=player`);
await Promise.all([tp.open, tq.open]);
tp.send({ t: "join", name: "Fast" });
tq.send({ t: "join", name: "Idle" });
await sleep(300);
th.send({ t: "show" });
await sleep(300);
ok("timed question has seconds", tp.last("play").secondsLeft >= 4);
tp.send({ t: "answer", index: 0, choices: [1] });
await sleep(5600);
const tr = tp.last("play");
ok("auto reveal at deadline with speed points", tr.phase === "reveal" && tr.score > 900 && tr.score <= 1000, tr);

// Host removes a player; closing ends the room.
th.send({ t: "remove", player: tq.last("play").player });
await sleep(300);
ok("removed player disconnected", tq.closed.code === 4002, tq.closed);
th.send({ t: "close" });
await sleep(300);
ok("room closed for players", tp.closed.code === 4001);
const gone = connect(`${WS}/live/rooms/${t.code}/ws?role=player`);
await gone.open.catch(() => {});
await sleep(300);
ok("closed room can't be joined", gone.ws.readyState !== 1);
ok("bad code 404", (await fetch(`${API}/live/rooms/abc/ws`)).status === 404);

for (const c of [host, a2, b, th, tp]) c.ws.close();
if (fails) {
  console.log(`${fails} live test(s) failed`);
  process.exit(1);
}
console.log("live room tests passed");
process.exit(0);
