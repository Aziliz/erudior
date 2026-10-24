// What search engines and link previews see for each page: title, description, canonical address,
// Open Graph tags and structured data (JSON-LD). Set at runtime (Google renders JavaScript) and
// captured into static HTML for erudior.com and course overview pages by scripts/prerender.mjs.
import type { CatalogEntry } from "./catalog";
import { APP_ORIGIN, SITE_ORIGIN } from "./site";

export const DEFAULT_TITLE = "Erudior: free courses and homeschool records";
export const DEFAULT_DESCRIPTION =
  "Erudior is a free learning app with full courses from pre-algebra to calculus, physics, biology, statistics and German, plus homeschool records, report cards, transcripts and live classroom quizzes.";

export interface Seo {
  title: string;
  description?: string;
  /** Full canonical address (no query string). */
  url?: string;
  jsonLd?: object | object[];
  /** Keep out of search results (personal screens). */
  noindex?: boolean;
}

function meta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) return el?.remove();
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setSeo(s: Seo) {
  if (typeof document === "undefined") return;
  const description = s.description || DEFAULT_DESCRIPTION;
  document.title = s.title;
  meta("name", "description", description);
  meta("property", "og:title", s.title);
  meta("property", "og:description", description);
  meta("property", "og:url", s.url ?? null);
  meta("name", "robots", s.noindex ? "noindex" : null);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (s.url) {
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = s.url;
  } else link?.remove();
  let ld = document.getElementById("seo-jsonld");
  if (s.jsonLd) {
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "seo-jsonld";
      ld.setAttribute("type", "application/ld+json");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(s.jsonLd);
  } else ld?.remove();
}

const ORG = { "@type": "Organization", name: "Erudior", url: SITE_ORIGIN + "/", logo: SITE_ORIGIN + "/apple-touch-icon.png" };

/** erudior.com home: the organization, the website and the free app. */
export const homeJsonLd = (courses: CatalogEntry[]) => [
  { "@context": "https://schema.org", ...ORG },
  { "@context": "https://schema.org", "@type": "WebSite", name: "Erudior", url: SITE_ORIGIN + "/" },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Erudior",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Windows, macOS, Linux, Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: DEFAULT_DESCRIPTION,
    url: SITE_ORIGIN + "/",
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: courseUrl(c.title), name: c.title })),
  },
];

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "bank";

export const courseUrl = (title: string) => `${APP_ORIGIN}/${slug(title)}`;

/** A catalog course's overview page as a schema.org Course (free, online, self-paced). */
export function courseJsonLd(e: CatalogEntry) {
  const minutes = e.lessons ? e.lessons * 40 : 0;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: e.title,
    description: e.description,
    url: courseUrl(e.title),
    provider: ORG,
    isAccessibleForFree: true,
    inLanguage: "en",
    educationalLevel: e.level.join(", "),
    about: e.subject,
    offers: { "@type": "Offer", category: "Free", price: "0", priceCurrency: "USD" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: minutes ? `PT${Math.round(minutes / 60)}H` : undefined,
    },
  };
}
