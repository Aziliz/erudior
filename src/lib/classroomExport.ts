import { makeHandIn, type HandIn, type Joined } from "./classroom";
import type { Progress } from "./types";
import { activeStudent, loadProgress } from "./storage";
import { loadFile } from "./documents";
import { getConfirmedSpreadsheetSubmissions } from "./spreadsheetSubmissionState";

export interface ClassroomExportIO {
  activeStudent(): string | null;
  loadProgress(): Promise<Progress>;
  loadFile(id: string): Promise<{ mime: string; data: string } | null>;
}
/** Export persisted evidence, never optimistic in-memory grades/submissions.
 * A guest roster selection remains a claim, not verified student identity.
 */
export async function preparePersistedHandIn(joined: Joined, io: ClassroomExportIO = { activeStudent, loadProgress, loadFile }): Promise<HandIn> {
  const learner = io.activeStudent();
  const ensure = () => {
    if (io.activeStudent() !== learner) throw Error("The active learner changed. Save the hand-in again from the correct profile.");
    if (learner !== null && learner !== joined.studentId) throw Error("This class roster selection belongs to another learner. Select the active learner before exporting.");
  };
  ensure();
  const persisted = await io.loadProgress();
  ensure();
  const progress = { ...persisted, spreadsheetSubmissions: getConfirmedSpreadsheetSubmissions(persisted, learner) };
  const result = await makeHandIn(joined.cls, joined.studentId, progress, async id => { ensure(); const file = await io.loadFile(id); ensure(); return file; });
  ensure();
  return result;
}
