// erudior.com is the public site (home page and downloads); app.erudior.com is the web app.
// One build serves both: the host name decides which one renders. Progress lives in the app's
// browser storage, so everything you study stays on app.erudior.com.
import { inApp } from "./storage";

export const SITE_ORIGIN = "https://erudior.com";
export const APP_ORIGIN = "https://app.erudior.com";

function detect(): boolean {
  if (inApp || typeof window === "undefined") return false;
  const h = window.location.hostname;
  if (h === "erudior.com" || h === "www.erudior.com") return true;
  // Local testing: add ?site to the address (remembered for the tab).
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("site")) sessionStorage.setItem("erudior.site", "1");
    if (q.has("app")) sessionStorage.removeItem("erudior.site");
    return sessionStorage.getItem("erudior.site") === "1";
  } catch {
    return false;
  }
}

/** True when this page is the public site, not the app. */
export const IS_SITE = detect();

const local = () => typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

/** A link into the web app (same tab). */
export function appUrl(path = "/"): string {
  return local() ? `${path}${path.includes("?") ? "&" : "?"}app` : APP_ORIGIN + path;
}

/** A link to the public site (the home page, downloads). */
export function siteUrl(path = "/"): string {
  return local() ? `${path}${path.includes("?") ? "&" : "?"}site` : SITE_ORIGIN + path;
}
