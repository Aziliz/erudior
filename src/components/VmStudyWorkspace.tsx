import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { AppApi } from "../App";
import { ALMA_PRACTICE, NFS_LAB } from "../lib/vmLab";
import VmLabPanel from "./VmLabPanel";
import { VmConsoleTarget } from "./VmConsole";

interface Props {
  api: AppApi;
  course: string;
  page: string;
  lessonMachines: boolean;
  practiceScenario?: typeof ALMA_PRACTICE | typeof NFS_LAB;
  children: ReactNode;
}

export default function VmStudyWorkspace({ api, course, page, practiceScenario = NFS_LAB, lessonMachines, children }: Props) {
  const [open, setOpen] = useState(false);
  const [practiceTarget, setPracticeTarget] = useState<HTMLDivElement | null>(null);
  const [lessonTarget, setLessonTarget] = useState<HTMLDivElement | null>(null);
  const activeTarget = lessonMachines ? lessonTarget : practiceTarget;
  const reader = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (reader.current) reader.current.scrollTop = 0; }, [page]);

  function switchPane(event: KeyboardEvent) {
    if (event.key !== "F6" || event.altKey || event.ctrlKey || event.metaKey) return;
    const input = activeTarget?.querySelector<HTMLTextAreaElement>(".xterm-helper-textarea");
    if (!input || !reader.current) return;
    event.preventDefault();
    event.stopPropagation();
    const next = activeTarget?.contains(document.activeElement) ? reader.current : input;
    next.focus({ preventScroll: true });
  }

  return <div onKeyDownCapture={switchPane} className={`vm-study${open && !lessonMachines ? " vm-study-open" : ""}`}>
    {!lessonMachines && <div className="vm-study-tools no-print">
      <button className="btn sm" aria-expanded={open} aria-controls="vm-study-machines" onClick={() => setOpen(!open)}>
        {open ? "Hide practice terminal" : "Open practice terminal"}
      </button>
    </div>}
    <div className="vm-study-reader" ref={reader} role="region" aria-label="Course reading" aria-keyshortcuts="F6" tabIndex={0}>
      <VmConsoleTarget.Provider value={{ target: lessonTarget, visible: lessonMachines }}>{children}</VmConsoleTarget.Provider>
    </div>
    <aside className="vm-study-machines no-print" id="vm-study-machines" aria-label={lessonMachines ? "Lesson terminal" : "Practice terminal"}>
      <div className="vm-study-console-slot" ref={setLessonTarget} hidden={!lessonMachines} />
      <div className="vm-study-console-slot" ref={setPracticeTarget} hidden={lessonMachines} />
      {open && <div hidden={lessonMachines}>
        <VmConsoleTarget.Provider value={{ target: practiceTarget, visible: !lessonMachines }}>
          <VmLabPanel api={api} course={course} lesson="practice-environment" scenario={practiceScenario} />
        </VmConsoleTarget.Provider>
      </div>}
    </aside>
  </div>;
}
