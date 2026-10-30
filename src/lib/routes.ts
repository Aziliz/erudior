// Web addresses for screens (website only), so the browser's back button and links work:
//   / (or /courses)                    the course library (the home page is erudior.com)
//   /community                          community courses
//   /colorado-real-estate-broker       a course (or its catalog overview before it's started)
//   /colorado-real-estate-broker/cards a course tab ("today" is the bare course address)
//   /colorado-real-estate-broker/lessons/<lessonId>
//   /<course>/read/<textId>             a text in the course's reader
//   /colorado-real-estate-broker/<activity>   practice, exam results, cards, drills, … (not
//                                       restorable from the address alone; reopens the course)
//   /progress, /search?q=…, /create, /review, /live
// A course's address is its title made URL-safe; its id works too.
import type { View } from "../App";
import type { CourseTab } from "../pages/CourseHome";
import { slugify } from "./util";
import { COURSE_ACTIVITY_KINDS, type CourseActivityKind } from "./courseActivities";

export interface RouteCourse {
  id: string;
  title: string;
}

const TABS: CourseTab[] = ["today", "lessons", "banks", "cards", "vocab", "reading", "drills", "glossary", "reference", "work"];

/** The address part for a course: its title as a slug, unless another course has the same slug. */
export function courseSlug(id: string, all: RouteCourse[]): string {
  const c = all.find((x) => x.id === id);
  if (!c) return encodeURIComponent(id);
  const s = slugify(c.title);
  const clash = all.some((x) => x.id !== id && slugify(x.title) === s);
  return clash ? encodeURIComponent(id) : s;
}

function findCourse(seg: string, all: RouteCourse[]): RouteCourse | undefined {
  let s: string;
  try { s = decodeURIComponent(seg); } catch { return undefined; }
  return all.find((x) => x.id === s) ?? all.find((x) => slugify(x.title) === s);
}

/** The course a screen belongs to, if any. */
function courseOf(v: View): string | null {
  switch (v.name) {
    case "course":
    case "courseEdit":
    case "lesson":
    case "courseActivity":
    case "cards":
    case "deckEdit":
    case "drill":
    case "ref":
    case "vocab":
    case "work":
    case "read":
      return v.courseId;
    case "overview":
      return v.catalogId;
    default:
      return null;
  }
}

/** Address for a screen. `all` = installed courses plus the catalog. */
export function viewToPath(v: View, all: RouteCourse[], bankCourse: (bankId: string) => string | undefined): string {
  const course = (id: string) => "/" + courseSlug(id, all);
  switch (v.name) {
    case "library":
      return "/";
    case "community":
      return "/community";
    case "communityCourse":
      return "/community/" + encodeURIComponent(v.id);
    case "progress":
      return "/progress";
    case "legal":
      return "/" + v.page;
    case "search":
      return "/search?q=" + encodeURIComponent(v.q);
    case "create":
      return "/create";
    case "communityEdit":
      return "/create/" + encodeURIComponent(v.id);
    case "review":
      return "/admin";
    case "live":
      return "/live";
    case "presentation":
      return "/presentation";
    case "who":
    case "familySetup":
    case "parent":
      return "/";
    case "overview":
      return v.requestedPath ?? course(v.catalogId);
    case "course":
      return course(v.courseId) + (v.tab && v.tab !== "today" ? "/" + v.tab : "");
    case "lesson":
      return course(v.courseId) + "/lessons/" + encodeURIComponent(v.lessonId);
    case "courseActivity":
      return course(v.courseId) + "/activities/" + v.kind + "/" + encodeURIComponent(v.sourceId);
    case "work":
      return course(v.courseId) + "/work/" + encodeURIComponent(v.itemId);
    case "courseEdit":
      return course(v.courseId) + "/edit";
    case "cards":
      return course(v.courseId) + "/flashcards";
    case "deckEdit":
      return course(v.courseId) + "/edit-cards";
    case "drill":
      return course(v.courseId) + "/practice-drills";
    case "ref":
      return course(v.courseId) + "/reference/" + encodeURIComponent(v.refId);
    case "vocab":
      return course(v.courseId) + "/vocabulary-practice";
    case "read":
      return course(v.courseId) + "/read/" + encodeURIComponent(v.textId);
    case "bank":
    case "editor": {
      const cid = bankCourse(v.bankId);
      return (cid ? course(cid) : "") + (v.name === "bank" ? "/questions" : "/edit-questions");
    }
    case "run":
      return (bankCourse(v.session.bankId) ? course(bankCourse(v.session.bankId)!) : "") + "/session";
    case "results": {
      const back = v.back;
      const cid = courseOf(back) ?? (back.name === "bank" || back.name === "editor" ? bankCourse(back.bankId) : undefined);
      return (cid ? course(cid) : "") + "/results";
    }
  }
}

