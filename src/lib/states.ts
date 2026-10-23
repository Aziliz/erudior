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
  reports?: { due: string; what: string }[];
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

/** Other legal routes for homeschooling in this state, as listed in the rules file. */
export function routeOptions(s: StateInfo): string[] {
  const others = s.routes
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x && x !== "None");
  return ["Home education law", ...others];
}
