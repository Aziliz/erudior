import React from "react";
import ReactDOM from "react-dom/client";
import { IS_SITE, siteUrl } from "./lib/site";
import { inApp } from "./lib/storage";

// The download page lives on the public site.
const redirectingToSite = !IS_SITE && /^\/download\/?$/.test(window.location.pathname);
if (redirectingToSite) window.location.replace(siteUrl("/download"));
import "katex/dist/katex.min.css";
import "./styles.css";
import "./diagnostics.css";
import "./interoperability.css";
import "./documentEngine.css";
import "./courseActivities.css";
import "./transactions.css";
import "./instructionalEvidence.css";
import "./branching.css";
import "./scientific.css";
import "./advanced-assessment.css";
import "./learningGames.css";
import "./learningProgress.css";
import "./startupSplash.css";
import { applyFurigana } from "./components/Ruby";
// Furigana on/off (Japanese courses) is a per-device display setting.
applyFurigana();
// Footer styles must be in the entry CSS, including restored prerendered pages.
import "./engineAttribution.css";
import { createStartupSplash, dismissStartupSplash, scheduleStartupSplashDismissal } from "./lib/startupSplash";
import { claimWebAppSplash } from "./lib/startupSplashPolicy";

// Start fetching application code NOW, never from an animation callback or timer.
// Studio stays on the existing trusted web-app origin, never inside a native
// learner workspace. Server authorization remains required for all private data.
const studioRoute = !IS_SITE && !inApp && /^\/admin\/studio\/?$/.test(window.location.pathname);
const promotionRoute = !IS_SITE && !inApp && /^\/admin\/promotions\/?$/.test(window.location.pathname);
const pageModule = studioRoute ? import("./pages/AdminStudio") : promotionRoute ? import("./pages/AdminPromotions") : IS_SITE ? import("./Site") : import("./App");
// Older cached snapshots can contain an overlay outside React's root. Always remove it.
document.querySelectorAll(".erudior-splash").forEach(element => element.remove());
let showSplash = false;
try {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  showSplash = !redirectingToSite && claimWebAppSplash({
    isSite: IS_SITE,
    isNative: inApp,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    navigationType: navigation?.type ?? "navigate",
    storage: sessionStorage,
  });
} catch {
  // Privacy settings must never prevent the app loading or force repeat branding.
}
const splash = showSplash ? createStartupSplash({ kind: "official" }) : null;
if (splash) {
  document.body.appendChild(splash);
  scheduleStartupSplashDismissal(splash);
  // A restored back/forward snapshot must not bring back a suspended intro.
  window.addEventListener("pagehide", () => splash.remove(), { once: true });
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
pageModule.then(({ default: Page }) =>
  root.render(<React.StrictMode><Page /></React.StrictMode>),
).catch((error) => {
  if (splash) dismissStartupSplash(splash);
  console.error("Erudior page failed to load:", error);
});

import "./presentations.css";
import "./androidUpdateLayout.css";
import "./androidApp.css";
