import { useEffect, useRef, useState } from "react";
import { createBrandingPreview, SPLASH_DURATION_MS } from "../lib/startupSplash";
import "../engineAttribution.css";

/** Public footer documentation, not an automatic splash or a license adoption. */
export default function EngineAttribution() {
  const host = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("Still preview. Animation plays only when requested.");
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = replay > 0 && !reduced;
    const preview = createBrandingPreview({ kind: "third-party", productName: "Your learning app" }, animate);
    element.replaceChildren(preview);
    setPlaying(animate);
    setStatus(animate ? "Playing a three-second preview." : reduced
      ? "Reduced motion: showing the still attribution example."
      : "Still preview. Animation plays only when requested.");
    const finish = window.setTimeout(() => {
      preview.dataset.playing = "false";
      setPlaying(false);
      if (animate) setStatus("Preview complete. Replay whenever you like.");
    }, SPLASH_DURATION_MS);
    return () => { window.clearTimeout(finish); preview.remove(); };
  }, [replay]);
  return (
    <section className="engine-attribution" id="engine-license" aria-labelledby="engine-attribution-title">
      <div className="engine-attribution-copy">
        <p className="engine-attribution-eyebrow">For developers</p>
        <h2 id="engine-attribution-title">Build with Erudior Engine</h2>
        <p>Give your product its own identity, with a clear <strong>Powered by Erudior</strong> credit.
          The example uses the same two page turns and slower bookmark as our web-app intro.</p>
        <p className="engine-license-status"><strong>License status: draft, not yet adopted.</strong> The proposed
          Erudior Engine Source-Available License and contribution-back terms are still under review.</p>
        <h3>Required startup attribution in the proposal</h3>
        <p>Use your product name, the opening-book motif, a linked Powered by Erudior credit, and the independence
          notice shown here. Do not use the official motto or imply endorsement. Respect reduced motion and let
          the product load while the animation plays.</p>
        <p>The draft also covers sharing distributed or publicly hosted Engine modifications. Independent courses
          and learner records are not assigned to Erudior merely by using the Engine.</p>
        <div className="engine-attribution-links">
          <a href="https://github.com/Aziliz/erudior/blob/legal/erudior-engine-license/LICENSE">Read the draft Engine license</a>
          <a href="https://github.com/Aziliz/erudior/blob/main/docs/SPLASH_AND_CONTRIBUTION_TERMS_DRAFT.md">Animation and attribution guide</a>
          <a href="/licenses">Third-party software licenses</a>
        </div>
      </div>
      <div className="engine-attribution-example">
        <div ref={host} className="engine-attribution-preview" />
        <div className="engine-attribution-controls">
          <button type="button" className="btn sm" disabled={playing} onClick={() => setReplay(n => n + 1)}>
            {playing ? "Playing preview…" : "Play third-party animation"}
          </button>
          <p className="small muted" role="status">{status}</p>
        </div>
      </div>
    </section>
  );
}
