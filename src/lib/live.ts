// Live room client: hosts (desktop app, parent or teacher area) open a room on the community
// API and run a quiz; players join in any Erudior (usually app.erudior.com) with a code and a
// nickname. Nothing about a room is kept once it closes.

import type { Course, Question } from "./types";
import { isChoice } from "./questions";
import { API, COMMUNITY } from "./community";

export const LIVE = COMMUNITY;

export interface LiveQuestion {
  stem: string;
  choices: string[];
  answer: number[];
}

export type LiveMode = "individual" | "teams" | "cooperative";
export interface TeamTotal { team: number; members: number; score: number; correct: number }

export interface HostState {
  mode: LiveMode;
  teamCount: number;
  teams: TeamTotal[];
  cooperative: { correct: number; answered: number };
  t: "state";
  phase: "lobby" | "question" | "reveal" | "ended";
  title: string;
  index: number;
  total: number;
  timed: boolean;
  seconds: number;
  deadline: number;
  question: LiveQuestion | null;
  answered: number;
  players: { id: string; name: string; connected: boolean; score: number; correct: number; team: number; answered: boolean }[];
  history: { counts: number[]; right: number; answered: number }[];
}

export interface PlayState {
  mode: LiveMode;
  team: number;
  teams: TeamTotal[];
  cooperative?: { correct: number; answered: number };
  t: "play";
  player: string;
  name: string;
  title: string;
  phase: "lobby" | "question" | "reveal" | "ended";
  index: number;
  total: number;
  score: number;
  correct: number;
  timed: boolean;
  stem?: string;
  choices?: string[];
  multi?: boolean;
  answered?: number[] | null;
  secondsLeft?: number | null;
  answer?: number[];
  yours?: number[] | null;
  right?: boolean;
  counts?: number[];
  classRight?: number;
  classAnswered?: number;
}

export type ServerMsg = HostState | PlayState | { t: "hello"; title: string; phase: string } | { t: "error"; message: string };

const wsBase = () => API.replace(/^http/, "ws");
export const codeOk = (c: string) => /^[A-Z0-9]{6}$/.test(c);
export const normCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

export async function openRoom(): Promise<{ code: string; token: string; joinUrl: string }> {
  let res: Response;
  try {
    res = await fetch(`${API}/live/rooms`, { method: "POST" });
  } catch {
    throw new Error("Couldn't reach the Erudior server. Live rooms need an internet connection.");
  }
  const data = (await res.json().catch(() => ({}))) as { code?: string; token?: string; joinUrl?: string; error?: string };
  if (!res.ok || !data.code || !data.token) throw new Error(data.error ?? `Couldn't open a room (${res.status}).`);
  return { code: data.code, token: data.token, joinUrl: data.joinUrl ?? "" };
}

/**
 * A socket that reconnects (with backoff) until stopped. `onClose` gets the server's close code
 * when it ends the connection on purpose (room closed, removed, not the host).
 */
export function liveSocket(
  url: string,
  handlers: { onMessage: (m: ServerMsg) => void; onStatus: (s: "connecting" | "open" | "lost") => void; onEnd: (code: number, reason: string) => void },
  hello?: () => unknown,
) {
  let ws: WebSocket | null = null;
  let currentUrl = () => url;
  let stopped = false;
  let tries = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const connect = (u: string) => {
    handlers.onStatus("connecting");
    const connection = new WebSocket(u);
    ws = connection;
    connection.onopen = () => {
      if (stopped || ws !== connection) { connection.close(1000); return; }
      tries = 0;
      handlers.onStatus("open");
      const h = hello?.();
      if (h && !stopped && ws === connection) connection.send(JSON.stringify(h));
    };
    connection.onmessage = (e) => {
      if (stopped || ws !== connection) return;
      try {
        handlers.onMessage(JSON.parse(String(e.data)) as ServerMsg);
      } catch {
        /* ignore */
      }
    };
    connection.onclose = (e) => {
      if (stopped || ws !== connection) return;
      if (e.code >= 4000 && e.code < 4100) {
        stopped = true;
        handlers.onEnd(e.code, e.reason);
        return;
      }
      handlers.onStatus("lost");
      tries++;
      if (tries > 30) {
        stopped = true;
        handlers.onEnd(0, "Lost the connection to the room.");
        return;
      }
      timer = setTimeout(() => connect(currentUrl()), Math.min(8000, 500 * 2 ** Math.min(tries, 4)));
    };
  };
  connect(url);
  return {
    send: (m: unknown) => {
      if (stopped || ws?.readyState !== WebSocket.OPEN) return false;
      try { ws.send(JSON.stringify(m)); return true; } catch { return false; }
    },
    /** Change the URL used for reconnecting (e.g. once the player id is known). */
    setUrl: (f: () => string) => (currentUrl = f),
    stop: () => {
      stopped = true;
      clearTimeout(timer);
      ws?.close(1000);
    },
  };
}

export const hostUrl = (code: string, token: string) => `${wsBase()}/live/rooms/${code}/ws?role=host&token=${encodeURIComponent(token)}`;
export const playerUrl = (code: string, player?: string) => `${wsBase()}/live/rooms/${code}/ws?role=player${player ? `&player=${encodeURIComponent(player)}` : ""}`;

/** The room this app is hosting, kept while the app is open so the host can leave the screen and come back. */
export let hosting: { code: string; token: string; joinUrl: string; title: string } | null = null;
export const setHosting = (h: typeof hosting) => (hosting = h);


/** Live games deliberately support only self-contained text choice questions. */
export function liveQuestionUsable(q: Question): boolean {
  const textOnly = (text: string) => !/\x60\x60\x60|!\[|\[\[|<\/?[a-z]|\]\([^)]*\)|^\s*\|/im.test(text);
  return isChoice(q) && !q.image && !q.audio && !q.listen && !q.blend && textOnly(q.stem) && q.choices.every(textOnly) && !!q.stem?.trim() && q.stem.length <= 2000 &&
    q.choices.length >= 2 && q.choices.length <= 8 && q.choices.every(c => !!c.trim() && c.length <= 500) &&
    q.answer.length > 0 && new Set(q.answer).size === q.answer.length &&
    q.answer.every(a => Number.isInteger(a) && a >= 0 && a < q.choices.length);
}

/** Ambiguous IDs fail closed instead of silently using a different bank's answer. */
export function liveSourceQuestions(course: Course, ids?: string[]): Question[] {
  const all = course.banks.flatMap(b => b.questions);
  const counts = new Map<string, number>();
  for (const q of all) counts.set(q.id, (counts.get(q.id) ?? 0) + 1);
  const eligible = all.filter(q => counts.get(q.id) === 1 && liveQuestionUsable(q));
  if (!ids) return eligible;
  return [...new Set(ids)].flatMap(id => eligible.filter(q => q.id === id));
}
