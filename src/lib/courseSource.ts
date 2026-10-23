// Downloading courses from the website (builds with VITE_COURSES_URL).
//
// The site serves catalog.json, its Ed25519 signature catalog.json.sig, and one file per
// course revision. The app trusts a catalog only if the signature checks out against a key
// in courseKeys.ts, and a course file only if its SHA-256 matches the signed catalog. The
// last good catalog is cached so the app works offline; installed courses are stored locally.

import type { CatalogEntry } from "./catalog";
import { COURSE_PUBLIC_KEYS } from "./courseKeys";
import { sha256Hex, verifySignature } from "./courseSign";

const BASE = import.meta.env?.VITE_COURSES_URL?.trim() || "";
export const REMOTE = BASE !== "";

const DEV_KEY = typeof __DEV_COURSE_KEY__ === "string" ? __DEV_COURSE_KEY__ : "";
const KEYS = import.meta.env?.DEV && DEV_KEY ? [...COURSE_PUBLIC_KEYS, DEV_KEY] : COURSE_PUBLIC_KEYS;
const CACHE_KEY = "examiner.catalog.v1";

const url = (file: string) => new URL(file, new URL(BASE, globalThis.location?.href ?? "http://localhost/")).toString();

async function fetchBytes(file: string, timeoutMs: number): Promise<Uint8Array> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url(file), { signal: ctl.signal, cache: "no-cache" });
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

interface Published {
  format: "examiner-catalog";
  version: number;
  courses: CatalogEntry[];
}

/** Parse a catalog after checking its signature; throws if it isn't trusted. */
export function openCatalog(bytes: Uint8Array, sig: string, keys = KEYS): CatalogEntry[] {
  if (!keys.length) throw new Error("This build has no course signing key.");
  if (!verifySignature(bytes, sig, keys)) throw new Error("The course catalog's signature didn't check out.");
  const data = JSON.parse(new TextDecoder().decode(bytes)) as Published;
  if (data.format !== "examiner-catalog" || !Array.isArray(data.courses)) throw new Error("Unrecognized course catalog.");
  return data.courses;
}

function readCache(): CatalogEntry[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { text, sig } = JSON.parse(raw) as { text: string; sig: string };
    return openCatalog(new TextEncoder().encode(text), sig);
  } catch {
    return null;
  }
}

export type CatalogSource = "bundled" | "website" | "saved";

/**
 * Get the newest trusted catalog: from the website, else the last one saved on this device.
 * Returns null in bundled builds or when neither is available (the bundled snapshot stays).
 */
export async function fetchCatalog(timeoutMs = 8000): Promise<{ entries: CatalogEntry[]; source: CatalogSource; error?: string } | null> {
  if (!REMOTE) return null;
  try {
    const [bytes, sigBytes] = await Promise.all([fetchBytes("catalog.json", timeoutMs), fetchBytes("catalog.json.sig", timeoutMs)]);
    const sig = new TextDecoder().decode(sigBytes).trim();
    const entries = openCatalog(bytes, sig);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ text: new TextDecoder().decode(bytes), sig }));
    } catch {
      /* no storage: the catalog is just fetched again next time */
    }
    return { entries, source: "website" };
  } catch (e) {
    const saved = readCache();
    const error = e instanceof Error ? e.message : String(e);
    return saved ? { entries: saved, source: "saved", error } : null;
  }
}

/** Download one course file and check it against the signed catalog's hash. */
export async function downloadCourse(entry: CatalogEntry): Promise<unknown> {
  if (!entry.sha256) throw new Error("Connect to the internet to download this course.");
  const bytes = await fetchBytes(entry.file, 60000);
  if ((await sha256Hex(bytes)) !== entry.sha256) throw new Error("The downloaded course didn't match the catalog; try again later.");
  return JSON.parse(new TextDecoder().decode(bytes));
}
