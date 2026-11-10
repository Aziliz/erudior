// State homeschool rules (built from content/states/states.yaml into samples/states.json).
//
// Every build bundles a copy (it's ~30 KB). Builds that download courses also look for a newer
// version named in the signed catalog, check its hash, and keep it on this device.

import bundled from "../../samples/states.json";
import { downloadPackage, REMOTE, statesPackage } from "./courseSource";

export interface HoursBand {
  from: number;
  to: number;
  hours: number;
}

export interface StateRules {
  notice: { kind: "none" | "once" | "annual" | "approval"; due?: string; opens?: string; beforeStart?: number; afterStart?: number };
  days?: number;
  hoursPerDay?: number;
  hours?: HoursBand[];
  /** Days OR hours satisfies the requirement (otherwise both apply). */
  either?: boolean;
  /** The figures are an agency's reading, not statute. */
  guidance?: boolean;
  testGrades?: number[];
  annualAssessment?: boolean;
  /** Other filings: on a fixed MM-DD, or at the middle or end of the family's school year. */
  reports?: { due?: string; midYear?: true; yearEnd?: true; what: string }[];
  /** The yearly evaluation is due on the anniversary of the notice of intent (Florida). */
  evaluationFromNotice?: boolean;
  /** The parent must meet the state's `teacher` requirement and be able to show it. */
  qualification?: boolean;
  /** Erudior subject areas (family.ts SUBJECTS) the state's subject list falls under. */
  subjectAreas?: string[];
  /** Part of the yearly hours that must be in these subject areas (Missouri). */
  coreHours?: { hours: number; areas: string[]; note?: string };
  /** A test result at which the state requires follow-up. */
  lowScore?: { percentileAtMost?: number; percentileBelow?: number; stanineBelow?: number; then: string };
  /** The written plan the state asks for. */
  plan?: "ihip" | "objectives" | "education";
}

export interface StateInfo {
  code: string;
  name: string;
  ages: string;
  notice: string;
  time: string;
  subjects: string;
  assessment: string;
  records: string;
  teacher: string;
  routes: string;
  rules: StateRules;
  sources: string[];
  checked: string;
  unsettled?: string;
}

export interface StatesFile {
  format: "examiner-states";
  version: string;
  states: StateInfo[];
}

const CACHE_KEY = "examiner.states.v1";

let current: StatesFile = bundled as StatesFile;
try {
  const saved = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as StatesFile | null;
  if (saved?.format === "examiner-states" && saved.version > current.version) current = saved;
} catch {
  /* no storage */
}

export const statesData = (): StatesFile => current;
export const stateInfo = (code: string | null | undefined): StateInfo | undefined =>
  code ? current.states.find((s) => s.code === code) : undefined;

/** Pick up a newer rules file from the website, if the catalog names one. Returns true if it changed. */
export async function refreshStates(): Promise<boolean> {
  const pkg = statesPackage;
  if (!REMOTE || !pkg || pkg.version <= current.version) return false;
  const data = (await downloadPackage(pkg)) as StatesFile;
  if (data.format !== "examiner-states" || !Array.isArray(data.states)) throw new Error("Unrecognized state rules file.");
  current = data;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* kept for this session only */
  }
  return true;
}

/** Yearly hour minimum for a grade (K = 0), if the state sets one. */
export function hoursFor(rules: StateRules, grade: number): number | undefined {
  const band = rules.hours?.find((b) => grade >= b.from && grade <= b.to);
  if (band) return band.hours;
  if (rules.days && rules.hoursPerDay) return Math.round(rules.days * rules.hoursPerDay);
  return undefined;
}

/** True when a test result is at or past the state's follow-up line. */
export function lowScore(rules: StateRules, t: { percentile?: number; stanine?: number }): boolean {
  const l = rules.lowScore;
  if (!l) return false;
  if (l.percentileAtMost !== undefined && t.percentile !== undefined) return t.percentile <= l.percentileAtMost;
  if (l.percentileBelow !== undefined && t.percentile !== undefined) return t.percentile < l.percentileBelow;
  if (l.stanineBelow !== undefined && t.stanine !== undefined) return t.stanine < l.stanineBelow;
  return false;
}

/** The state's follow-up line in words, e.g. "at or below the 13th percentile". */
export function lowScoreLine(rules: StateRules): string | undefined {
  const l = rules.lowScore;
  if (!l) return undefined;
  const nth = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;
  if (l.percentileAtMost !== undefined) return `at or below the ${nth(l.percentileAtMost)} percentile`;
  if (l.percentileBelow !== undefined) return `below the ${nth(l.percentileBelow)} percentile`;
  if (l.stanineBelow !== undefined) return `below the ${nth(l.stanineBelow)} stanine`;
  return undefined;
}

/** Hours the student has in each of the state's subject areas, flagging any with none. */
export function subjectCoverage(rules: StateRules, bySubject: { subject: string; hours: number }[]): { area: string; hours: number }[] {
  const hours = new Map(bySubject.map((b) => [b.subject, b.hours]));
  return (rules.subjectAreas ?? []).map((area) => ({ area, hours: hours.get(area) ?? 0 }));
}

/** Hours toward a core-hours rule (Missouri). */
export function coreHoursDone(rules: StateRules, bySubject: { subject: string; hours: number }[]): number | undefined {
  const c = rules.coreHours;
  if (!c) return undefined;
  return bySubject.filter((b) => c.areas.includes(b.subject)).reduce((s, b) => s + b.hours, 0);
}

/** Below the state's hours per day, a "school day" wouldn't count there. */
export function belowDailyMinimum(rules: StateRules | undefined, dailyMinutes: number): boolean {
  return !!rules?.hoursPerDay && dailyMinutes < Math.round(rules.hoursPerDay * 60);
}

/** Other legal routes for homeschooling in this state, as listed in the rules file. */
export function routeOptions(s: StateInfo): string[] {
  const others = s.routes
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x && x !== "None");
  return ["Home education law", ...others];
}
