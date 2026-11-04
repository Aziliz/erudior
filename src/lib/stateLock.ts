/** Named-state transaction boundary. No DOM/storage dependencies are required in tests. */
export function validStateName(name: string): boolean {
  return ["progress", "session", "family", "classes", "classroom-submissions", "classroom-workflows", "presentations", "interventions", "document-engine", "transaction-engine", "instructional-evidence", "branching-engine", "scientific-workspace", "advanced-assessment", "learner-privacy"].includes(name)
    || /^(progress|records|session|portfolio)-[a-z0-9]{1,24}$/.test(name);
}
const tails = new Map<string, Promise<void>>();

/** Shared by all saves and updates. Web Locks coordinate cooperating tabs; fallback
 * coordinates this JS realm only. Do not nest mutations of the same state name. */
export async function withStateLock<T>(name: string, work: () => Promise<T>): Promise<T> {
  if (!validStateName(name)) throw Error("Unknown state file: " + name);
  const previous = tails.get(name) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>(resolve => { release = resolve; });
  tails.set(name, next);
  await previous;
  try {
    if (typeof navigator !== "undefined" && navigator.locks?.request)
      return await navigator.locks.request(`erudior.state.${name}`, { mode: "exclusive" }, work);
    return await work();
  } finally {
    release();
    if (tails.get(name) === next) tails.delete(name);
  }
}

export interface StateBackend {
  read(name: string): Promise<string | null>;
  write(name: string, value: string | null): Promise<void>;
  /** Atomic backend command compares and writes atomically across webviews in one process. */
  compareAndSwap?(name: string, expected: string | null, value: string): Promise<boolean>;
}

export function stateTransactions(backend: StateBackend) {
  return {
    save(name: string, value: string | null, guard: () => void | Promise<void> = () => {}): Promise<void> {
      return withStateLock(name, async () => { await guard(); return backend.write(name, value); });
    },
    /** Updaters must be pure and must not call named-state mutations. Native CAS
     * contention may rerun the updater with newer content. Read/write helpers are
     * deliberately unlocked here: reacquiring this lock would deadlock. */
    update(name: string, updater: (old: string | null) => string | Promise<string>, guard: () => void | Promise<void> = () => {}): Promise<string> {
      return withStateLock(name, async () => {
        for (let attempt = 0; attempt < 16; attempt++) {
          await guard();
          const old = await backend.read(name);
          const value = await updater(old);
          await guard();
          if (typeof value !== "string") throw Error("State updater must return text");
          if (backend.compareAndSwap) {
            if (!await backend.compareAndSwap(name, old, value)) continue;
          } else await backend.write(name, value);
          return value;
        }
        throw Error("State changed repeatedly; retry the update");
      });
    },
  };
}
