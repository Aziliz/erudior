import { useEffect, useState } from "react";
import type { AppApi } from "../App";

const REPO = "Aziliz/examiner";
const RELEASES = `https://github.com/${REPO}/releases`;
export const BREW = "brew install --cask aziliz/erudior/erudior";

interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
}
interface Release {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: Asset[];
}

type Os = "windows" | "mac" | "linux" | "other";

function detectOs(): Os {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "mac";
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return "other";
}

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(0)} MB`;
const find = (r: Release | null, re: RegExp) => r?.assets.find((a) => re.test(a.name));

/** The desktop app: installers from the latest GitHub release (website only). */
export default function DownloadPage({ api }: { api: AppApi }) {
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const os = detectOs();

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status === 404 ? "No release has been published yet." : `GitHub said ${r.status}.`))))
      .then(setRelease, (e) => setError((e as Error).message));
  }, []);

  const exe = find(release, /-setup\.exe$/i) ?? find(release, /\.exe$/i);
  const msi = find(release, /\.msi$/i);
  const deb = find(release, /\.deb$/i);
  const rpm = find(release, /\.rpm$/i);
  const appimage = find(release, /\.AppImage$/i);
  const dmg = find(release, /universal\.dmg$/i) ?? find(release, /\.dmg$/i);

  const link = (a: Asset | undefined, label: string, primary = false) =>
    a ? (
      <a className={`btn${primary ? " primary" : ""}`} href={a.browser_download_url}>
        {label} <span className="small">({mb(a.size)})</span>
      </a>
    ) : (
      <span className="btn" aria-disabled="true" title="Not in the current release yet">
        {label} <span className="small">(coming soon)</span>
      </span>
    );

  const platforms: { id: Os; title: string; body: React.ReactNode }[] = [
    {
      id: "windows",
      title: "Windows",
      body: (
        <>
          <div className="row">
            {link(exe, "Download .exe", os === "windows")}
            {msi && link(msi, ".msi")}
          </div>
          <p className="small muted">
            Windows 10 or 11{msi ? " (the .msi is for IT departments)" : ""}. Windows may warn that the publisher is unknown: choose <b>More info</b>, then <b>Run anyway</b>.
          </p>
        </>
      ),
    },
    {
      id: "mac",
      title: "macOS",
      body: (
        <>
          <p className="small">With Homebrew:</p>
          <div className="row code-row">
            <code className="install-cmd">{BREW}</code>
            <button
              className="btn sm"
              onClick={() => {
                navigator.clipboard?.writeText(BREW).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                });
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="small">Or download the disk image:</p>
          <div className="row">{link(dmg, "Download .dmg", os === "mac")}</div>
          <p className="small muted">
            macOS 10.15 or later, Apple silicon or Intel. The app isn't notarized by Apple yet, so the first time, right-click Erudior in Applications and
            choose <b>Open</b>.
          </p>
        </>
      ),
    },
    {
      id: "linux",
      title: "Linux",
      body: (
        <>
          <div className="row">
            {link(deb, "Download .deb", os === "linux")}
            {link(rpm, "Download .rpm")}
            {appimage && link(appimage, "AppImage")}
          </div>
          <p className="small muted">
            .deb for Debian, Ubuntu and Mint; .rpm for Fedora, RHEL and openSUSE{appimage ? "; the AppImage runs on most others" : ""}. Install with <code>sudo apt install ./Erudior_*.deb</code> or <code>sudo dnf install ./Erudior-*.rpm</code>. 64-bit x86 only.
          </p>
        </>
      ),
    },
  ];
  const order = [...platforms].sort((a, b) => (a.id === os ? -1 : b.id === os ? 1 : 0));

  return (
    <div className="page download">
      <div className="page-head">
        <h1>Download Erudior</h1>
        <p>
          The desktop app has every course, works offline, and adds homeschool and classroom tools: students, attendance, grades, report cards,
          transcripts and portfolios. Everything stays on your computer.
        </p>
        <p className="small muted">
          {release ? (
            <>
              Version {release.tag_name.replace(/^v/, "")}, released {new Date(release.published_at).toLocaleDateString()} ·{" "}
              <a href={release.html_url}>Release notes</a>
            </>
          ) : error ? (
            <>
              {error} See <a href={RELEASES}>all releases on GitHub</a>.
            </>
          ) : (
            "Finding the latest version…"
          )}
        </p>
      </div>
      <div className="download-grid">
        {order.map((p) => (
          <section key={p.id} className={`download-card${p.id === os ? " current" : ""}`} aria-labelledby={`dl-${p.id}`}>
            <h2 id={`dl-${p.id}`}>
              {p.title}
              {p.id === os && <span className="pill neutral">Your computer</span>}
            </h2>
            {p.body}
          </section>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 24 }}>
        Just want to study? You don't need to install anything:{" "}
        <a
          href="/courses"
          onClick={(e) => {
            e.preventDefault();
            api.go({ name: "library" });
          }}
        >
          browse the courses here
        </a>
        .
      </p>
    </div>
  );
}
