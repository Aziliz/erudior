import { validateImageAsset } from "./imageAssets";
// Talking to the community course API (worker/). Builds with VITE_COMMUNITY_API set show
// community courses in the Library; the web build also has the course editor and review queue.

import type { CommunityDoc, CommunityMeta } from "./communityFormat";
import { checkDoc, imageIds, toCourse, upgradeDoc } from "./communityFormat";
import { inApp } from "./storage";

export const API = (import.meta.env?.VITE_COMMUNITY_API ?? "").trim().replace(/\/+$/, "");
export const COMMUNITY = API !== "";
/** Writing and reviewing happen on the website, where sign-in cookies work. */
export const AUTHORING = COMMUNITY && !inApp;

export type Review = "reviewed" | "not_reviewed";

export interface CommunityEntry {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  /** "Course" or "Exam prep" (older API versions leave it out). */
  type?: string;
  author: string;
  version: number;
  review: Review;
  counts: { lessons: number; questions: number; cards: number };
  updated: string | null;
  /** The author hasn't signed in for a year: another author may take the course over. */
  claimable?: boolean;
}

export interface Me {
  /** `accepted`: agreed to the current community terms; `termsChanged`: agreed to an older version. */
  user: { id: string; name: string; role: "author" | "reviewer" | "admin"; accepted: boolean; termsChanged?: boolean; provider: string } | null;
  providers: { google: boolean; github: boolean; dev: boolean };
}

export interface MyCourse {
  id: string;
  title: string;
  status: "draft" | "published" | "unpublished" | "removed";
  version: number;
  review: Review;
  reviewNote: string | null;
  updated: string;
  openReports: number;
  /** Older servers leave it out (then it's the owner). */
  role?: "owner" | "editor";
}

export interface Editors {
  owner: { id: string; name: string } | null;
  editors: { id: string; name: string; added: string }[];
}

export interface ReviewQueue {
  waiting: CommunityEntry[];
  reports: { id: string; course_id: string; version: number; reason: string; details: string; created_at: string; title: string }[];
  removed: CommunityEntry[];
}

export const REPORT_REASONS = [
  "Wrong or misleading",
  "Inappropriate for students",
  "Copied without permission",
  "Contains personal information",
  "Spam",
  "Other",
];

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: string[] = [],
  ) {
    super(message);
  }
}

/** `pub`: a public call, sent without cookies (works from the desktop app, whose origin isn't on the API's list). */
async function call<T>(method: string, path: string, body?: unknown, raw?: Blob, pub = false): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API + path, {
      method,
      credentials: pub ? "omit" : "include",
      cache: "no-cache",
      headers: body !== undefined ? { "Content-Type": "application/json" } : raw ? { "Content-Type": raw.type || "application/octet-stream" } : {},
      body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Couldn't reach the community site. Check your connection.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: string[] };
  if (!res.ok) throw new ApiError(data.error ?? `Request failed (${res.status}).`, res.status, data.errors ?? []);
  return data as T;
}

