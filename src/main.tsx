import React from "react";
import ReactDOM from "react-dom/client";
import { IS_SITE, siteUrl } from "./lib/site";

// The download page lives on the public site.
if (!IS_SITE && typeof window !== "undefined" && /^\/download\/?$/.test(window.location.pathname)) window.location.replace(siteUrl("/download"));
import "katex/dist/katex.min.css";
import "./styles.css";

// The public site and the app load separately, so erudior.com doesn't download the whole app.
// Until the code arrives, the prerendered page (if any) stays on screen.
const splash = document.createElement("div");
splash.className = "erudior-splash";
splash.setAttribute("role", "status");
splash.setAttribute("aria-label", "Loading Erudior");
splash.innerHTML = '<div class="erudior-splash-book" aria-hidden="true"><span></span><span></span><i>★</i></div><strong>ERUDIOR</strong><p>Learn without limits.</p>';
document.body.appendChild(splash);
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
(IS_SITE ? import("./Site") : import("./App")).then(({ default: Page }) =>
  (root.render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>,
  ), requestAnimationFrame(() => {
    splash.classList.add("erudior-splash-exit");
    splash.addEventListener("transitionend", () => splash.remove(), { once: true });
  })),
);
