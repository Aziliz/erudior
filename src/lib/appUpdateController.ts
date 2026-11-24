export type ProgressListener = (percent: number | null) => void;
export type Release = { version: string } & (
  | { kind: "desktop"; cached: boolean; download: (progress: ProgressListener) => Promise<void>; install: () => Promise<boolean>; restart: () => Promise<void>; close: () => Promise<void> }
  | { kind: "android"; install: () => Promise<void> }
  | { kind: "external" }
);

export type UpdatePhase = "offered" | "downloading" | "ready" | "installing" | "restarting" | "opened" | "failed";
export interface UpdateStatus {
  release: Release;
  phase: UpdatePhase;
  percent?: number | null;
  message?: string;
  retry?: "download" | "install" | "restart";
}

const laterKey = "erudior.desktopUpdateLater";
type Preferences = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function closeRelease(release?: Release | null) {
  if (release?.kind === "desktop") void release.close().catch(() => {});
}

export class AppUpdateController {
  private state: UpdateStatus | null = null;
  private checking?: Promise<string | null>;
  private manualCheck = false;
  private listeners = new Set<() => void>();
  constructor(private detect: () => Promise<Release | null>, private preferences?: Preferences) {}

  snapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private show(state: UpdateStatus | null) {
    this.state = state;
    for (const listener of this.listeners) listener();
  }

  check = (manual = false): Promise<string | null> => {
    if (this.checking) {
      this.manualCheck ||= manual;
      return this.checking;
    }
    const previous = this.state;
    if (previous && !["opened", "offered"].includes(previous.phase) && previous.retry !== "download")
      return Promise.resolve(previous.release.version);
    this.manualCheck = manual;
    this.checking = this.detect().then(release => {
      if (this.state !== previous) {
        closeRelease(release);
        return this.state?.release.version ?? null;
      }
      if (previous?.release !== release) closeRelease(previous?.release);
      if (release?.kind === "desktop" && this.preferences?.getItem(laterKey) === release.version) {
        if (!this.manualCheck) {
          closeRelease(release);
          this.show(null);
          return release.version;
        }
        this.preferences.removeItem(laterKey);
      }
      this.show(release ? { release, phase: release.kind === "desktop" && release.cached ? "ready" : "offered" } : null);
      return release?.version ?? null;
    }).finally(() => { this.checking = undefined; });
    return this.checking;
  };

  private async download(release: Extract<Release, { kind: "desktop" }>) {
    this.show({ release, phase: "downloading", percent: null });
    try {
      await release.download(percent => this.show({ release, phase: "downloading", percent }));
      this.show({ release, phase: "ready" });
    } catch (error) {
      this.show({ release, phase: "failed", retry: "download", message: String(error) });
    }
  }

  private async restart(release: Extract<Release, { kind: "desktop" }>) {
    this.show({ release, phase: "restarting" });
    try { await release.restart(); }
    catch (error) { this.show({ release, phase: "failed", retry: "restart", message: String(error) }); }
  }

  private async install(release: Exclude<Release, { kind: "external" }>) {
    this.show({ release, phase: "installing" });
    try {
      if (release.kind === "android") {
        await release.install();
        this.show({ release, phase: "opened" });
      } else if (await release.install()) {
        closeRelease(release);
        await this.restart(release);
      } else {
        this.show({ release, phase: "offered", message: "The saved update is missing or could not be verified. Download a fresh copy." });
      }
    } catch (error) {
      this.show({ release, phase: "failed", retry: "install", message: String(error) });
    }
  }

  act = async () => {
    const state = this.state;
    if (!state) return;
    const { release, phase, retry } = state;
    if (release.kind === "desktop" && (phase === "offered" || retry === "download")) await this.download(release);
    else if (release.kind === "desktop" && retry === "restart") await this.restart(release);
    else if ((release.kind === "desktop" && (phase === "ready" || retry === "install")) ||
             (release.kind === "android" && (phase === "offered" || phase === "opened" || retry === "install"))) await this.install(release);
  };

  dismiss = () => {
    const state = this.state;
    if (!state || !["offered", "opened", "ready", "failed"].includes(state.phase) || state.retry === "restart") return;
    if (state.release.kind === "desktop") this.preferences?.setItem(laterKey, state.release.version);
    closeRelease(state.release);
    this.show(null);
  };
}
