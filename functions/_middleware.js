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
  // Only page addresses: no file extensions, no snapshot folders themselves.
  if (!base || /\.[a-z0-9]+$/i.test(p) || p.startsWith("/__")) return next();
  // Course sub-pages (lessons, tabs) and other app screens use the plain app shell.
  if (base === "/__app" && p.split("/").length > 2) return next();
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
