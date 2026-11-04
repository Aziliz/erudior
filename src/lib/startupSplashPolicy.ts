/** Presentation-only state; never reads or changes learner records. */
export const WEB_APP_SPLASH_KEY = "erudior.webapp.splash.seen";
type StartupContext = {
  isSite: boolean;
  isNative: boolean;
  reducedMotion: boolean;
  navigationType: string;
  storage: Pick<Storage, "getItem" | "setItem">;
};

/** Once per web-app tab session, on a fresh opening only. Fail open if storage is denied. */
export function claimWebAppSplash(context: StartupContext): boolean {
  if (context.isSite || context.isNative) return false;
  try {
    const seen = context.storage.getItem(WEB_APP_SPLASH_KEY) === "1";
    // Mark even skipped refresh/history/reduced-motion loads so later navigation never replays it.
    context.storage.setItem(WEB_APP_SPLASH_KEY, "1");
    return !seen && !context.reducedMotion && context.navigationType === "navigate";
  } catch {
    return false;
  }
}
