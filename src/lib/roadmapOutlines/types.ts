/** A planned course's outline: what it teaches, what learners can do after it, and its capstone. */
export interface CourseOutline {
  modules: string[];
  outcomes: string[];
  capstone: string;
}

export const o = (modules: string[], outcomes: string[], capstone: string): CourseOutline => ({ modules, outcomes, capstone });
