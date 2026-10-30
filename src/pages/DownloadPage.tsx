import { useEffect, useState } from "react";
import { appUrl } from "../lib/site";

const REPO = "Aziliz/erudior";
const RELEASES = `https://github.com/${REPO}/releases`;
// This exact release asset is published and stable. Keep the button available
// even when GitHub\'s API is temporarily unavailable to the visitor.
export const ANDROID_PREVIEW_DOWNLOAD = `${RELEASES}/download/android-preview/Erudior-Android-arm64.apk`;
export const BREW = "brew install --cask aziliz/erudior/erudior";

interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
  /** "sha256:…" (GitHub adds it to newer uploads). */
  digest?: string | null;
}
interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets: Asset[];
}

type Os = "windows" | "mac" | "linux" | "android" | "other";

function detectOs(): Os {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "mac";
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return "other";
}

const mb = (n: number) => `${Math.max(1, Math.round(n / 1024 / 1024))} MB`;
const find = (r: Release | null, re: RegExp) => r?.assets.find((a) => re.test(a.name));
const version = (r: Release) => r.tag_name.replace(/^v/, "");

/** Downloads, install steps and answers (erudior.com/download). */
export default function DownloadPage() {
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [androidRelease, setAndroidRelease] = useState<Release | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const os = detectOs();

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub said ${r.status}.`))))
      .then((list: Release[]) => {
        const published = list.filter((r) => !r.draft && !r.prerelease && r.assets.length);
        if (!published.length) throw new Error("No release has been published yet.");
        setReleases(published);
      })
      .catch((e) => setError((e as Error).message));
  }, []);

  // Android previews are intentionally separate from stable desktop releases.
  // Only a published release with a real APK asset is shown as downloadable.
  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/tags/android-preview`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((r: Release | null) => { if (r && !r.draft && r.assets?.length) setAndroidRelease(r); })
      .catch(() => { /* Keep the Android card in coming-soon state if GitHub is unavailable. */ });
  }, []);

  const androidApk = androidRelease?.assets.find((a) => /\.apk$/i.test(a.name));
  const release = releases?.[0] ?? null;
  const exe = find(release, /-setup\.exe$/i) ?? find(release, /\.exe$/i);
  const msi = find(release, /\.msi$/i);
  const deb = find(release, /\.deb$/i);
  const rpm = find(release, /\.rpm$/i);
  const appimage = find(release, /\.AppImage$/i);
  const dmg = find(release, /macOS-universal\.dmg$/i) ?? find(release, /\.dmg$/i);

  const copy = (text: string) =>
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 1600);
    });

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

  const cmd = (text: string) => (
    <div className="row code-row">
      <code className="install-cmd">{text}</code>
      <button className="btn sm" onClick={() => copy(text)} aria-label={`Copy: ${text}`}>
        {copied === text ? "Copied" : "Copy"}
      </button>
    </div>
  );

  const platforms: { id: Os; title: string; body: React.ReactNode }[] = [
    {
      id: "android",
      title: "Android (early preview)",
      body: (
        <>
          <div className="row">{androidApk
            ? link(androidApk, "Download Android APK", os === "android")
            : <a className={`btn${os === "android" ? " primary" : ""}`} href={ANDROID_PREVIEW_DOWNLOAD}>
                Download Android APK <span className="small">(GitHub preview)</span>
              </a>}</div>
          <p className="small muted">ARM64 Android phones. This is an early testing preview with verified in-app update support, not a production-ready release.</p>
          <ol className="small install-steps">
            <li>Download the APK directly to your phone; no GitHub sign-in is needed.</li>
            <li>Open the APK in your Files app.</li>
            <li>If Erudior is already installed, install over the existing app—do not uninstall it first. Android preserves existing data when it accepts the signed update.</li>
            <li>If prompted, allow installing from your browser or Files app, then install Erudior.</li>
            <li>Turn off that installation permission afterward.</li>
          </ol>
          {androidRelease && <p className="small"><a href={androidRelease.html_url}>Android preview release notes</a></p>}
        </>
      ),
    },
    {
      id: "windows",
      title: "Windows",
      body: (
        <>
          <div className="row">
            {link(exe, "Download for Windows", os === "windows")}
            {msi && link(msi, ".msi")}
          </div>
          <ol className="small install-steps">
            <li>Open the downloaded file.</li>
            <li>
              If Windows says it protected your PC, choose <b>More info</b>, then <b>Run anyway</b>. (The installer isn't code-signed yet.)
            </li>
            <li>Erudior installs for your user account (no administrator password) and adds a Start menu entry.</li>
          </ol>
          <p className="small muted">Windows 10 or 11, 64-bit. The .msi is for IT departments installing on many computers.</p>
        </>
      ),
    },
    {
      id: "mac",
      title: "macOS",
      body: (
        <>
          <p className="small">With Homebrew (recommended):</p>
          {cmd(BREW)}
          <p className="small">Or download the disk image:</p>
          <div className="row">{link(dmg, "Download for Mac", os === "mac")}</div>
          <ol className="small install-steps">
            <li>Open the .dmg and drag Erudior into Applications.</li>
            <li>
              The first time, macOS may say it can't check the app. Open <b>System Settings → Privacy &amp; Security</b> and choose <b>Open Anyway</b>.
              (The app isn't notarized by Apple yet; the Homebrew install skips this step.)
            </li>
          </ol>
          <p className="small muted">macOS 10.15 or later, Apple silicon or Intel.</p>
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
          <p className="small">Debian, Ubuntu, Mint:</p>
          {cmd("sudo apt install ./Erudior_*_amd64.deb")}
          <p className="small">Fedora, RHEL, openSUSE:</p>
          {cmd("sudo dnf install ./Erudior-*.x86_64.rpm")}
          <p className="small muted">
            64-bit x86. The AppImage runs on most other distributions (make it executable, then open it) and updates itself; the .deb and .rpm update
            when you install a newer package.
          </p>
        </>
      ),
    },
  ];
  const order = [...platforms].sort((a, b) => (a.id === os ? -1 : b.id === os ? 1 : 0));
  const files = release ? [exe, msi, dmg, deb, rpm, appimage].filter((a): a is Asset => !!a) : [];

  return (
    <div className="page download">
      <div className="notice dev-notice" role="note">
        <p>
          <b>Erudior is still being built.</b> It's an early version (below 1.0): courses are still being written and checked, and the homeschool and
          classroom tools haven't been tested by families or schools yet. Please don't use it to replace a homeschool program or regular school for now.
          It's fine as extra practice alongside your child's education.
        </p>
      </div>
      <div className="page-head">
        <div>
          <h1>Download Erudior</h1>
          <p>
            Erudior is free. The desktop app downloads courses as you need them and keeps working offline afterward. It also has the
            homeschool and classroom tools: students, attendance, grades, report cards, transcripts, portfolios and live rooms. Everything stays on your
            computer.
          </p>
          <p className="small muted">
            {release ? (
              <>
                Version {version(release)}, released {new Date(release.published_at).toLocaleDateString()} · <a href={release.html_url}>What's new</a>
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
      </div>

      <div className="download-grid">
        {order.map((p) => (
          <section key={p.id} className={`download-card${p.id === os ? " current" : ""}`} aria-labelledby={`dl-${p.id}`}>
            <h2 id={`dl-${p.id}`}>
              {p.title}
              {p.id === os && <span className="pill neutral">Your device</span>}
            </h2>
            {p.body}
          </section>
        ))}
      </div>

      <p className="small muted" style={{ marginTop: 16 }}>
        Just want to study? Nothing to install: <a href={appUrl("/courses")}>use Erudior in your browser</a>. Homeschool records, classroom mode and
        hosting live rooms need the desktop app.
      </p>

      <section className="download-faq" aria-labelledby="faq">
        <h2 id="faq" className="section-title">
          Questions
        </h2>
        <details>
          <summary>Does the app come with every course?</summary>
          <p>
            It comes with the course catalog, not the courses themselves. Choose <b>Start course</b> and that course downloads (a few megabytes); from then
            on it works without internet. When a course gets a new version, the app offers it the next time it's online, and your progress is kept.
          </p>
        </details>
        <details>
          <summary>Where is my data stored?</summary>
          <p>
            In your user folder: <code>%APPDATA%\com.erudior.app</code> on Windows, <code>~/Library/Application Support/com.erudior.app</code> on macOS,
            and <code>~/.local/share/com.erudior.app</code> on Linux. Nothing about your children is sent anywhere. Use{" "}
            <b>Parent area → Settings and backup</b> to save an encrypted backup you can restore on another computer.
          </p>
        </details>
        <details>
          <summary>How do updates work?</summary>
          <p>
            On Windows, macOS and the AppImage, the app checks for a new version when it starts and offers to install it. With Homebrew, run{" "}
            <code>brew upgrade --cask --greedy erudior</code>. The .deb and .rpm show a notice instead; install the newer package to update. On Android, Erudior can check for a verified APK update and opens the Android installer for your approval.
          </p>
        </details>
        <details>
          <summary>Why does my computer warn me about the installer?</summary>
          <p>
            Windows and macOS warn about apps that aren't signed with a paid certificate. Erudior's installers are built in public from its source code
            on GitHub, and you can compare a download against the SHA-256 checksums below.
          </p>
        </details>
        <details>
          <summary>How do I uninstall it?</summary>
          <p>
            Windows: Settings → Apps → Erudior → Uninstall. macOS: drag Erudior from Applications to the Trash (or run{" "}
            <code>brew uninstall --cask erudior</code>). Linux: <code>sudo apt remove erudior</code> or <code>sudo dnf remove erudior</code>. Your data
            folder stays until you delete it.
          </p>
        </details>
        <details>
          <summary>Is it really free?</summary>
          <p>Yes: the app, the courses and the updates. There are no ads and nothing to buy.</p>
        </details>
      </section>

      {release && (
        <section className="download-files" aria-labelledby="files">
          <h2 id="files" className="section-title">
            Files and checksums (version {version(release)})
          </h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">File</th>
                  <th scope="col">Size</th>
                  <th scope="col">SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {files.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <a href={a.browser_download_url}>{a.name}</a>
                    </td>
                    <td>{mb(a.size)}</td>
                    <td>
                      <code className="sha">{a.digest?.replace(/^sha256:/, "") ?? "listed on the release page"}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {releases && releases.length > 1 && (
            <>
              <h3>Earlier versions</h3>
              <ul className="plain-list small">
                {releases.slice(1, 6).map((r) => (
                  <li key={r.tag_name}>
                    <a href={r.html_url}>Version {version(r)}</a> <span className="muted">({new Date(r.published_at).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="small">
            <a href={RELEASES}>Every release on GitHub</a>
          </p>
        </section>
      )}
    </div>
  );
}
