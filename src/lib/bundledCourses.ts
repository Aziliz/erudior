// Course files bundled into the app (builds without VITE_COURSES_URL). Remote builds alias
// this module to bundledCourses.remote.ts in vite.config.ts, so no course ships in them.
const FILES = import.meta.glob<{ default: unknown }>(["../../samples/math/*.json", "../../samples/languages/*.json", "../../samples/colorado-broker-course.json"]);

export async function bundledCourse(file: string): Promise<unknown> {
  const load = FILES[`../../samples/${file}`];
  if (!load) throw new Error(`Course file ${file} isn't bundled`);
  return (await load()).default;
}
