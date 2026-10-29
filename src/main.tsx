import React from "react";
import ReactDOM from "react-dom/client";
import { IS_SITE, siteUrl } from "./lib/site";

// The download page lives on the public site.
if (!IS_SITE && typeof window !== "undefined" && /^\/download\/?$/.test(window.location.pathname)) window.location.replace(siteUrl("/download"));
import "katex/dist/katex.min.css";
import "./styles.css";
import "./diagnostics.css";
import "./interoperability.css";
import "./documentEngine.css";
import "./transactions.css";
import "./instructionalEvidence.css";
import "./branching.css";
import "./scientific.css";
import "./advanced-assessment.css";
import "./learningGames.css";
import "./startupSplash.css";
import { createStartupSplash, dismissStartupSplash, scheduleStartupSplashDismissal } from "./lib/startupSplash";

// Older cached snapshots can contain an overlay outside React's root. Always remove it.
document.querySelectorAll(".erudior-splash").forEach(element => element.remove());
let showSplash = false;
if (IS_SITE) {
  try {
    showSplash = sessionStorage.getItem("erudior.site.splash.seen") !== "1";
    if (showSplash) sessionStorage.setItem("erudior.site.splash.seen", "1");
  } catch {
    // A failed write must not leave showSplash=true and replay it on every refresh.
    showSplash = false;
  }
}
const splash = showSplash ? createStartupSplash({ kind: "official" }) : null;
if (splash) {
  document.body.appendChild(splash);
  // A single 2.8 s clock owns the animation and fade, independent of React/imports.
  scheduleStartupSplashDismissal(splash);
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
(IS_SITE ? import("./Site") : import("./App")).then(({ default: Page }) =>
  root.render(<React.StrictMode><Page /></React.StrictMode>),
).catch((error) => {
  if (splash) dismissStartupSplash(splash);
  console.error("Erudior page failed to load:", error);
});

import "./presentations.css";
