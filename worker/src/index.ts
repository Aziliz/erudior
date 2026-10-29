import { branchingRevisionProblems } from "../../src/lib/branchingCoursePackage";
import { scientificRevisionProblems } from "../../src/lib/scientificCoursePackage";
import { advancedAssessmentRevisionProblems } from "../../src/lib/advancedAssessmentCoursePackage";
import { handleLti } from "./lti.ts";
// Erudior community course API (Cloudflare Worker, D1 + R2).
//
// Public:   GET /catalog, GET /courses/:id, GET /images/:id, POST /courses/:id/report
// Sign-in:  GET /auth/{google,github}/start?return=/path, …/callback, POST /auth/logout, GET /me
// Authors:  POST /me/accept, PUT /me, GET /mine, POST /drafts, GET|PUT|DELETE /drafts/:id,
//           POST /drafts/:id/publish, POST /drafts/:id/unpublish, POST /images,
//           GET|POST /drafts/:id/editors, DELETE /drafts/:id/editors/:userId, POST /drafts/:id/claim
// Review:   GET /review, GET /review/all, POST /review/:id, POST /reports/:id/resolve   (reviewer, admin)
// Admin:    GET /admin/users, POST /admin/users/:id                    (admin)
//
// Only adults (18+) who accept the current terms (TERMS_VERSION) can publish. Courses go live at
// once tagged "Not reviewed"; a reviewer marks a version Reviewed, and any new version is Not
// reviewed again. Under terms v2 published courses belong to Erudior; the owner, editors the owner
// adds, and admins can change them. If the owner hasn't been seen for a year (CLAIM_DAYS), any
// author can take the course over (the old owner stays on as an editor).

import { LIMITS, IMAGE_TYPES, checkDoc, communityWorkRevisionProblems, emptyDoc, imageIds, upgradeDoc, type CommunityDoc } from "../../src/lib/communityFormat.ts";
import { normalizeLevel, normalizeSubject, normalizeType } from "../../src/lib/taxonomy.ts";

export { LiveRoom } from "./live.ts";
import { sha256 as liveHash } from "./live.ts";

export interface Env {
  LIVE: DurableObjectNamespace;
  DB: D1Database;
  FILES: R2Bucket;
  APP_ORIGIN: string;
  ALLOWED_ORIGINS: string;
  API_ORIGIN: string;
  ADMIN_EMAILS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET?: string;
  DEV_LOGIN?: string;
  /** Absent by default. Real platform trust configuration needs explicit approval. */
  LTI_REGISTRATIONS?: string;
}

type Role = "author" | "reviewer" | "admin";
interface User {
  id: string;
  provider: string;
  email: string | null;
  display_name: string;
  role: Role;
  banned: number;
  accepted_at: string | null;
  terms_version?: number;
  last_seen_at?: string | null;
}
interface CourseRow {
  id: string;
  owner_id: string;
  draft: string;
  status: "draft" | "published" | "unpublished" | "removed";
  version: number;
  reviewed_version: number;
  review_note: string | null;
  title: string;
  description: string;
  subject: string;
  level: string;
  kind?: string;
  counts: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const SESSION_COOKIE = "erudior_session";
const STATE_COOKIE = "erudior_oauth";
const SESSION_DAYS = 30;
/** Community course terms version; users who accepted an older one must accept again. */
const TERMS_VERSION = 2;
/** Days without signing in after which another author may take over a course. */
const CLAIM_DAYS = 365;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const now = () => new Date().toISOString();
const rid = (n = 16) => {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => x.toString(36).padStart(2, "0")).join("").slice(0, n + 6);
};
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function sha256(s: string): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return [...d].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function cookies(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (req.headers.get("Cookie") ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function setCookie(env: Env, name: string, value: string, maxAge: number): string {
  const secure = env.API_ORIGIN.startsWith("https://") ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function origins(env: Env): string[] {
  return [env.APP_ORIGIN, ...env.ALLOWED_ORIGINS.split(",")].map((s) => s.trim()).filter(Boolean);
}

/** CORS for signed-in calls: only the app's own origins, with cookies. */
function cors(req: Request, env: Env, pub: boolean): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  if (origins(env).includes(origin))
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      Vary: "Origin",
    };
  // Anyone (the desktop app, other sites) may read the catalog and courses and send a report.
  return pub ? { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" } : {};
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } });
}

// ---------- sessions ----------

async function currentUser(req: Request, env: Env): Promise<User | null> {
  const token = cookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const row = await env.DB.prepare(
    "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?",
  )
    .bind(await sha256(token), now())
    .first<User>();
  return row && !row.banned ? row : null;
}

async function needUser(req: Request, env: Env, accepted = true): Promise<User> {
  const u = await currentUser(req, env);
  if (!u) throw new HttpError(401, "Sign in first.");
  if (accepted && (!u.accepted_at || (u.terms_version ?? 0) < TERMS_VERSION))
    throw new HttpError(403, u.accepted_at ? "The community terms changed; accept the new terms first." : "Confirm you're 18 or older and accept the terms first.");
  return u;
}

function needRole(u: User, ...roles: Role[]) {
  if (!roles.includes(u.role)) throw new HttpError(403, "Not allowed.");
}

async function seen(env: Env, userId: string) {
  await env.DB.prepare("UPDATE users SET last_seen_at = ? WHERE id = ? AND (last_seen_at IS NULL OR last_seen_at < ?)")
    .bind(now(), userId, new Date(Date.now() - 86400_000).toISOString())
    .run();
}

