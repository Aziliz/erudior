/** Public branding. Decorative, session-only and never a dependency of page startup. */
export type SplashBrand = { kind: "official" } | { kind: "third-party"; productName: string };
export const SPLASH_DURATION_MS = 2800;
export const SPLASH_EXIT_MS = 280;
const removals = new WeakMap<HTMLElement, () => void>();

export function createStartupSplash(brand: SplashBrand): HTMLDivElement {
  const splash = document.createElement("div");
  splash.className = "erudior-splash erudior-splash-polished";
  splash.setAttribute("data-prerender-skip", "");
  splash.setAttribute("role", "status");
  splash.setAttribute("aria-label", brand.kind === "official" ? "Loading Erudior" : "Loading " + brand.productName);
  splash.style.setProperty("--splash-duration", `${SPLASH_DURATION_MS}ms`);
  splash.style.setProperty("--splash-exit", `${SPLASH_EXIT_MS}ms`);
  const book = document.createElement("div");
  book.className = "erudior-splash-book";
  book.setAttribute("aria-hidden", "true");
  // The turning cover IS the left outline. There is no separately revealed frame.
  // Both sides of every sheet stay attached to the same hinge throughout the turn.
  book.innerHTML = `<div class="eb-shadow"></div><div class="eb-scene"><div class="eb-volume">
    <div class="eb-board"></div><div class="eb-stack"></div>
    <div class="eb-ribbon"><i></i></div>
    <div class="eb-sheet eb-sheet-three"><div class="eb-face eb-recto"></div><div class="eb-face eb-verso"></div></div>
    <div class="eb-sheet eb-sheet-two"><div class="eb-face eb-recto"></div><div class="eb-face eb-verso"></div></div>
    <div class="eb-sheet eb-sheet-one"><div class="eb-face eb-recto"></div><div class="eb-face eb-verso"></div></div>
    <div class="eb-cover"><div class="eb-cover-face eb-cover-outside"><i class="eb-emblem">✦</i></div><div class="eb-cover-face eb-cover-inside"></div></div>
  </div></div>`;
  splash.appendChild(book);
  const heading = document.createElement("strong");
  heading.textContent = brand.kind === "official" ? "ERUDIOR" : brand.productName;
  splash.appendChild(heading);
  const caption = document.createElement("p");
  caption.textContent = brand.kind === "official" ? "Learn without limits." : "Powered by Erudior";
  splash.appendChild(caption);
  if (brand.kind === "third-party") {
    const link = document.createElement("a");
    link.href = "https://erudior.com";
    link.textContent = "Erudior Engine";
    link.rel = "noopener noreferrer";
    splash.appendChild(link);
    const independent = document.createElement("small");
    independent.textContent = "Independent product; not affiliated with or endorsed by Erudior.";
    splash.appendChild(independent);
  }
  return splash;
}

/** Start immediately after insertion; page imports and React mounting cannot delay removal. */
export function scheduleStartupSplashDismissal(splash: HTMLElement): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    splash.remove();
    return;
  }
  const fade = window.setTimeout(() => dismissStartupSplash(splash), SPLASH_DURATION_MS - SPLASH_EXIT_MS);
  const deadline = window.setTimeout(() => {
    splash.remove();
    removals.delete(splash);
    window.clearTimeout(fade);
  }, SPLASH_DURATION_MS + 120);
  removals.set(splash, () => {
    window.clearTimeout(fade);
    window.clearTimeout(deadline);
    removals.delete(splash);
  });
}

export function dismissStartupSplash(splash: HTMLElement): void {
  if (!splash.isConnected) { removals.get(splash)?.(); return; }
  if (splash.classList.contains("erudior-splash-exit")) return;
  const remove = () => {
    splash.remove();
    removals.get(splash)?.();
    splash.removeEventListener("transitionend", onEnd);
  };
  const onEnd = (event: TransitionEvent) => {
    if (event.target === splash && event.propertyName === "opacity") remove();
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { remove(); return; }
  splash.addEventListener("transitionend", onEnd);
  splash.classList.add("erudior-splash-exit");
  // An independent deadline covers background tabs and disabled/missing transitions.
  window.setTimeout(remove, SPLASH_EXIT_MS + 40);
}
