import { useCallback, useEffect, useRef, useState } from "react";
import type { Bank, Progress } from "./lib/types";
import type { Session } from "./lib/session";
import * as store from "./lib/storage";
import { normalizeBank } from "./lib/validate";
import sample from "../samples/sample-bank.json";
import Library from "./pages/Library";
import BankHome from "./pages/BankHome";
import Runner from "./pages/Runner";
import Results from "./pages/Results";
import Editor from "./pages/Editor";
import ProgressPage from "./pages/ProgressPage";
import { Mark } from "./components/Mark";

export type View =
  | { name: "library" }
  | { name: "progress" }
  | { name: "bank"; bankId: string }
  | { name: "editor"; bankId: string; isNew?: boolean }
  | { name: "run"; session: Session }
  | { name: "results"; attemptId: string; back: View };

export interface AppApi {
  banks: Bank[];
  progress: Progress;
  go: (v: View) => void;
  toast: (msg: string) => void;
  reloadBanks: () => Promise<Bank[]>;
  setProgress: (p: Progress) => Promise<void>;
}

type Theme = "system" | "light" | "dark";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("examiner.theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

export default function App() {
  const [view, setView] = useState<View>({ name: "library" });
  const [banks, setBanks] = useState<Bank[]>([]);
  const [broken, setBroken] = useState<string[]>([]);
  const [progress, setProgressState] = useState<Progress>(store.emptyProgress());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const toastTimer = useRef<number>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("examiner.theme", theme);
    } catch {
      /* storage unavailable; theme just won't persist */
    }
  }, [theme]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const reloadBanks = useCallback(async () => {
    const { banks, broken } = await store.listBanks();
    setBanks(banks);
    setBroken(broken);
    return banks;
  }, []);

  const setProgress = useCallback(async (p: Progress) => {
    setProgressState(p);
    await store.saveProgress(p);
  }, []);

  // First launch: load data, seed the sample bank once.
  useEffect(() => {
    (async () => {
      try {
        let p = await store.loadProgress();
        const { banks } = await store.listBanks();
        if (!p.seeded) {
          if (!banks.length) {
            await store.saveBank(normalizeBank(sample));
          }
          p = { ...p, seeded: true };
          await store.saveProgress(p);
        }
        setProgressState(p);
        await reloadBanks();
        setReady(true);
      } catch (e) {
        setLoadError(String(e));
      }
    })();
  }, [reloadBanks]);

  const api: AppApi = {
    banks,
    progress,
    go: setView,
    toast,
    reloadBanks,
    setProgress,
  };

  if (loadError) {
    return (
      <div className="page">
        <h1>Examiner couldn't load your data</h1>
        <p className="notice error" style={{ marginTop: 16 }}>
          {loadError}
        </p>
      </div>
    );
  }
  if (!ready) return null;

  const fullScreen = view.name === "run" || view.name === "editor";
  const bankFor = (id: string) => banks.find((b) => b.id === id);

  let body: React.ReactNode;
  switch (view.name) {
    case "library":
      body = <Library api={api} broken={broken} />;
      break;
    case "progress":
      body = <ProgressPage api={api} />;
      break;
    case "bank": {
      const bank = bankFor(view.bankId);
      body = bank ? <BankHome api={api} bank={bank} /> : <Library api={api} broken={broken} />;
      break;
    }
    case "editor": {
      const bank = bankFor(view.bankId);
      body = bank ? <Editor api={api} bank={bank} isNew={view.isNew} /> : <Library api={api} broken={broken} />;
      break;
    }
    case "run":
      body = <Runner api={api} session={view.session} bank={bankFor(view.session.bankId)} />;
      break;
    case "results": {
      const attempt = progress.attempts.find((a) => a.id === view.attemptId);
      body = attempt ? (
        <Results api={api} attempt={attempt} bank={bankFor(attempt.bankId)} back={view.back} />
      ) : (
        <Library api={api} broken={broken} />
      );
      break;
    }
  }

  const navCurrent = view.name === "progress" ? "progress" : "library";

  return (
    <div className="shell">
      {!fullScreen && (
        <header className="topbar">
          <div className="brand">
            <Mark />
            Examiner
          </div>
          <nav className="nav" aria-label="Main">
            <button
              aria-current={navCurrent === "library" ? "page" : undefined}
              onClick={() => setView({ name: "library" })}
            >
              Library
            </button>
            <button
              aria-current={navCurrent === "progress" ? "page" : undefined}
              onClick={() => setView({ name: "progress" })}
            >
              Progress
            </button>
          </nav>
          <div className="spacer" />
          <label className="small muted row" style={{ gap: 6 }}>
            Theme
            <select
              className="select"
              style={{ width: "auto", padding: "4px 8px" }}
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </header>
      )}
      <main className="main">{body}</main>
      {toastMsg && (
        <div className="toast" role="status">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
