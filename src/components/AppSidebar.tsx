import { useId, useLayoutEffect, useRef, useState } from "react";
import type { AppApi, View } from "../App";
import { Mark } from "./Mark";
import "../app-sidebar.css";

export type SidebarTheme = "system" | "light" | "dark" | "sepia" | "dim" | "contrast";
type Panel = "navigation" | "account" | "display";
export interface SidebarPreferences {
  theme: SidebarTheme;
  width: "full" | "comfortable";
  textSize: "100" | "115" | "130";
  setTheme: (value: SidebarTheme) => void;
  setWidth: (value: "full" | "comfortable") => void;
  setTextSize: (value: "100" | "115" | "130") => void;
}

/** Navigation only: authority remains in App.go and the existing adult/session gates.
 * The native modal makes underlying content inert. Explicit Tab wrapping also
 * prevents focus escaping to browser chrome at either end of the drawer.
 */
export default function AppSidebar({ api, current, managementLabel, showCommunity, blocked,
  preferences, onLock, onOpen }: {
  api: Pick<AppApi, "go" | "toast" | "family" | "student" | "homeschool">;
  current: View;
  managementLabel: "Family" | "Classroom" | null;
  showCommunity: boolean;
  blocked: boolean;
  preferences: SidebarPreferences;
  onLock: () => void;
  onOpen: () => void;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("navigation");
  const heading = panel === "account" ? "Account management" : panel === "display" ? "Display settings" : "Navigation";

  const dismiss = () => {
    dialog.current?.close();
    setOpen(false);
    setPanel("navigation");
  };
  useLayoutEffect(() => {
    if (blocked) { setOpen(false); setPanel("navigation"); return; }
    const modal = dialog.current;
    if (!modal) return;
    if (open) {
      if (!modal.open) modal.showModal();
      (panel === "navigation" ? closeButton.current : title.current)?.focus();
    } else if (modal.open) modal.close();
  }, [open, panel, blocked]);
  useLayoutEffect(() => {
    if (!open || blocked) return;
    const trap = (event: KeyboardEvent) => {
      const modal = dialog.current;
      if (event.key !== "Tab" || !modal?.open) return;
      const items = [...modal.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(node => node.getClientRects().length > 0 && !node.closest("[hidden], [inert]"));
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (index < 0 || (event.shiftKey ? index === 0 : index === items.length - 1)) {
        event.preventDefault();
        (event.shiftKey ? items[items.length - 1] : items[0])?.focus();
      }
    };
    window.addEventListener("keydown", trap, true);
    return () => window.removeEventListener("keydown", trap, true);
  }, [open, blocked]);
  // A route change, including an external Back action, never leaves stale menu UI.
  useLayoutEffect(() => { dismiss(); }, [current]);
  useLayoutEffect(() => {
    const modal = dialog.current;
    return () => { if (modal?.open) modal.close(); };
  }, []);

  const navigate = (target: View) => {
    dismiss();
    try { api.go(target); } catch { api.toast("That page could not be opened. Your current work is unchanged."); }
  };
  const outside = (x: number, y: number) => {
    const box = dialog.current?.getBoundingClientRect();
    return !!box && (x < box.left || x > box.right || y < box.top || y > box.bottom);
  };
  const destination = (label: string, target: View, active = false, detail?: string) => (
    <button type="button" className="app-sidebar-item" aria-current={active ? "page" : undefined}
      onClick={() => navigate(target)}>
      <span><span className="app-sidebar-item-label">{label}</span>{detail && <span className="app-sidebar-detail">{detail}</span>}</span>
      <span aria-hidden="true">›</span>
    </button>
  );
  const sectionButton = (label: string, next: Panel, detail: string) => (
    <button type="button" className="app-sidebar-item" onClick={() => setPanel(next)}>
      <span><span className="app-sidebar-item-label">{label}</span><span className="app-sidebar-detail">{detail}</span></span>
      <span aria-hidden="true">›</span>
    </button>
  );

  return <>
    <button ref={trigger} type="button" className="brand app-sidebar-trigger" disabled={blocked}
      aria-label="Open Erudior navigation" aria-haspopup="dialog" aria-expanded={open && !blocked}
      aria-controls={`${id}-drawer`} onClick={() => { onOpen(); setPanel("navigation"); setOpen(true); }}>
      <Mark /><span>Erudior</span><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    </button>
    {!blocked && <dialog ref={dialog} id={`${id}-drawer`} className="app-sidebar-dialog" aria-modal="true"
      aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); dismiss(); }}
      onClose={() => { setOpen(false); setPanel("navigation"); if (trigger.current?.isConnected && !trigger.current.disabled) trigger.current.focus(); }}
      onPointerDown={event => { backdropPress.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }}
      onPointerUp={event => { if (backdropPress.current && event.target === event.currentTarget && outside(event.clientX, event.clientY)) dismiss(); backdropPress.current = false; }}>
      <div className="app-sidebar-header">
        <div className="app-sidebar-identity"><Mark /><span>Erudior<small>learn without limits</small></span></div>
        <button ref={closeButton} type="button" className="btn app-sidebar-close" aria-label="Close navigation" onClick={dismiss}>×</button>
      </div>
      <div className="app-sidebar-content">
        {panel !== "navigation" && <button type="button" className="app-sidebar-back" onClick={() => setPanel("navigation")}>← All navigation</button>}
        <h2 ref={title} id={`${id}-title`} tabIndex={-1}>{heading}</h2>
        {panel === "navigation" && <>
          <nav aria-label="Sidebar learning">
            {destination("Courses", { name: "progress" }, current.name === "progress", "Enrolled courses and learning pathways")}
            {destination("Notebook", { name: "workspace" }, current.name === "workspace", "Tasks, notes, reading and goals")}
            {destination("Library", { name: "library" }, current.name === "library", "Browse and start a course")}
            {showCommunity && destination("Community", { name: "community" }, current.name === "community" || current.name === "communityCourse", "Explore community courses")}
            {managementLabel && destination(managementLabel, { name: "parent" }, current.name === "parent", "Supervising-adult access required")}
            {destination("Search", { name: "search", q: "" }, current.name === "search")}
          </nav>
          <h3>Your app</h3>
          <nav aria-label="Sidebar utilities">
            {sectionButton("Account management", "account", "Local profiles, privacy and backup")}
            {sectionButton("Display settings", "display", "Theme, text size and reading width")}
            {destination("Settings and app updates", { name: "progress", tools: true })}
            {destination("Privacy and terms", { name: "legal", page: "privacy" })}
          </nav>
          {api.family && <button type="button" className="btn app-sidebar-lock" onClick={() => { dismiss(); onLock(); }}>Lock device</button>}
        </>}
        {panel === "account" && <>
          <section className="app-sidebar-status" aria-label="Account status">
            <h3>{managementLabel ? `Local ${managementLabel} workspace` : "Independent learning"}</h3>
            <p>{api.student ? `Current learner: ${api.student.name}` : "Learning on this device"}</p>
            <p>Online sign-in, account recovery and multi-device cloud sync are not available yet. Local profiles are not online accounts.</p>
          </section>
          <nav aria-label="Account actions">
            {api.family ? <>
              {destination("Switch learner", { name: "who" }, false, "Uses the existing adult authorization")}
              {destination("Manage learner profiles", { name: "parent", tab: "students" }, false, "Supervising-adult access required")}
              {destination("Security and backup", { name: "parent", tab: "settings" }, false, "Existing password, recovery and backup tools")}
              {destination("Learner privacy", { name: "parent", tab: "learner-privacy" }, false, "Protected export and deletion controls")}
            </> : <>
              {api.homeschool && destination("Set up Family or Classroom", { name: "familySetup" })}
              {destination("Learning data and backup", { name: "progress", tools: true })}
            </>}
          </nav>
          <p className="app-sidebar-note">Opening this menu does not unlock records, change profiles or upload learning data. Deletion and recovery stay in their existing protected workflows.</p>
        </>}
        {panel === "display" && <div className="app-sidebar-preferences">
          <label className="field"><span>Theme</span><select className="select" aria-label="Theme" value={preferences.theme} onChange={event => preferences.setTheme(event.target.value as SidebarTheme)}>
            <option value="system">System (light or dark)</option><option value="light">Light</option><option value="sepia">Sepia (warm paper)</option><option value="dim">Dim (soft dark)</option><option value="dark">Dark</option><option value="contrast">High contrast</option>
          </select></label>
          <label className="field"><span>Reading width</span><select className="select" aria-label="Reading width" value={preferences.width} onChange={event => preferences.setWidth(event.target.value as SidebarPreferences["width"])}>
            <option value="full">Full</option><option value="comfortable">Comfortable</option>
          </select></label>
          <label className="field"><span>Text size</span><select className="select" aria-label="Text size" value={preferences.textSize} onChange={event => preferences.setTextSize(event.target.value as SidebarPreferences["textSize"])}>
            <option value="100">Normal</option><option value="115">Large</option><option value="130">Larger</option>
          </select></label>
          <p className="app-sidebar-note">Display preferences apply to this device. Your courses and progress are unchanged.</p>
        </div>}
      </div>
    </dialog>}
  </>;
}
