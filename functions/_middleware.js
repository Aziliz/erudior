import { GITHUB_COURSE_FEED } from "../src/lib/githubCourseFeed.ts";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys.ts";
import { verifySignature } from "../src/lib/courseSign.ts";

const appPages = new Set(["courses", "community", "workspace", "progress", "search", "create", "review", "admin", "live", "presentation", "parent", "terms", "privacy", "download", "licenses", "engine-license", "classroom-workflows", "programs", "roadmap"]);
let previews;
async function findPreview(slug) {
  if (!previews || Date.now() >= previews.expires) {
    const response = await fetch(GITHUB_COURSE_FEED + "catalog.signed.json", { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return;
    const { text, sig } = await response.json();
    if (typeof text !== "string" || !verifySignature(new TextEncoder().encode(text), sig, COURSE_PUBLIC_KEYS)) return;
    const catalog = JSON.parse(text);
    if (catalog.format !== "examiner-catalog" || catalog.version !== 1) return;
    const entries = new Map();
    const courses = catalog.courses.filter(e => !e.platform || e.platform === "study");
    for (const e of courses) entries.set(e.id, e);
    for (const e of courses) {
      const titleSlug = e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "bank";
      if (!entries.has(titleSlug)) entries.set(titleSlug, e);
    }
    previews = { entries, expires: Date.now() + 60000 };
  }
  return previews.entries.get(slug);
}

function coursePreview(request, shell, course) {
  const title = course.title + " · Erudior";
  const canonical = new URL(request.url);
  canonical.search = "";
  const transform = new HTMLRewriter()
    .on("title", { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"], meta[property="og:description"]', { element(el) { el.setAttribute("content", course.description || title); } })
    .on('meta[property="og:title"]', { element(el) { el.setAttribute("content", title); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute("content", canonical.href); } })
    .on("head", { element(el) { el.append('<link rel="canonical" href="' + canonical.origin + canonical.pathname + '">', { html: true }); } })
    .on("noscript h1", { element(el) { el.setInnerContent(course.title); } })
    .on("noscript p", { element(el) { el.setInnerContent(course.description || "Open this course in Erudior."); } });
  const preview = transform.transform(shell);
  const headers = new Headers(preview.headers);
  headers.delete("ETag");
  headers.delete("Content-Length");
  headers.set("Cache-Control", "public, max-age=60");
  return new Response(request.method === "HEAD" ? null : preview.body, { headers });
}

// Cloudflare Pages middleware: serves the prerendered HTML (scripts/prerender.mjs) for page
// addresses, chosen by host name, so search engines and link previews see real content.
// erudior.com/<page> -> /__site/<page>/index.html; app.erudior.com/<page> -> /__app/<page>/index.html.
// Anything else (files, API-like paths, pages without a snapshot) is served as before.
export async function onRequest({ request, env, next }) {
  if (request.method !== "GET" && request.method !== "HEAD") return next();
  const url = new URL(request.url);
  const host = url.hostname;
  const base = host === "erudior.com" || host === "www.erudior.com" ? "/__site" : host === "app.erudior.com" ? "/__app" : null;
  const p = url.pathname.replace(/\/+$/, "") || "/";
  if (base && p === "/sitemap.xml") {
    try {
      const map = await fetch(GITHUB_COURSE_FEED + "sitemap.xml", { method: request.method, signal: AbortSignal.timeout(4000) });
      if (map.ok) return new Response(map.body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
    } catch { /* Use the last sitemap deployed with the engine while GitHub is unreachable. */ }
    return next();
  }
  // Pages may serve the SPA shell for missing files. Module requests require a real asset.
  if (base && p.startsWith("/assets/")) {
    const response = await next();
    if (response.ok && (response.headers.get("content-type") ?? "").includes("text/html")) {
      return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    return response;
  }
  // Only page addresses: no file extensions, no snapshot folders themselves.
  if (!base || /\.[a-z0-9]+$/i.test(p) || p.startsWith("/__")) return next();
  // Course sub-pages (lessons, tabs) and other app screens use the plain app shell.
  if (base === "/__app" && p.split("/").length > 2) return next();
  if (base === "/__app" && /^\/[A-Za-z0-9_-]+$/.test(p) && !appPages.has(p.slice(1))) {
    try {
      const course = await findPreview(p.slice(1));
      if (course) {
        const shell = await env.ASSETS.fetch(new URL("/", url));
        if (shell.ok) return coursePreview(request, shell, course);
      }
    } catch { /* The client can still open its cached catalog. */ }
    return next();
  }
  // The folder address ("/__site/download/") serves its index.html without a pretty-URL redirect.
  const res = await env.ASSETS.fetch(new Request(new URL(`${base}${p === "/" ? "" : p}/`, url), request));
  if (res.ok && (res.headers.get("content-type") ?? "").includes("text/html")) {
    const body = await res.text();
    // Pages answers unknown paths with the app shell; only use a real snapshot.
    if (body.includes('rel="canonical"')) {
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
    }
  }
  return next();
}
