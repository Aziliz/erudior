// Writes public/sitemap.xml from samples/catalog.json: the site's pages and each catalog course's
// overview on app.erudior.com (same slugs as lib/util.ts slugify). Run after syncing courses from
// the private course repo (its scripts/sync-to-app.sh does), and in the website deploy.
//   node scripts/sitemap.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(readFileSync(path.join(root, "samples", "catalog.json"), "utf8"));
const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "bank";
const urls = [
  ...["/", "/community", "/roadmap", "/download", "/terms", "/privacy"].map((p) => `https://erudior.com${p}`),
  ...catalog.map((e) => `https://app.erudior.com/${slug(e.title)}`),
];
writeFileSync(
  path.join(root, "public", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>\n`).join("")}</urlset>\n`,
);
console.log(`${urls.length} addresses -> public/sitemap.xml`);
