import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Site from "./Site";
import { IS_SITE, siteUrl } from "./lib/site";

// The download page lives on the public site.
if (!IS_SITE && typeof window !== "undefined" && /^\/download\/?$/.test(window.location.pathname)) window.location.replace(siteUrl("/download"));
import "katex/dist/katex.min.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {IS_SITE ? <Site /> : <App />}
  </React.StrictMode>,
);