export const api = {
  catalog: () => call<{ courses: CommunityEntry[] }>("GET", "/catalog", undefined, undefined, true).then((r) => r.courses),
  course: (id: string) => call<CommunityEntry & { doc: CommunityDoc }>("GET", `/courses/${id}`, undefined, undefined, true),
  report: (id: string, reason: string, details: string) => call("POST", `/courses/${id}/report`, { reason, details }, undefined, true),
  me: () => call<Me>("GET", "/me"),
  signInUrl: (provider: "google" | "github" | "dev", ret: string, name?: string, role?: string) =>
    provider === "dev"
      ? `${API}/auth/dev?return=${encodeURIComponent(ret)}${name ? `&name=${encodeURIComponent(name)}` : ""}${role ? `&role=${role}` : ""}`
      : `${API}/auth/${provider}/start?return=${encodeURIComponent(ret)}`,
  logout: () => call("POST", "/auth/logout"),
  accept: () => call("POST", "/me/accept", { adult: true, terms: true }),
  rename: (name: string) => call("PUT", "/me", { name }),
  mine: () => call<{ courses: MyCourse[] }>("GET", "/mine").then((r) => r.courses),
  create: () => call<{ id: string }>("POST", "/drafts").then((r) => r.id),
  draft: (id: string) =>
    call<{ id: string; status: MyCourse["status"]; version: number; review: Review; reviewNote: string | null; role?: "owner" | "editor" | "admin"; doc: CommunityDoc }>(
      "GET",
      `/drafts/${id}`,
    ),
  editors: (id: string) => call<Editors>("GET", `/drafts/${id}/editors`),
  addEditor: (id: string, email: string) => call("POST", `/drafts/${id}/editors`, { email }),
  removeEditor: (id: string, userId: string) => call("DELETE", `/drafts/${id}/editors/${userId}`),
  claim: (id: string) => call("POST", `/drafts/${id}/claim`),
  save: (id: string, doc: CommunityDoc) => call("PUT", `/drafts/${id}`, doc),
  publish: (id: string) => call<{ version: number }>("POST", `/drafts/${id}/publish`),
  unpublish: (id: string) => call("POST", `/drafts/${id}/unpublish`),
  remove: (id: string) => call("DELETE", `/drafts/${id}`),
  upload: (file: Blob) => call<{ id: string; url: string }>("POST", "/images", undefined, file),
  queue: () => call<ReviewQueue>("GET", "/review"),
  allCourses: (q = "") =>
    call<{ courses: (CommunityEntry & { status: "published" | "removed" | "unpublished"; reviewNote: string | null })[] }>("GET", `/review/all?q=${encodeURIComponent(q)}`),
  review: (id: string, action: "reviewed" | "not_reviewed" | "remove" | "restore", note: string, version?: number) => call("POST", `/review/${id}`, { action, note, version }),
  resolve: (id: string, resolution: string) => call("POST", `/reports/${id}/resolve`, { resolution }),
  users: (q: string) => call<{ users: { id: string; provider: string; email: string | null; display_name: string; role: string; banned: number }[] }>("GET", `/admin/users?q=${encodeURIComponent(q)}`),
  setUser: (id: string, change: { role?: string; banned?: boolean }) => call("POST", `/admin/users/${id}`, change),
};

export const imageUrl = (id: string) => `${API}/images/${id}`;

export async function resolveCommunityImageDataUrl(id: string): Promise<string> {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw new Error("Invalid community image ID.");
  const res = await fetch(imageUrl(id), { redirect: "error" });
  if (!res.ok) throw new Error(`An image in this course couldn't be downloaded (${res.status}).`);
  const reader=res.body?.getReader();let blob:Blob;
  if(reader){const chunks:Uint8Array<ArrayBuffer>[]=[];let bytes=0;
    try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>2*1024*1024)throw Error("A community image exceeds the asset size limit.");chunks.push(new Uint8Array(value));}}
    catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
    blob=new Blob(chunks,{type:res.headers.get("content-type")??""});
  }else blob=await res.blob();
  if (blob.size > 2 * 1024 * 1024) throw new Error("A community image exceeds the asset size limit.");
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { const value=String(r.result);const errors=validateImageAsset(value);if(errors.length)reject(new Error("A community image is invalid: "+errors.join("; ")));else resolve(value); };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** Download a community course and build an app course, with images embedded for offline use. */
export async function downloadCommunityCourse(id: string): Promise<Record<string, unknown>> {
  const c = await api.course(id);
  // A server response is an untrusted import boundary. Validate before image
  // downloads or conversion, which otherwise may silently omit unsupported data.
  // Upgrade only historically supported labels; this does not repair invalid content.
  let doc: CommunityDoc;
  let errors: string[];
  try {
    doc = upgradeDoc(c?.doc);
    errors = checkDoc(doc, true, { communityImageOrigin: API || undefined });
  } catch {
    throw new ApiError("This community course could not be installed because its document is malformed.", 422);
  }
  if (errors.length) throw new ApiError("This community course could not be installed because its document is invalid.", 422, errors);
  const images = new Map<string, string>();
  for (const img of imageIds(doc, API)) images.set(img, await resolveCommunityImageDataUrl(img));
  const meta: CommunityMeta = { id: c.id, version: c.version, review: c.review, author: c.author };
  return toCourse(doc, meta, (img) => images.get(img) ?? "", API);
}

export const isCommunityId = (courseId: string) => courseId.startsWith("community-");
export const REVIEW_LABEL: Record<Review, string> = { reviewed: "Reviewed", not_reviewed: "Not reviewed" };
export const REVIEW_HELP: Record<Review, string> = {
  reviewed: "An Erudior reviewer checked this version.",
  not_reviewed: "Made by a community member and not checked yet. Report anything wrong.",
};
