// Stand-in for bundledCourses.ts in builds that download courses (VITE_COURSES_URL set).
export async function bundledCourse(file: string): Promise<unknown> {
  throw new Error(`Course file ${file} isn't bundled in this build`);
}
