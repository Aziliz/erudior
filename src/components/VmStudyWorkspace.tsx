import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { AppApi } from "../App";
import { NFS_LAB } from "../lib/vmLab";
import VmLabPanel from "./VmLabPanel";
import { VmConsoleTarget } from "./VmConsole";

interface Props {
  api: AppApi;
  course: string;
  page: string;
  lessonMachines: boolean;
  children: ReactNode;
}

export default function VmStudyWorkspace({ api, course, page, lessonMachines, children }: Props) {
  const [open, setOpen] = useState(false);
  const [consoleTarget, setConsoleTarget] = useState<HTMLDivElement | null>(null);
  const reader = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { if (reader.current) reader.current.scrollTop = 0; }, [page]);

  return <VmConsoleTarget.Provider value={consoleTarget}>
    <div className={`vm-study${open ? " vm-study-open" : ""}`}>
      {!lessonMachines && <div className="vm-study-tools no-print">
        <button className="btn sm" aria-expanded={open} aria-controls="vm-study-machines" onClick={() => setOpen(!open)}>
          {open ? "Hide practice terminal" : "Open practice terminal"}
        </button>
      </div>}
      <div className="vm-study-reader" ref={reader} role="region" aria-label="Course reading" tabIndex={0}>
        {children}
      </div>
      <aside className="vm-study-machines no-print" id="vm-study-machines" aria-label={lessonMachines ? "Lesson terminal" : "Practice terminal"}>
        <div className="vm-study-console-slot" ref={setConsoleTarget} />
        {open && !lessonMachines && <VmLabPanel api={api} course={course} lesson="practice-environment" scenario={NFS_LAB} />}
      </aside>
    </div>
  </VmConsoleTarget.Provider>;
}
