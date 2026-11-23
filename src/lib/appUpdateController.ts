// One update per app window. A desktop download can finish while the learner is
// working. The App applies it when the learner returns to a restart-safe screen.
export type ProgressListener = (percent: number | null) => void;
export type Release = { version: string } & (
  | { kind: "desktop"; download: (progress: ProgressListener) => Promise<void>; install: () => Promise<void>; restart: () => Promise<void>; close: () => Promise<void> }
  | { kind: "android"; install: () => Promise<void> }
  | { kind: "external" }
);

export type UpdatePhase = "offered" | "downloading" | "ready" | "installing" | "restarting" | "opened" | "failed";
export interface UpdateStatus {
  release: Release;
  phase: UpdatePhase;
  percent?: number | null;
  message?: string;
}

export class AppUpdateController {
  private state: UpdateStatus | null = null;
  private checking?: Promise<string | null>;
  private retry?: () => Promise<void>;
  private needsFreshRelease = false;
  private listeners = new Set<() => void>();
  constructor(private detect: () => Promise<Release | null>) {}

  snapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private show(state: UpdateStatus | null) {
    this.state = state;
    for (const listener of this.listeners) listener();
  }

  check = (): Promise<string | null> => {
    if (this.checking) return this.checking;
    const previous = this.state;
    const phase = previous?.phase;
    // An offered mobile/external release can be superseded. A failed desktop
    // download can be withdrawn. Resolve both from the current release feed.
    if (phase && phase !== "opened" && phase !== "offered" && !this.needsFreshRelease)
      return Promise.resolve(previous!.release.version);
    this.checking = this.detect().then(release => {
      if (this.state !== previous) {
        if (release?.kind === "desktop") void release.close().catch(() => {});
        return this.state?.release.version ?? null;
      }
      this.needsFreshRelease = false;
      this.retry = undefined;
      if (release?.kind === "desktop") void this.download(release);
      else this.show(release ? { release, phase: "offered" } : null);
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
      await release.close().catch(() => {});
      this.needsFreshRelease = true;
      this.fail(release, error, async () => {
        try { await this.check(); }
        catch (cause) { this.show({ release, phase: "failed", message: String(cause) }); }
      });
    }
  }

  private fail(release: Release, error: unknown, retry: () => Promise<void>) {
    this.retry = retry;
    this.show({ release, phase: "failed", message: String(error) });
  }

  // The native plugin consumes staged bytes only on successful installation.
  // If relaunch itself fails, retry just the relaunch on the installed version.
  private async restart(release: Extract<Release, { kind: "desktop" }>) {
    this.show({ release, phase: "restarting" });
    try { await release.restart(); }
    catch (error) { this.fail(release, error, () => this.restart(release)); }
  }

  private async install(release: Exclude<Release, { kind: "external" }>) {
    this.show({ release, phase: "installing" });
    try { await release.install(); }
    catch (error) { this.fail(release, error, () => this.install(release)); return; }
    if (release.kind === "android") this.show({ release, phase: "opened" });
    else {
      await release.close().catch(() => {});
      await this.restart(release);
    }
  }

  act = async () => {
    const state = this.state;
    if (!state) return;
    if (state.phase === "failed") {
      const retry = this.retry;
      await retry?.();
    } else if (((state.phase === "offered" || state.phase === "opened") && state.release.kind === "android") ||
               (state.phase === "ready" && state.release.kind === "desktop")) {
      await this.install(state.release);
    }
  };

  dismiss = () => {
    if (this.state?.phase === "offered" || this.state?.phase === "opened") this.show(null);
  };
}
