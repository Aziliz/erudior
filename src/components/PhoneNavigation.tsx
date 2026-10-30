import type { View } from "../App";

/** The native phone shell uses the same destinations and local workspace label as the header. */
export default function PhoneNavigation({ current, currentView, showCommunity, managementLabel, go }: {
  current: "library" | "community" | "progress" | null;
  currentView: View["name"];
  showCommunity: boolean;
  managementLabel: "Family" | "Classroom" | null;
  go: (view: View) => void;
}) {
  return <nav className="android-bottom-nav" aria-label="Phone navigation">
    <button type="button" aria-current={current === "library" ? "page" : undefined}
      onClick={() => go({ name: "library" })}><span aria-hidden="true">⌂</span><span>Library</span></button>
    {showCommunity && <button type="button" aria-current={current === "community" ? "page" : undefined}
      onClick={() => go({ name: "community" })}><span aria-hidden="true">◫</span><span>Community</span></button>}
    <button type="button" aria-current={current === "progress" ? "page" : undefined}
      onClick={() => go({ name: "progress" })}><span aria-hidden="true">◉</span><span>Courses</span></button>
    {managementLabel && <button type="button" aria-current={currentView === "parent" ? "page" : undefined}
      onClick={() => go({ name: "parent" })}><span aria-hidden="true">♙</span><span>{managementLabel}</span></button>}
    <button type="button" aria-current={currentView === "search" ? "page" : undefined}
      onClick={() => go({ name: "search", q: "" })}><span aria-hidden="true">⌕</span><span>Search</span></button>
  </nav>;
}
