/** One mounted quiz's ordered writes. Each operation retains its writer's authorization lease. */
export function createRunPersistence() {
  let tail: Promise<void> = Promise.resolve();
  let phase: "open" | "busy" | "closed" = "open";
  let committed = false;
  const enqueue = (write: () => Promise<void>) => {
    const next = tail.catch(() => {}).then(write);
    tail = next;
    return next;
  };
  return {
    get busy() { return phase === "busy"; },
    get closed() { return phase === "closed"; },
    get committed() { return committed; },
    get locked() { return phase !== "open" || committed; },
    save(write: (content: string | null) => Promise<void>, content: string): Promise<void> {
      if (phase !== "open" || committed) return Promise.resolve();
      return enqueue(() => write(content));
    },
    async leave(write: (content: string | null) => Promise<void>, content: string): Promise<boolean> {
      if (phase !== "open" || committed) return false;
      phase = "busy";
      try {
        await enqueue(() => write(content));
        phase = "closed";
        return true;
      } catch (error) { phase = "open"; throw error; }
    },
    async finish(write: (content: string | null) => Promise<void>, content: string, commit: () => Promise<void>): Promise<boolean> {
      if (phase !== "open") return false;
      phase = "busy";
      try {
        if (!committed) {
          // Drain old autosaves and save the exact submitted answers before recording progress.
          await enqueue(() => write(content));
          await commit();
          committed = true;
        }
        // After a failed cleanup, retry only cleanup; edits and autosaves remain locked.
        await enqueue(() => write(null));
        phase = "closed";
        return true;
      } catch (error) { phase = "open"; throw error; }
    },
  };
}
