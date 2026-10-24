// erudior.com: the public site (home page and downloads). The app itself is app.erudior.com;
// any other address here (erudior.com/algebra-1, /community …) is sent there.
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import DownloadPage from "./pages/DownloadPage";
import { Mark } from "./components/Mark";
import { SITE_ORIGIN, appUrl } from "./lib/site";
import { CATALOG } from "./lib/catalog";
import { DEFAULT_TITLE, homeJsonLd, setSeo } from "./lib/seo";
import { GENERAL_DISCLAIMER, LEGAL_TITLES, LegalView, type LegalPage } from "./components/Terms";

type Page = "home" | "download" | LegalPage;

function pageFor(path: string): Page | null {
  const p = path.replace(/\/+$/, "") || "/";
  return p === "/" ? "home" : p === "/download" ? "download" : p === "/terms" ? "terms" : p === "/privacy" ? "privacy" : p === "/licenses" ? "licenses" : null;
}

export default function Site() {
  const [page, setPage] = useState<Page | null>(() => pageFor(window.location.pathname));

  useEffect(() => {
    if (page === null) window.location.replace(appUrl(window.location.pathname + window.location.search.replace(/[?&]site\b/, "")));
  }, [page]);

  // Light/dark/sepia… chosen in the app carries over when the site shares its browser storage
  // (it doesn't across domains, so the site follows the system setting).
  useEffect(() => {
    if (page === "home" || !page) setSeo({ title: DEFAULT_TITLE, url: SITE_ORIGIN + "/", jsonLd: homeJsonLd(CATALOG) });
    else if (page === "download")
      setSeo({
        title: "Download Erudior for Windows, macOS and Linux",
        description: "Download the free Erudior desktop app for Windows, macOS and Linux: every course offline, plus homeschool records, transcripts, classroom mode and live rooms.",
        url: SITE_ORIGIN + "/download",
      });
    else
      setSeo({
        title: `${LEGAL_TITLES[page]} · Erudior`,
        description: page === "terms" ? "Erudior's Terms of Use." : page === "privacy" ? "How Erudior handles your information: no accounts to study, no tracking, no ads." : "Open-source software used by Erudior.",
        url: `${SITE_ORIGIN}/${page}`,
      });
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    const onPop = () => setPage(pageFor(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Links between the site's own pages stay in the page (no reload).
  const go = (e: React.MouseEvent<HTMLAnchorElement>, to: Page) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    window.history.pushState(null, "", to === "home" ? "/" : `/${to}`);
    setPage(to);
  };

  if (!page) return null;
  return (
    <div className="shell site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="/" onClick={(e) => go(e, "home")} aria-current={page === "home" ? "page" : undefined}>
          <Mark />
          Erudior
        </a>
        <nav className="nav" aria-label="Main">
          <a href="/#parents">For parents</a>
          <a href="/#live">Live rooms</a>
          <a href="/#classroom">For teachers</a>
          <a href="/download" onClick={(e) => go(e, "download")} aria-current={page === "download" ? "page" : undefined}>
            Download
          </a>
        </nav>
        <div className="spacer" />
        <a className="btn primary sm" href={appUrl("/")}>
          Open the web app
        </a>
      </header>
      <main id="main" className="main" tabIndex={-1}>
        {page === "home" ? (
          <Home />
        ) : page === "download" ? (
          <DownloadPage />
        ) : (
          <div className="page">
            <LegalView
              page={page}
              linkTo={(to, label) => (
                <a href={`/${to}`} onClick={(e) => go(e, to)}>
                  {label}
                </a>
              )}
            />
          </div>
        )}
        <footer className="site-footer small muted">
          <span>Erudior · free courses and homeschool records</span>
          <a href={appUrl("/")}>Web app</a>
          <a href={appUrl("/community")}>Community courses</a>
          <a href="/download" onClick={(e) => go(e, "download")}>
            Download
          </a>
          <a href="https://github.com/Aziliz/examiner/releases">Releases</a>
          <a href="/terms" onClick={(e) => go(e, "terms")} aria-current={page === "terms" ? "page" : undefined}>
            Terms of Use
          </a>
          <a href="/privacy" onClick={(e) => go(e, "privacy")} aria-current={page === "privacy" ? "page" : undefined}>
            Privacy Policy
          </a>
          <a href="/licenses" onClick={(e) => go(e, "licenses")} aria-current={page === "licenses" ? "page" : undefined}>
            Licenses
          </a>
          <p className="site-disclaimer">{GENERAL_DISCLAIMER}</p>
        </footer>
      </main>
    </div>
  );
}
