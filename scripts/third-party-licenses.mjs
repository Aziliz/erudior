// Writes public/third-party-licenses.txt: the open-source packages Erudior ships, with their
// licenses. JavaScript: every production dependency (and their dependencies) with its license
// file. Rust (desktop app): every crate in Cargo.lock with its license, plus the full text of each
// distinct license once. Run after changing dependencies:
//   node scripts/third-party-licenses.mjs
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = [];
const pkgJson = (dir) => JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));

function findPkg(name, from) {
  for (let d = from; ; d = path.dirname(d)) {
    const p = path.join(d, "node_modules", name);
    if (existsSync(path.join(p, "package.json"))) return p;
    if (d === root || d === path.dirname(d)) return null;
  }
}

const licenseText = (dir) => {
  const f = readdirSync(dir).find((n) => /^(licen[cs]e|copying)(\.|$)/i.test(n));
  return f ? readFileSync(path.join(dir, f), "utf8").trim() : null;
};

// JavaScript
const seen = new Map();
const queue = Object.keys(pkgJson(root).dependencies).map((n) => [n, root]);
while (queue.length) {
  const [name, from] = queue.shift();
  const dir = findPkg(name, from);
  if (!dir || seen.has(dir)) continue;
  const pj = pkgJson(dir);
  seen.set(dir, pj);
  for (const dep of Object.keys(pj.dependencies ?? {})) queue.push([dep, dir]);
}
const js = [...seen.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name));
out.push("Erudior uses these open-source packages. Thank you to their authors.", "", "=".repeat(72), "JAVASCRIPT PACKAGES (app and website)", "=".repeat(72), "");
for (const [dir, pj] of js) {
  const lic = typeof pj.license === "string" ? pj.license : pj.license?.type ?? "see below";
  out.push(`${pj.name} ${pj.version} (${lic})${pj.homepage ? ` ${pj.homepage}` : ""}`);
  const text = licenseText(dir);
  out.push(text ? text.replace(/\r\n/g, "\n") : "(No license file in the package; license field above.)", "", "-".repeat(72), "");
}

// Rust
let crates = [];
try {
  const meta = JSON.parse(
    execFileSync("cargo", ["metadata", "--format-version", "1", "--locked"], { cwd: path.join(root, "src-tauri"), maxBuffer: 256 << 20, encoding: "utf8" }),
  );
  crates = meta.packages.filter((p) => p.source).sort((a, b) => a.name.localeCompare(b.name));
} catch (e) {
  console.error("cargo metadata failed; Rust crates left out:", e.message);
}
if (crates.length) {
  out.push("=".repeat(72), "RUST CRATES (desktop app)", "=".repeat(72), "");
  const texts = new Map();
  for (const c of crates) {
    out.push(`${c.name} ${c.version} (${c.license ?? "see repository"})${c.repository ? ` ${c.repository}` : ""}`);
    const dir = path.dirname(c.manifest_path);
    for (const f of existsSync(dir) ? readdirSync(dir) : []) {
      const m = /^licen[cs]e[-_.]?(mit|apache|bsd|zlib|unicode|mpl|isc)?/i.exec(f);
      if (!m) continue;
      const kind = (m[1] ?? c.license ?? "other").toUpperCase();
      if (!texts.has(kind)) texts.set(kind, readFileSync(path.join(dir, f), "utf8").trim());
    }
  }
  out.push("", "Each crate's own copyright notice is in its repository. Full text of the licenses used:", "");
  for (const [kind, text] of texts) out.push("-".repeat(72), kind, "-".repeat(72), text, "");
}

writeFileSync(path.join(root, "public", "third-party-licenses.txt"), out.join("\n") + "\n");
console.log(`${js.length} JavaScript packages, ${crates.length} Rust crates -> public/third-party-licenses.txt`);
