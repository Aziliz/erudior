interface ImportMetaEnv {
  /** Where course packages are published (e.g. https://examiner-courses.azilizlabs.com/v1/). Unset = bundled courses. */
  readonly VITE_COURSES_URL?: string;
  /** "1" turns on the homeschool features outside the desktop app (testing). */
  readonly VITE_HOMESCHOOL?: string;
}
/** Dev server only: public key of the local dev signing key (scripts/publish-courses.ts --dev). */
declare const __DEV_COURSE_KEY__: string;
