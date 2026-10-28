import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { IS_SITE, siteUrl } from "./lib/site";

// The download page lives on the public site.
if (!IS_SITE && typeof window !== "undefined" && /^\/download\/?$/.test(window.location.pathname)) window.location.replace(siteUrl("/download"));
import "katex/dist/katex.min.css";
import "./styles.css";
import { createStartupSplash, dismissStartupSplash } from "./lib/startupSplash";

// The public site and the app load separately, so erudior.com doesn't download the whole app.
// Until the code arrives, the prerendered page (if any) stays on screen.
// Only the public site's first visit in this browser session gets the splash.
// Set before mount so refreshes during the animation never show it again.
let showSplash = false;
if (IS_SITE) {
  try {
    showSplash = sessionStorage.getItem("erudior.site.splash.seen") !== "1";
    if (showSplash) sessionStorage.setItem("erudior.site.splash.seen", "1");
  } catch {
    // Storage denied: don't replay a blocking splash on every refresh.
  }
}
const splash = showSplash ? createStartupSplash({ kind: "official" }) : null;
if (splash) document.body.appendChild(splash);
const splashStartedAt = performance.now();
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
(IS_SITE ? import("./Site") : import("./App")).then(({ default: Page }) =>
  root.render(
    <React.StrictMode>
      <StartupView Page={Page} />
    </React.StrictMode>,
  ),
);

function StartupView({ Page }: { Page: React.ComponentType }) {
  useEffect(() => {
    if (!splash) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dismissStartupSplash(splash);
      return;
    }
    const delay = Math.max(0, 1700 - (performance.now() - splashStartedAt));
    const timeout = window.setTimeout(() => dismissStartupSplash(splash), delay);
    return () => window.clearTimeout(timeout);
  }, []);
  return <Page />;
}
