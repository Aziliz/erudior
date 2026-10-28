// Live room: a teacher or parent runs a quiz from the desktop app; students join in a browser
// with a code and a nickname. One Durable Object per room, everything in memory: when the room
// closes nothing is kept. Students see only their own result and class totals, never names.

export interface LiveQuestion {
  stem: string;
  choices: string[];
  /** Indices of the right choices. Never sent to players before the reveal. */
  answer: number[];
}

interface Player {
  id: string;
  name: string;
  socket: WebSocket | null;
  score: number;
  correct: number;
  team: number;
  /** Answer to the current question, and when (ms) it arrived. */
  answer?: number[];
  at?: number;
}

type Phase = "lobby" | "question" | "reveal" | "ended";

const MAX_PLAYERS = 200;
const MAX_QUESTIONS = 100;
/** A room lives at most this long, and closes this long after the host leaves. */
const ROOM_MS = 4 * 3600_000;
const HOST_GONE_MS = 10 * 60_000;

const clean = (s: unknown, max: number) =>
  String(s ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export class LiveRoom {
  private hostHash = "";
  private host: WebSocket | null = null;
  private players = new Map<string, Player>();
  private title = "";
  private questions: LiveQuestion[] = [];
  private mode: "individual" | "teams" | "cooperative" = "individual";
  private teamCount = 2;
  private timed = false;
  private seconds = 20;
  private phase: Phase = "lobby";
  private index = -1;
  private shownAt = 0;
  private deadline = 0;
  private created = 0;
  private hostLeftAt = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  /** Per question: how many chose each option, and how many were right. */
  private history: { counts: number[]; right: number; answered: number }[] = [];

  constructor(
    private state: DurableObjectState,
    _env: unknown,
  ) {}

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/init" && req.method === "POST") {
      const { tokenHash } = (await req.json()) as { tokenHash: string };
      if (this.hostHash && Date.now() - this.created < ROOM_MS) return new Response("taken", { status: 409 });
      this.reset();
      this.hostHash = tokenHash;
      this.created = Date.now();
      await this.state.storage.setAlarm(Date.now() + ROOM_MS);
      return new Response("ok");
    }
    if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected a WebSocket.", { status: 426 });
    if (!this.hostHash) return new Response("No such room.", { status: 404 });
    const role = url.searchParams.get("role");
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    server.accept();
    if (role === "host") {
      if ((await sha256(url.searchParams.get("token") ?? "")) !== this.hostHash) {
        server.close(4003, "Not the host.");
        return new Response(null, { status: 101, webSocket: client });
      }
      this.host?.close(4000, "Opened elsewhere.");
      this.host = server;
      this.hostLeftAt = 0;
      server.addEventListener("message", (e) => { if (this.host === server) this.onHost(String(e.data)); });
      server.addEventListener("close", () => {
        if (this.host === server) {
          this.host = null;
          this.hostLeftAt = Date.now();
          this.state.storage.setAlarm(Date.now() + HOST_GONE_MS);
        }
      });
      this.sendHost();
    } else {
      const rejoin = url.searchParams.get("player") ?? "";
      server.addEventListener("message", (e) => this.onPlayer(server, String(e.data)));
      server.addEventListener("close", () => {
        for (const p of this.players.values()) if (p.socket === server) p.socket = null;
        this.sendHost();
      });
      const p = this.players.get(rejoin);
      if (p) {
        p.socket?.close(4000, "Opened elsewhere.");
        p.socket = server;
        this.sendPlayer(p);
      } else send(server, { t: "hello", title: this.title || "Live room", phase: this.phase });
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async alarm() {
    const expired = Date.now() - this.created >= ROOM_MS;
    const hostGone = !this.host && this.hostLeftAt && Date.now() - this.hostLeftAt >= HOST_GONE_MS;
    if (expired || hostGone) this.close("The room closed.");
    else await this.state.storage.setAlarm(Date.now() + Math.min(ROOM_MS - (Date.now() - this.created), HOST_GONE_MS));
  }

  private reset() {
    for (const p of this.players.values()) p.socket?.close(4001, "Room closed.");
    this.players.clear();
    this.host = null;
    this.questions = [];
    this.history = [];
    this.phase = "lobby";
    this.index = -1;
    this.title = "";
    this.mode = "individual";
    this.teamCount = 2;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private close(reason: string) {
    this.host?.close(4001, reason);
    for (const p of this.players.values()) p.socket?.close(4001, reason);
    this.reset();
    this.hostHash = "";
    if (this.timer) clearTimeout(this.timer);
  }

  // ---------- host ----------

  private onHost(raw: string) {
    let m: { t?: string; [k: string]: unknown };
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (!m || typeof m !== "object" || Array.isArray(m)) return;
    switch (m.t) {
      case "setup": {
        if (this.phase !== "lobby") return;
        const qs = Array.isArray(m.questions) ? m.questions : [];
        if (!qs.length || qs.length > MAX_QUESTIONS || qs.some((q) => !q || typeof q !== "object" ||
          typeof q.stem !== "string" || !q.stem.trim() || q.stem.length > 2000 ||
          !Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 8 ||
          q.choices.some((c: unknown) => typeof c !== "string" || !c.trim() || c.length > 500) ||
          !Array.isArray(q.answer) || !q.answer.length || new Set(q.answer).size !== q.answer.length ||
          q.answer.some((a: unknown) => !Number.isInteger(a) || (a as number) < 0 || (a as number) >= q.choices.length))) {
          if (this.host) send(this.host, { t: "error", message: "Choose 1–100 valid text-only choice questions. Nothing was changed." });
          return;
        }
        this.questions = qs.map((q) => ({ stem: clean(q.stem, 2000), choices: q.choices.map((c: string) => clean(c, 500)), answer: [...q.answer] }));
        this.mode = m.mode === "teams" || m.mode === "cooperative" ? m.mode : "individual";
        this.teamCount = Number.isInteger(m.teamCount) ? Math.max(2, Math.min(8, Number(m.teamCount))) : 2;
        let n = 0;
        for (const p of this.players.values()) p.team = n++ % this.teamCount;
        this.title = clean(m.title, 120) || "Live room";
        this.timed = m.timed === true;
        this.seconds = Math.min(120, Math.max(5, Number.isFinite(Number(m.seconds)) ? Number(m.seconds) : 20));
        this.broadcast((p) => this.sendPlayer(p));
        break;
      }
      case "assign": {
        if (this.phase !== "lobby" || this.mode !== "teams") return;
        const p = this.players.get(String(m.player));
        if (!p || !Number.isInteger(m.team) || Number(m.team) < 0 || Number(m.team) >= this.teamCount) return;
        p.team = Number(m.team);
        this.broadcast((x) => this.sendPlayer(x));
        break;
      }
      case "shuffleTeams": {
        if (this.phase !== "lobby" || this.mode !== "teams") return;
        const ps = [...this.players.values()];
        for (let i = ps.length - 1; i > 0; i--) {
          const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
          [ps[i], ps[j]] = [ps[j], ps[i]];
        }
        ps.forEach((p, i) => p.team = i % this.teamCount);
        this.broadcast((p) => this.sendPlayer(p));
        break;
      }
      case "show": {
        if (this.phase !== "lobby" && this.phase !== "reveal") return;
        if (m.index !== undefined && m.index !== this.index) return;
        const i = this.phase === "lobby" ? 0 : this.index + 1;
        if (!this.questions.length || i >= this.questions.length) return;
        this.index = i;
        this.phase = "question";
        this.shownAt = Date.now();
        this.deadline = this.timed ? this.shownAt + this.seconds * 1000 : 0;
        for (const p of this.players.values()) {
          p.answer = undefined;
          p.at = undefined;
        }
        if (this.timer) clearTimeout(this.timer);
        if (this.timed) this.timer = setTimeout(() => this.reveal(), this.seconds * 1000 + 300);
        this.broadcast((p) => this.sendPlayer(p));
        break;
      }
      case "reveal":
        if (m.index !== undefined && m.index !== this.index) return;
        this.reveal();
        break;
      case "end":
        if (m.index !== undefined && m.index !== this.index) return;
        if (this.phase === "question") this.reveal();
        this.phase = "ended";
        this.broadcast((p) => this.sendPlayer(p));
        break;
      case "remove": {
        const p = this.players.get(String(m.player));
        if (p) {
          p.socket?.close(4002, "Removed by the host.");
          this.players.delete(p.id);
        }
        break;
      }
      case "close":
        this.close("The host closed the room.");
        return;
    }
    this.sendHost();
  }

  private reveal() {
    if (this.phase !== "question") return;
    if (this.timer) clearTimeout(this.timer);
    const q = this.questions[this.index];
    const counts = q.choices.map(() => 0);
    let right = 0;
    let answered = 0;
    for (const p of this.players.values()) {
      if (!p.answer) continue;
      answered++;
      for (const a of p.answer) if (a >= 0 && a < counts.length) counts[a]++;
      const ok = sameSet(p.answer, q.answer);
      if (ok) {
        right++;
        p.correct++;
        if (this.timed) {
          const left = Math.max(0, this.deadline - (p.at ?? this.deadline));
          p.score += 500 + Math.round((500 * left) / (this.seconds * 1000));
        } else p.score += 1;
      }
    }
    this.history[this.index] = { counts, right, answered };
    this.phase = "reveal";
    this.broadcast((p) => this.sendPlayer(p));
    this.sendHost();
  }

  private sendHost() {
    if (!this.host) return;
    const q = this.questions[this.index];
    send(this.host, {
      t: "state",
      phase: this.phase,
      title: this.title,
      index: this.index,
      total: this.questions.length,
      mode: this.mode,
      teamCount: this.teamCount,
      teams: this.teamTotals(),
      cooperative: this.classTotals(),
      timed: this.timed,
      seconds: this.seconds,
      deadline: this.deadline,
      question: q ?? null,
      answered: [...this.players.values()].filter((p) => p.answer).length,
      players: [...this.players.values()].map((p) => ({ id: p.id, name: p.name, connected: !!p.socket, score: p.score, correct: p.correct, team: p.team, answered: !!p.answer })),
      history: this.history,
    });
  }

  // ---------- players ----------

  private onPlayer(socket: WebSocket, raw: string) {
    let m: { t?: string; [k: string]: unknown };
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (!m || typeof m !== "object" || Array.isArray(m)) return;
    if (m.t === "join") {
      if ([...this.players.values()].some((p) => p.socket === socket)) return;
      if (this.players.size >= MAX_PLAYERS) return send(socket, { t: "error", message: "This room is full." });
      const name = clean(m.name, 20);
      if (!name) return send(socket, { t: "error", message: "Enter a nickname." });
      if ([...this.players.values()].some((p) => p.name.toLowerCase() === name.toLowerCase()))
        return send(socket, { t: "error", message: "That nickname is taken in this room. Try another." });
      if (this.phase === "ended") return send(socket, { t: "error", message: "This quiz has finished." });
      const sizes = Array.from({ length: this.teamCount }, (_, team) => [...this.players.values()].filter(p => p.team === team).length);
      const team = sizes.indexOf(Math.min(...sizes));
      const p: Player = { id: crypto.randomUUID(), name, socket, score: 0, correct: 0, team };
      this.players.set(p.id, p);
      this.sendPlayer(p);
      this.sendHost();
      return;
    }
    const p = [...this.players.values()].find((x) => x.socket === socket);
    if (!p) return;
    if (m.t === "answer" && this.phase === "question" && m.index === this.index && !p.answer) {
      const q = this.questions[this.index];
      const a = (Array.isArray(m.choices) ? m.choices : []).filter((x): x is number => Number.isInteger(x) && x >= 0 && x < q.choices.length);
      if (!a.length || a.length !== (m.choices as unknown[]).length || new Set(a).size !== a.length || (q.answer.length === 1 && a.length !== 1)) return;
      if (this.timed && Date.now() > this.deadline + 500) return;
      p.answer = [...new Set(a)].sort();
      p.at = Date.now();
      this.sendPlayer(p);
      this.sendHost();
      // Everyone answered: reveal early.
      const live = [...this.players.values()].filter((x) => x.socket);
      if (live.length && live.every((x) => x.answer)) this.reveal();
    }
  }

  private sendPlayer(p: Player) {
    if (!p.socket) return;
    const q = this.questions[this.index];
    const base = { t: "play", player: p.id, name: p.name, title: this.title, phase: this.phase, index: this.index, total: this.questions.length, score: p.score, correct: p.correct, timed: this.timed, mode: this.mode, team: p.team, teams: this.mode === "teams" ? this.teamTotals() : [], cooperative: this.mode === "cooperative" ? this.classTotals() : undefined };
    if (this.phase === "question")
      send(p.socket, { ...base, stem: q.stem, choices: q.choices, multi: q.answer.length > 1, answered: p.answer ?? null, secondsLeft: this.timed ? Math.max(0, Math.round((this.deadline - Date.now()) / 1000)) : null });
    else if (this.phase === "reveal") {
      const h = this.history[this.index];
      send(p.socket, { ...base, stem: q.stem, choices: q.choices, answer: q.answer, yours: p.answer ?? null, right: p.answer ? sameSet(p.answer, q.answer) : false, counts: h.counts, classRight: h.right, classAnswered: h.answered });
    } else send(p.socket, base);
  }

  private teamTotals() {
    return Array.from({ length: this.teamCount }, (_, team) => {
      const players = [...this.players.values()].filter(p => p.team === team);
      return { team, members: players.length, score: players.reduce((n, p) => n + p.score, 0), correct: players.reduce((n, p) => n + p.correct, 0) };
    });
  }

  private classTotals() {
    return { correct: this.history.reduce((n, h) => n + (h?.right ?? 0), 0), answered: this.history.reduce((n, h) => n + (h?.answered ?? 0), 0) };
  }

  private broadcast(fn: (p: Player) => void) {
    for (const p of this.players.values()) fn(p);
  }
}

function send(ws: WebSocket, data: unknown) {
  try {
    ws.send(JSON.stringify(data));
  } catch {
    /* socket already closed */
  }
}

const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);

export async function sha256(s: string): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return [...d].map((x) => x.toString(16).padStart(2, "0")).join("");
}