async function startSession(env: Env, userId: string): Promise<string> {
  await seen(env, userId);
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString();
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256(token), userId, expires).run();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now()).run();
  return setCookie(env, SESSION_COOKIE, token, SESSION_DAYS * 86400);
}

async function upsertUser(env: Env, provider: string, providerId: string, email: string | null, name: string): Promise<User> {
  const admins = env.ADMIN_EMAILS.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin = !!email && admins.includes(email.toLowerCase());
  const existing = await env.DB.prepare("SELECT * FROM users WHERE provider = ? AND provider_id = ?").bind(provider, providerId).first<User>();
  if (existing) {
    if (existing.banned) throw new HttpError(403, "This account can't sign in.");
    if (isAdmin && existing.role !== "admin") await env.DB.prepare("UPDATE users SET role = 'admin' WHERE id = ?").bind(existing.id).run();
    if (email && email !== existing.email) await env.DB.prepare("UPDATE users SET email = ? WHERE id = ?").bind(email, existing.id).run();
    return { ...existing, role: isAdmin ? "admin" : existing.role };
  }
  const id = rid();
  const display = (name || email?.split("@")[0] || "Author").slice(0, 60);
  await env.DB.prepare("INSERT INTO users (id, provider, provider_id, email, display_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, provider, providerId, email, display, isAdmin ? "admin" : "author", now())
    .run();
  return { id, provider, email, display_name: display, role: isAdmin ? "admin" : "author", banned: 0, accepted_at: null, terms_version: 0 };
}

// ---------- OAuth ----------

const safeReturn = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

async function oauthStart(req: Request, env: Env, provider: "google" | "github"): Promise<Response> {
  const url = new URL(req.url);
  const state = b64url(crypto.getRandomValues(new Uint8Array(24)));
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const redirect = `${env.API_ORIGIN}/auth/${provider}/callback`;
  let to: string;
  if (provider === "google") {
    if (!env.GOOGLE_CLIENT_ID) throw new HttpError(503, "Google sign-in isn't set up.");
    to =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: redirect,
        response_type: "code",
        scope: "openid email profile",
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
        prompt: "select_account",
      });
  } else {
    if (!env.GITHUB_CLIENT_ID) throw new HttpError(503, "GitHub sign-in isn't set up.");
    to =
      "https://github.com/login/oauth/authorize?" +
      new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, redirect_uri: redirect, scope: "read:user user:email", state, allow_signup: "true" });
  }
  const payload = JSON.stringify({ state, verifier, ret: safeReturn(url.searchParams.get("return")) });
  return new Response(null, { status: 302, headers: { Location: to, "Set-Cookie": setCookie(env, STATE_COOKIE, payload, 600) } });
}