/** Two screens count as the same page when switching between them shouldn't add a back step
 * (a course's tabs; a catalog overview and the course once it's started). */
export function pageKey(v: View): string {
  const c = courseOf(v);
  if (v.name === "course" || v.name === "overview") return "course:" + c;
  if (v.name === "communityCourse") return "community:" + v.id;
  if (v.name === "search") return "search";
  if (v.name === "lesson") return `lesson:${c}:${v.lessonId}`;
  if (v.name === "read") return `read:${c}:${v.textId}`;
  if (v.name === "ref") return `ref:${c}:${v.refId}`;
  if (v.name === "courseActivity") return `activity:${c}:${v.kind}:${v.sourceId}`;
  return v.name + ":" + (c ?? "");
}

/** The screen for an address, or null if it can't be shown (unknown course, etc.). */
export function pathToView(pathname: string, search: string, installed: RouteCourse[], catalog: RouteCourse[]): View | null {
  const parts = pathname.split("/").filter(Boolean);
  try { for (const part of parts) decodeURIComponent(part); } catch { return null; }
  if (!parts.length) return { name: "library" };
  const [first, second, third] = parts;
  if (first === "courses" && !second) return { name: "library" };
  if (first === "community") {
    if (parts.length === 1) return { name: "community" };
    if (parts.length === 2 && /^[A-Za-z0-9_-]{1,100}$/.test(second)) return { name: "communityCourse", id: second };
    return null;
  }
  if (first === "progress") return { name: "progress" };
  if (first === "terms" || first === "privacy" || first === "licenses") return { name: "legal", page: first };
  if (first === "search") return { name: "search", q: new URLSearchParams(search).get("q") ?? "" };
  if (first === "create") return second ? { name: "communityEdit", id: decodeURIComponent(second) } : { name: "create" };
  if (first === "admin" && !second) return { name: "review" };
  if (first === "live") return { name: "live" };
  if (first === "presentation") return { name: "presentation", code: new URLSearchParams(search).get("code") ?? undefined };
  const have = findCourse(first, installed);
  if (!have) {
    const entry = findCourse(first, catalog);
    if (!entry) return null;
    if (!second) return { name: "overview", catalogId: entry.id };
    const destination = pathToView(pathname, search, [entry], []);
    if (!destination) return null;
    return { name: "overview", catalogId: entry.id, requestedPath: viewToPath(destination, [...installed, ...catalog], () => undefined) };
  }
  const courseId = have.id;
  if (second === "activities") {
    if (parts.length !== 4 || !(COURSE_ACTIVITY_KINDS as readonly string[]).includes(third)) return null;
    try { return {name:"courseActivity", courseId, kind:third as CourseActivityKind, sourceId:decodeURIComponent(parts[3])}; } catch { return null; }
  }
  if (second === "lessons" && third) return { name: "lesson", courseId, lessonId: decodeURIComponent(third) };
  if (second === "reference" && third) return { name: "ref", courseId, refId: decodeURIComponent(third) };
  if (second === "work" && third) return { name: "work", courseId, itemId: decodeURIComponent(third) };
  if (second === "read" && third) return { name: "read", courseId, textId: decodeURIComponent(third) };
  if (second && (TABS as string[]).includes(second)) return { name: "course", courseId, tab: second as CourseTab };
  // Activities (practice, results, …) need state the address doesn't carry: open the course.
  return { name: "course", courseId };
}