async function oauthCallback(req: Request, env: Env, provider: "google" | "github"): Promise<Response> {
  const url = new URL(req.url);
  const saved = JSON.parse(cookies(req)[STATE_COOKIE] ?? "null") as { state: string; verifier: string; ret: string } | null;
  const code = url.searchParams.get("code");
  if (!saved || !code || url.searchParams.get("state") !== saved.state) throw new HttpError(400, "Sign-in expired or was tampered with. Try again.");
  const redirect = `${env.API_ORIGIN}/auth/${provider}/callback`;
  let user: User;
  if (provider === "google") {
    const tok = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: redirect,
        grant_type: "authorization_code",
        code_verifier: saved.verifier,
      }),
    }).then((r) => r.json<{ access_token?: string }>());
    if (!tok.access_token) throw new HttpError(400, "Google sign-in failed.");
    const info = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tok.access_token}` } }).then((r) =>
      r.json<{ sub: string; email?: string; email_verified?: boolean; name?: string }>(),
    );
    user = await upsertUser(env, "google", info.sub, info.email_verified ? (info.email ?? null) : null, info.name ?? "");
  } else {
    const tok = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: redirect }),
    }).then((r) => r.json<{ access_token?: string }>());
    if (!tok.access_token) throw new HttpError(400, "GitHub sign-in failed.");
    const h = { Authorization: `Bearer ${tok.access_token}`, "User-Agent": "erudior-community", Accept: "application/vnd.github+json" };
    const gh = await fetch("https://api.github.com/user", { headers: h }).then((r) => r.json<{ id: number; login: string; name?: string }>());
    const emails = await fetch("https://api.github.com/user/emails", { headers: h })
      .then((r) => (r.ok ? r.json<{ email: string; primary: boolean; verified: boolean }[]>() : []))
      .catch(() => []);
    const primary = emails.find((e) => e.primary && e.verified)?.email ?? null;
    user = await upsertUser(env, "github", String(gh.id), primary, gh.name || gh.login);
  }
  const headers = new Headers({ Location: `${env.APP_ORIGIN}${saved.ret}` });
  headers.append("Set-Cookie", await startSession(env, user.id));
  headers.append("Set-Cookie", setCookie(env, STATE_COOKIE, "", 0));
  return new Response(null, { status: 302, headers });
}

/** Local development only (DEV_LOGIN=1): sign in as a made-up user. */
async function devLogin(req: Request, env: Env): Promise<Response> {
  if (env.DEV_LOGIN !== "1") throw new HttpError(404, "Not found.");
  const url = new URL(req.url);
  const name = (url.searchParams.get("name") || "Dev author").slice(0, 60);
  const email = url.searchParams.get("email") || `${name.toLowerCase().replace(/\W+/g, ".")}@example.test`;
  const user = await upsertUser(env, "dev", email, email, name);
  const role = url.searchParams.get("role") as Role | null;
  if (role && ["author", "reviewer", "admin"].includes(role)) await env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, user.id).run();
  const headers = new Headers({ Location: `${env.APP_ORIGIN}${safeReturn(url.searchParams.get("return"))}` });
  headers.append("Set-Cookie", await startSession(env, user.id));
  // Tests: pretend this user was last seen long ago (?away=400 days).
  const away = Number(url.searchParams.get("away") ?? 0);
  if (away > 0) await env.DB.prepare("UPDATE users SET last_seen_at = ? WHERE id = ?").bind(new Date(Date.now() - away * 86400_000).toISOString(), user.id).run();
  return new Response(null, { status: 302, headers });
}

// ---------- courses ----------

const counts = (d: CommunityDoc) => ({
  lessons: d.canonical ? d.canonical.course.lessons.length : d.lessons.length,
  questions: d.canonical ? d.canonical.course.banks.reduce((n, b) => n + b.questions.length, 0) : d.lessons.reduce((s, l) => s + l.blocks.filter((b) => b.type === "question").length, 0) + (d.modules ?? []).reduce((s, m) => s + (m.quiz?.length ?? 0), 0),
  cards: d.canonical ? d.canonical.course.decks.reduce((n, d) => n + d.cards.length, 0) : d.decks.reduce((s, k) => s + k.cards.length, 0),
});

const tag = (c: { version: number; reviewed_version: number }) => (c.version > 0 && c.reviewed_version === c.version ? "reviewed" : "not_reviewed");

const claimable = (lastSeen: string | null | undefined) => !!lastSeen && Date.now() - Date.parse(lastSeen) > CLAIM_DAYS * 86400_000;

function publicCourse(c: CourseRow & { author: string; author_seen?: string | null }) {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    subject: normalizeSubject(c.subject),
    level: normalizeLevel(c.level),
    type: normalizeType(c.kind),
    author: c.author,
    version: c.version,
    review: tag(c),
    counts: JSON.parse(c.counts),
    updated: c.published_at,
    // The author hasn't signed in for a year: another author may take the course over.
    ...(claimable(c.author_seen) ? { claimable: true } : {}),
  };
}

const isEditor = async (env: Env, courseId: string, userId: string) =>
  !!(await env.DB.prepare("SELECT 1 AS x FROM course_editors WHERE course_id = ? AND user_id = ?").bind(courseId, userId).first());

/** A course the user may change: they own it, the owner made them an editor, or they're an admin. `ownerOnly`: owner or admin. */
async function ownCourse(env: Env, u: User, id: string, ownerOnly = false): Promise<CourseRow> {
  const c = await env.DB.prepare("SELECT * FROM courses WHERE id = ?").bind(id).first<CourseRow>();
  if (!c) throw new HttpError(404, "Course not found.");
  if (c.owner_id === u.id || u.role === "admin") return c;
  if (!ownerOnly && (await isEditor(env, c.id, u.id))) return c;
  throw new HttpError(404, "Course not found.");
}

async function readJson<T>(req: Request, max = LIMITS.docBytes + 4096): Promise<T> {
  const len = Number(req.headers.get("Content-Length") ?? 0);
  if (len > max) throw new HttpError(413, "Too large.");
  const text = await req.text();
  if (text.length > max) throw new HttpError(413, "Too large.");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Bad JSON.");
  }
}

function sniff(bytes: Uint8Array): string | null {
  const b = bytes;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

async function log(env: Env, courseId: string, version: number, actor: string, action: string, note = "") {
  await env.DB.prepare("INSERT INTO review_log (id, course_id, version, actor_id, action, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(rid(), courseId, version, actor, action, note.slice(0, 1000), now())
    .run();
}

// ---------- live rooms ----------

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

async function createRoom(req: Request, env: Env, presentation = false): Promise<Response> {
  const ip = await sha256(`live:${req.headers.get("CF-Connecting-IP") ?? "local"}:${new Date().toISOString().slice(0, 10)}`);
  const hour = new Date(Date.now() - 3600_000).toISOString();
  const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM live_rooms WHERE ip_hash = ? AND created_at > ?").bind(ip, hour).first<{ n: number }>();
  if ((n?.n ?? 0) >= 30) throw new HttpError(429, "Too many rooms opened from here in the last hour.");
  const token = b64url(crypto.getRandomValues(new Uint8Array(24)));
  for (let tries = 0; tries < 6; tries++) {
    const bytes = crypto.getRandomValues(new Uint8Array(6));
    const code = [...bytes].map((b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
    const res = await env.LIVE.get(env.LIVE.idFromName(presentation ? `presentation:${code}` : code)).fetch(presentation ? "https://room/presentation-init" : "https://room/init", {
      method: "POST",
      body: JSON.stringify({ tokenHash: await liveHash(token) }),
    });
    if (res.ok) {
      await env.DB.prepare("INSERT INTO live_rooms (ip_hash, created_at) VALUES (?, ?)").bind(ip, now()).run();
      await env.DB.prepare("DELETE FROM live_rooms WHERE created_at < ?").bind(new Date(Date.now() - 86400_000).toISOString()).run();
      return json({ code, token, joinUrl: `${env.APP_ORIGIN}/?${presentation ? "presentation" : "live"}=${code}` }, 201);
    }
  }
  throw new HttpError(503, "Couldn't open a room; try again.");
}

// ---------- router ----------

async function route(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const p = url.pathname.replace(/\/+$/, "") || "/";
  const m = (re: RegExp) => p.match(re);
  const method = req.method;

  // Signed-in, state-changing calls must come from the app (CSRF guard; JSON forces a preflight).
  // Live rooms: hosted from the desktop app (no account), joined from any browser.
  if (p === "/live/rooms" && method === "POST") return createRoom(req, env);
  if (p === "/presentation/rooms" && method === "POST") return createRoom(req, env, true);
  const presentationRoom = m(/^\/presentation\/rooms\/([A-Z0-9]{6})\/ws$/);
  if (presentationRoom && method === "GET") return env.LIVE.get(env.LIVE.idFromName(`presentation:${presentationRoom[1]}`)).fetch(req);
  if (p.startsWith("/presentation/rooms/")) throw new HttpError(404, "No presentation room with that code.");
  let lr = m(/^\/live\/rooms\/([A-Z0-9]{6})\/ws$/);
  if (lr && method === "GET") return env.LIVE.get(env.LIVE.idFromName(lr[1])).fetch(req);
  lr = m(/^\/live\/rooms\/([^/]+)\/ws$/);
  if (lr) throw new HttpError(404, "No room with that code.");

  if (method !== "GET" && method !== "HEAD" && !p.startsWith("/courses/")) {
    const origin = req.headers.get("Origin") ?? "";
    if (!origins(env).includes(origin)) throw new HttpError(403, "Bad origin.");
  }

  // Public
  if (method === "GET" && p === "/catalog") {
    const rows = await env.DB.prepare(
      "SELECT c.*, u.display_name AS author, u.last_seen_at AS author_seen FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.status = 'published' AND u.banned = 0 ORDER BY c.published_at DESC LIMIT 1000",
    ).all<CourseRow & { author: string }>();
    return json({ format: "erudior-community-catalog", version: 1, courses: rows.results.map(publicCourse) }, 200, { "Cache-Control": "public, max-age=60" });
  }
  let r = m(/^\/courses\/([\w-]+)$/);
  if (method === "GET" && r) {
    const c = await env.DB.prepare(
      "SELECT c.*, u.display_name AS author, u.last_seen_at AS author_seen FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.id = ? AND u.banned = 0",
    )
      .bind(r[1])
      .first<CourseRow & { author: string }>();
    if (!c || c.status !== "published") throw new HttpError(c?.status === "removed" ? 410 : 404, "This course isn't available.");
    const obj = await env.FILES.get(`courses/${c.id}.v${c.version}.json`);
    if (!obj) throw new HttpError(404, "This course isn't available.");
    return json({ ...publicCourse(c), doc: JSON.parse(await obj.text()) }, 200, { "Cache-Control": "public, max-age=60" });
  }
  r = m(/^\/images\/([\w-]+)$/);
  if (method === "GET" && r) {
    const obj = await env.FILES.get(`images/${r[1]}`);
    if (!obj) throw new HttpError(404, "Not found.");
    return new Response(obj.body, {
      headers: {
        "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  }
  r = m(/^\/courses\/([\w-]+)\/report$/);
  if (method === "POST" && r) {
    const body = await readJson<{ reason?: string; details?: string }>(req, 8000);
    const reasons = ["Wrong or misleading", "Inappropriate for students", "Copied without permission", "Contains personal information", "Spam", "Other"];
    if (!body.reason || !reasons.includes(body.reason)) throw new HttpError(400, "Pick a reason.");
    const c = await env.DB.prepare("SELECT id, version FROM courses WHERE id = ? AND status = 'published'").bind(r[1]).first<{ id: string; version: number }>();
    if (!c) throw new HttpError(404, "Course not found.");
    const ip = await sha256(`${req.headers.get("CF-Connecting-IP") ?? "local"}:${new Date().toISOString().slice(0, 10)}`);
    const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM reports WHERE ip_hash = ? AND created_at > ?")
      .bind(ip, new Date(Date.now() - 86400_000).toISOString())
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= 10) throw new HttpError(429, "Too many reports today.");
    const u = await currentUser(req, env);
    await env.DB.prepare("INSERT INTO reports (id, course_id, version, reason, details, reporter_id, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(rid(), c.id, c.version, body.reason, (body.details ?? "").slice(0, 2000), u?.id ?? null, ip, now())
      .run();
    return json({ ok: true }, 201);
  }

  // Sign-in
  r = m(/^\/auth\/(google|github)\/(start|callback)$/);
  if (method === "GET" && r) return r[2] === "start" ? oauthStart(req, env, r[1] as "google") : oauthCallback(req, env, r[1] as "google");
  if (method === "GET" && p === "/auth/dev") return devLogin(req, env);
  if (method === "POST" && p === "/auth/logout") {
    const token = cookies(req)[SESSION_COOKIE];
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": setCookie(env, SESSION_COOKIE, "", 0) });
  }
  if (method === "GET" && p === "/me") {
    const u = await currentUser(req, env);
    if (u) await seen(env, u.id);
    const current = !!u?.accepted_at && (u.terms_version ?? 0) >= TERMS_VERSION;
    return json({
      user: u && { id: u.id, name: u.display_name, role: u.role, accepted: current, termsChanged: !!u.accepted_at && !current, provider: u.provider },
      providers: { google: !!env.GOOGLE_CLIENT_ID, github: !!env.GITHUB_CLIENT_ID, dev: env.DEV_LOGIN === "1" },
    });
  }
  if (method === "POST" && p === "/me/accept") {
    const u = await needUser(req, env, false);
    const body = await readJson<{ adult?: boolean; terms?: boolean }>(req, 1000);
    if (body.adult !== true || body.terms !== true) throw new HttpError(400, "Both boxes are required.");
    await env.DB.prepare("UPDATE users SET accepted_at = ?, terms_version = ? WHERE id = ?").bind(now(), TERMS_VERSION, u.id).run();
    return json({ ok: true });
  }
  if (method === "PUT" && p === "/me") {
    const u = await needUser(req, env, false);
    const body = await readJson<{ name?: string }>(req, 1000);
    const name = (body.name ?? "").trim().slice(0, 60);
    if (!name) throw new HttpError(400, "Enter a name.");
    await env.DB.prepare("UPDATE users SET display_name = ? WHERE id = ?").bind(name, u.id).run();
    return json({ ok: true });
  }

  // Authors
  if (method === "GET" && p === "/mine") {
    const u = await needUser(req, env);
    const rows = await env.DB.prepare(
      "SELECT c.*, (SELECT COUNT(*) FROM reports r WHERE r.course_id = c.id AND r.resolved_at IS NULL) AS open_reports FROM courses c WHERE owner_id = ? OR id IN (SELECT course_id FROM course_editors WHERE user_id = ?) ORDER BY updated_at DESC",
    )
      .bind(u.id, u.id)
      .all<CourseRow & { open_reports: number }>();
    return json({
      courses: rows.results.map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        version: c.version,
        review: tag(c),
        reviewNote: c.review_note,
        updated: c.updated_at,
        openReports: c.open_reports,
        role: c.owner_id === u.id ? "owner" : "editor",
      })),
    });
  }
  if (method === "POST" && p === "/drafts") {
    const u = await needUser(req, env);
    const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM courses WHERE owner_id = ?").bind(u.id).first<{ n: number }>();
    if ((n?.n ?? 0) >= 50) throw new HttpError(429, "You have 50 courses; delete one first.");
    const id = rid(10).toLowerCase();
    const doc = emptyDoc();
    await env.DB.prepare("INSERT INTO courses (id, owner_id, draft, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, u.id, JSON.stringify(doc), doc.title, now(), now())
      .run();
    return json({ id }, 201);
  }
  r = m(/^\/drafts\/([\w-]+)$/);
  if (r && method === "GET") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1]);
    return json({
      id: c.id,
      status: c.status,
      version: c.version,
      review: tag(c),
      reviewNote: c.review_note,
      role: c.owner_id === u.id ? "owner" : u.role === "admin" ? "admin" : "editor",
      doc: upgradeDoc(JSON.parse(c.draft)),
    });
  }
  if (r && method === "PUT") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1]);
    if (c.status === "removed") throw new HttpError(403, "This course was taken down; contact the reviewers.");
    const doc = upgradeDoc(await readJson<CommunityDoc>(req));
    const errs = checkDoc(doc, false, { communityImageOrigin: env.API_ORIGIN });
    if (errs.length) return json({ error: errs[0], errors: errs }, 400);
    await env.DB.prepare("UPDATE courses SET draft = ?, title = CASE WHEN version = 0 THEN ? ELSE title END, updated_at = ? WHERE id = ?")
      .bind(JSON.stringify(doc), doc.title.trim() || "Untitled course", now(), c.id)
      .run();
    return json({ ok: true });
  }
  if (r && method === "DELETE") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1], true);
    await env.DB.prepare("DELETE FROM courses WHERE id = ?").bind(c.id).run();
    return json({ ok: true });
  }
  r = m(/^\/drafts\/([\w-]+)\/(publish|unpublish)$/);
  if (r && method === "POST") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1]);
    if (c.status === "removed") throw new HttpError(403, "This course was taken down; contact the reviewers.");
    if (r[2] === "unpublish") {
      await env.DB.prepare("UPDATE courses SET status = 'unpublished', updated_at = ? WHERE id = ?").bind(now(), c.id).run();
      return json({ ok: true });
    }
    const doc = upgradeDoc(JSON.parse(c.draft) as CommunityDoc);
    const errs = checkDoc(doc, true, { communityImageOrigin: env.API_ORIGIN });
    if (errs.length) return json({ error: errs[0], errors: errs }, 400);
    const ids = imageIds(doc, env.API_ORIGIN);
    for (const id of ids) {
      const img = await env.DB.prepare("SELECT owner_id FROM images WHERE id = ?").bind(id).first<{ owner_id: string }>();
      // Pictures can come from the owner, any editor, or whoever is publishing.
      const fromTeam = img && (img.owner_id === c.owner_id || img.owner_id === u.id || (await isEditor(env, c.id, img.owner_id)));
      if (!fromTeam) return json({ error: "An image in this course is missing; upload it again." }, 400);
    }
    // Continuity is checked against the actual immutable published snapshot, never
    // the editable draft. Missing/corrupt release data must fail closed.
    if (c.version > 0) {
      const previousObject = await env.FILES.get(`courses/${c.id}.v${c.version}.json`);
      if (!previousObject) throw new HttpError(409, "The previous published version is unavailable; contact the administrators.");
      let previous: CommunityDoc;
      try { previous = upgradeDoc(await previousObject.json<CommunityDoc>()); }
      catch { throw new HttpError(409, "The previous published version is invalid; contact the administrators."); }
      if (checkDoc(previous, true, { communityImageOrigin: env.API_ORIGIN }).length) throw new HttpError(409, "The previous published version is invalid; contact the administrators.");
      const workRevisionErrors = communityWorkRevisionProblems(previous, doc, c.id, env.API_ORIGIN);
      if (workRevisionErrors.length) throw new HttpError(409, workRevisionErrors.join("; "));
      const branchingErrors=branchingRevisionProblems(previous.canonical?.course.branchingScenarios ?? previous.branchingScenarios ?? [],doc.canonical?.course.branchingScenarios ?? doc.branchingScenarios ?? []);
      const scientificErrors=scientificRevisionProblems(previous.canonical?.course.scientificWorkspaces ?? previous.scientificWorkspaces ?? [],doc.canonical?.course.scientificWorkspaces ?? doc.scientificWorkspaces ?? []);
      const advancedAssessmentErrors=advancedAssessmentRevisionProblems(previous.canonical?.course.advancedAssessments ?? previous.advancedAssessments ?? [],doc.canonical?.course.advancedAssessments ?? doc.advancedAssessments ?? []);
      if(branchingErrors.length)throw new HttpError(409,branchingErrors.join('; '));
      if(scientificErrors.length)throw new HttpError(409,scientificErrors.join('; '));
      if(advancedAssessmentErrors.length)throw new HttpError(409,advancedAssessmentErrors.join('; '));
      const next = new Map((doc.canonical?.course.spreadsheetAssignments ?? doc.spreadsheetAssignments ?? []).map(assignment => [assignment.id, assignment]));
      for (const assignment of previous.spreadsheetAssignments ?? []) {
        const current = next.get(assignment.id);
        if (!current || current.lessonId !== assignment.lessonId)
          throw new HttpError(409, "Published spreadsheet assignments cannot be removed or reassigned to another lesson.");
      }
    }
    const serialized = JSON.stringify(doc);
    let version = c.version + 1;
    // R2 evaluates If-None-Match atomically. Never overwrite (or delete) an
    // immutable object, including an orphan left by a failed D1 commit. Identical
    // bytes can be retried safely; differing orphan bytes consume a version slot.
    // Bounded contention fails explicitly rather than weakening the precondition.
    for (let attempt = 0; ; attempt++, version++) {
      if (attempt === 16) throw new HttpError(409, "Publication is busy; retry shortly.");
      const key = `courses/${c.id}.v${version}.json`;
      const written = await env.FILES.put(key, serialized, {
        onlyIf: new Headers({ "If-None-Match": "*" }),
        httpMetadata: { contentType: "application/json" },
      });
      if (written) break;
      const existing = await env.FILES.get(key);
      if (existing && await existing.text() === serialized) break;
    }
    // D1 commits only the snapshot we validated, and only if publication,
    // moderation, ownership and draft content have not changed in the meantime.
    // Recheck current account/session/role/editor access atomically as well: an
    // authorization snapshot taken before an R2 await may already be revoked.
    // A losing request leaves a recoverable unreferenced R2 object, not a corrupt
    // public version. Never reset review metadata on an unsuccessful commit.
    const committed = await env.DB.prepare(
      "UPDATE courses SET status = 'published', version = ?, title = ?, description = ?, subject = ?, level = ?, kind = ?, counts = ?, published_at = ?, updated_at = ? WHERE id = ? AND version = ? AND draft = ? AND status = ? AND owner_id = ? AND EXISTS (SELECT 1 FROM users actor JOIN sessions session ON session.user_id = actor.id WHERE actor.id = ? AND actor.banned = 0 AND actor.accepted_at IS NOT NULL AND actor.accepted_at != '' AND actor.terms_version >= ? AND session.token_hash = ? AND session.expires_at > ? AND (courses.owner_id = actor.id OR actor.role = 'admin' OR EXISTS (SELECT 1 FROM course_editors editor WHERE editor.course_id = courses.id AND editor.user_id = actor.id)))",
    )
      .bind(version, doc.title.trim(), doc.description.trim(), doc.subject, doc.level, doc.type ?? "Course", JSON.stringify(counts(doc)), now(), now(), c.id, c.version, c.draft, c.status, c.owner_id, u.id, TERMS_VERSION, await sha256(cookies(req)[SESSION_COOKIE]), now())
      .run();
    if (committed.meta.changes !== 1) throw new HttpError(409, "The course changed during publication. Reload and publish the saved draft again.");
    return json({ ok: true, version });
  }
  // Editors: the owner (or an admin) chooses who else may change the course.
  r = m(/^\/drafts\/([\w-]+)\/editors$/);
  if (r && method === "GET") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1]);
    const rows = await env.DB.prepare(
      "SELECT u.id, u.display_name AS name, e.created_at AS added FROM course_editors e JOIN users u ON u.id = e.user_id WHERE e.course_id = ? ORDER BY e.created_at",
    )
      .bind(c.id)
      .all();
    const owner = await env.DB.prepare("SELECT id, display_name AS name FROM users WHERE id = ?").bind(c.owner_id).first();
    return json({ owner, editors: rows.results });
  }
  if (r && method === "POST") {
    const u = await needUser(req, env);
    const c = await ownCourse(env, u, r[1], true);
    const body = await readJson<{ email?: string }>(req, 1000);
    const email = (body.email ?? "").trim().toLowerCase();
    if (!email.includes("@")) throw new HttpError(400, "Enter the email address they sign in with.");
    const who = await env.DB.prepare("SELECT * FROM users WHERE lower(email) = ? AND banned = 0").bind(email).first<User>();
    if (!who) throw new HttpError(404, "Nobody with that email has signed in to Erudior yet. Ask them to sign in once, then add them.");
    if (who.id === c.owner_id) throw new HttpError(400, "That's the course's owner.");
    const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM course_editors WHERE course_id = ?").bind(c.id).first<{ n: number }>();
    if ((n?.n ?? 0) >= 20) throw new HttpError(429, "A course can have up to 20 editors.");
    await env.DB.prepare("INSERT OR IGNORE INTO course_editors (course_id, user_id, added_by, created_at) VALUES (?, ?, ?, ?)").bind(c.id, who.id, u.id, now()).run();
    await log(env, c.id, c.version, u.id, "add_editor", who.display_name);
    return json({ ok: true, editor: { id: who.id, name: who.display_name } }, 201);
  }
  r = m(/^\/drafts\/([\w-]+)\/editors\/([\w-]+)$/);
  if (r && method === "DELETE") {
    const u = await needUser(req, env);
    // Owners and admins remove anyone; an editor can step down.
    const c = r[2] === u.id ? await ownCourse(env, u, r[1]) : await ownCourse(env, u, r[1], true);
    await env.DB.prepare("DELETE FROM course_editors WHERE course_id = ? AND user_id = ?").bind(c.id, r[2]).run();
    await log(env, c.id, c.version, u.id, "remove_editor", r[2]);
    return json({ ok: true });
  }
  // Take over a course whose owner hasn't signed in for a year.
  r = m(/^\/drafts\/([\w-]+)\/claim$/);
  if (r && method === "POST") {
    const u = await needUser(req, env);
    const c = await env.DB.prepare("SELECT c.*, u.last_seen_at AS author_seen FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.id = ?")
      .bind(r[1])
      .first<CourseRow & { author_seen: string | null }>();
    if (!c || c.status === "draft") throw new HttpError(404, "Course not found.");
    if (c.status === "removed") throw new HttpError(403, "This course was taken down.");
    if (c.owner_id === u.id) throw new HttpError(400, "It's already yours.");
    if (!claimable(c.author_seen)) throw new HttpError(403, "The author has signed in within the last year; ask them to add you as an editor.");
    await env.DB.prepare("UPDATE courses SET owner_id = ?, updated_at = ? WHERE id = ?").bind(u.id, now(), c.id).run();
    // The previous owner stays on as an editor, so they can still help if they come back.
    await env.DB.prepare("INSERT OR IGNORE INTO course_editors (course_id, user_id, added_by, created_at) VALUES (?, ?, ?, ?)").bind(c.id, c.owner_id, u.id, now()).run();
    await env.DB.prepare("DELETE FROM course_editors WHERE course_id = ? AND user_id = ?").bind(c.id, u.id).run();
    await log(env, c.id, c.version, u.id, "claim", `from ${c.owner_id}`);
    return json({ ok: true });
  }

  if (method === "POST" && p === "/images") {
    const u = await needUser(req, env);
    const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM images WHERE owner_id = ?").bind(u.id).first<{ n: number }>();
    if ((n?.n ?? 0) >= 500) throw new HttpError(429, "Image limit reached.");
    const bytes = new Uint8Array(await req.arrayBuffer());
    if (bytes.length > LIMITS.imageBytes) throw new HttpError(413, "Images can be up to 2 MB.");
    const mime = sniff(bytes);
    if (!mime || !IMAGE_TYPES.includes(mime)) throw new HttpError(415, "Use a PNG, JPEG, WebP or GIF image.");
    const id = rid(12).toLowerCase();
    await env.FILES.put(`images/${id}`, bytes, { httpMetadata: { contentType: mime } });
    await env.DB.prepare("INSERT INTO images (id, owner_id, mime, bytes, created_at) VALUES (?, ?, ?, ?, ?)").bind(id, u.id, mime, bytes.length, now()).run();
    return json({ id, url: `${env.API_ORIGIN}/images/${id}` }, 201);
  }

  // Review
  if (method === "GET" && p === "/review") {
    const u = await needUser(req, env);
    needRole(u, "reviewer", "admin");
    const waiting = await env.DB.prepare(
      "SELECT c.*, u.display_name AS author FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.status = 'published' AND c.reviewed_version < c.version ORDER BY c.published_at ASC LIMIT 200",
    ).all<CourseRow & { author: string }>();
    const reports = await env.DB.prepare(
      "SELECT r.id, r.course_id, r.version, r.reason, r.details, r.created_at, c.title FROM reports r JOIN courses c ON c.id = r.course_id WHERE r.resolved_at IS NULL ORDER BY r.created_at ASC LIMIT 200",
    ).all();
    const removed = await env.DB.prepare(
      "SELECT c.*, u.display_name AS author FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.status = 'removed' ORDER BY c.updated_at DESC LIMIT 50",
    ).all<CourseRow & { author: string }>();
    return json({ waiting: waiting.results.map(publicCourse), reports: reports.results, removed: removed.results.map(publicCourse) });
  }
  // Admin page: every published or taken-down course, newest first, with its tag.
  if (method === "GET" && p === "/review/all") {
    const u = await needUser(req, env);
    needRole(u, "reviewer", "admin");
    const q = `%${(url.searchParams.get("q") ?? "").slice(0, 80)}%`;
    const rows = await env.DB.prepare(
      "SELECT c.*, u.display_name AS author FROM courses c JOIN users u ON u.id = c.owner_id WHERE c.status IN ('published', 'removed', 'unpublished') AND (c.title LIKE ? OR u.display_name LIKE ?) ORDER BY c.published_at DESC LIMIT 500",
    )
      .bind(q, q)
      .all<CourseRow & { author: string }>();
    return json({ courses: rows.results.map((c) => ({ ...publicCourse(c), status: c.status, reviewNote: c.review_note })) });
  }
  r = m(/^\/review\/([\w-]+)$/);
  if (r && method === "POST") {
    const u = await needUser(req, env);
    needRole(u, "reviewer", "admin");
    const body = await readJson<{ action?: string; note?: string; version?: number }>(req, 4000);
    const c = await env.DB.prepare("SELECT * FROM courses WHERE id = ?").bind(r[1]).first<CourseRow>();
    if (!c) throw new HttpError(404, "Course not found.");
    const note = (body.note ?? "").slice(0, 1000);
    switch (body.action) {
      case "reviewed": {
        if (!Number.isSafeInteger(body.version) || body.version! < 1) throw new HttpError(400, "Specify the published version you reviewed.");
        if (c.status !== "published" || body.version !== c.version) throw new HttpError(409, "The published version changed; reload and review it again.");
        const reviewed = await env.DB.prepare("UPDATE courses SET reviewed_version = ?, reviewed_by = ?, reviewed_at = ?, review_note = ? WHERE id = ? AND version = ? AND status = 'published' AND EXISTS (SELECT 1 FROM users actor JOIN sessions session ON session.user_id = actor.id WHERE actor.id = ? AND actor.banned = 0 AND actor.accepted_at IS NOT NULL AND actor.accepted_at != '' AND actor.terms_version >= ? AND actor.role IN ('reviewer', 'admin') AND session.token_hash = ? AND session.expires_at > ?)")
          .bind(body.version, u.id, now(), note || null, c.id, body.version, u.id, TERMS_VERSION, await sha256(cookies(req)[SESSION_COOKIE]), now())
          .run();
        if (reviewed.meta.changes !== 1) throw new HttpError(409, "The course or your review access changed; reload before reviewing again.");
        break;
      }
      case "not_reviewed":
        await env.DB.prepare("UPDATE courses SET reviewed_version = 0, review_note = ? WHERE id = ?").bind(note || null, c.id).run();
        break;
      case "remove":
        if (!note) throw new HttpError(400, "Say why it's being taken down; the author sees it.");
        await env.DB.prepare("UPDATE courses SET status = 'removed', review_note = ?, updated_at = ? WHERE id = ?").bind(note, now(), c.id).run();
        break;
      case "restore":
        if (c.status !== "removed") throw new HttpError(400, "It isn't taken down.");
        await env.DB.prepare("UPDATE courses SET status = CASE WHEN version > 0 THEN 'published' ELSE 'draft' END, updated_at = ? WHERE id = ?")
          .bind(now(), c.id)
          .run();
        break;
      default:
        throw new HttpError(400, "Unknown action.");
    }
    await log(env, c.id, c.version, u.id, body.action, note);
    return json({ ok: true });
  }
  r = m(/^\/reports\/([\w-]+)\/resolve$/);
  if (r && method === "POST") {
    const u = await needUser(req, env);
    needRole(u, "reviewer", "admin");
    const body = await readJson<{ resolution?: string }>(req, 2000);
    await env.DB.prepare("UPDATE reports SET resolved_at = ?, resolved_by = ?, resolution = ? WHERE id = ?")
      .bind(now(), u.id, (body.resolution ?? "Resolved").slice(0, 500), r[1])
      .run();
    return json({ ok: true });
  }

  // Admin
  if (method === "GET" && p === "/admin/users") {
    const u = await needUser(req, env);
    needRole(u, "admin");
    const q = `%${(url.searchParams.get("q") ?? "").slice(0, 60)}%`;
    const rows = await env.DB.prepare(
      "SELECT id, provider, email, display_name, role, banned, created_at FROM users WHERE display_name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT 100",
    )
      .bind(q, q)
      .all();
    return json({ users: rows.results });
  }
  r = m(/^\/admin\/users\/([\w-]+)$/);
  if (r && method === "POST") {
    const u = await needUser(req, env);
    needRole(u, "admin");
    const body = await readJson<{ role?: Role; banned?: boolean }>(req, 1000);
    if (r[1] === u.id) throw new HttpError(400, "You can't change your own account here.");
    if (body.role && ["author", "reviewer", "admin"].includes(body.role)) await env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(body.role, r[1]).run();
    if (typeof body.banned === "boolean") {
      await env.DB.prepare("UPDATE users SET banned = ? WHERE id = ?").bind(body.banned ? 1 : 0, r[1]).run();
      if (body.banned) await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(r[1]).run();
    }
    return json({ ok: true });
  }

  throw new HttpError(404, "Not found.");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const p = new URL(req.url).pathname;
    // Isolated OIDC form_post handler; never relax community CSRF or identity rules.
    if (p === "/lti/login" || p === "/lti/launch") return handleLti(req, env);
    const pub = (req.method === "GET" && (p === "/catalog" || p.startsWith("/courses/") || p.startsWith("/images/"))) || p === "/live/rooms" || p === "/presentation/rooms";
    // WebSocket upgrades go straight to the room.
    if (req.headers.get("Upgrade") === "websocket") {
      try {
        return await route(req, env);
      } catch (e) {
        return new Response(e instanceof HttpError ? e.message : "Error", { status: e instanceof HttpError ? e.status : 500 });
      }
    }
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req, env, true) });
    let res: Response;
    try {
      res = await route(req, env);
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (!(e instanceof HttpError)) console.error(e);
      res = json({ error: e instanceof HttpError ? e.message : "Something went wrong." }, status);
    }
    // Redirects (OAuth) don't need CORS; everything else gets it.
    if (res.status >= 300 && res.status < 400) return res;
    const h = new Headers(res.headers);
    for (const [k, v] of Object.entries(cors(req, env, pub || p.endsWith("/report")))) h.set(k, v);
    return new Response(res.body, { status: res.status, headers: h });
  },
};
