import { useLayoutEffect, useRef, useState } from "react";

const storageKey = "erudior.vmTerminalHeightPercent";
const min = 25, max = 80, initial = 55;
const clamp = (value: number) => Math.max(min, Math.min(max, Math.round(value)));

function savedHeight() {
  try {
    const value = Number(localStorage.getItem(storageKey));
    if (Number.isFinite(value) && value >= min && value <= max) return clamp(value);
  } catch { /* The control still works when preferences cannot be read. */ }
  return initial;
}

export default function VmConsoleHeight({ screenId }: { screenId: string }) {
  const [height, setHeight] = useState(savedHeight);
  const grip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; y: number; start: number; scale: number } | null>(null);

  useLayoutEffect(() => {
    const el = grip.current;
    const owner = el?.closest<HTMLElement>(".vm-study") ?? el?.closest<HTMLElement>(".vm-console");
    owner?.style.setProperty("--vm-terminal-percent", String(height));
    return () => { owner?.style.removeProperty("--vm-terminal-percent"); };
  }, [height]);

  // In a stacked window the grip is above the console. Moving it upward gives
  // space to the terminal. On a wide window it moves the terminal's lower edge.
  function scale() {
    const el = grip.current!;
    const stacked = getComputedStyle(el).order === "-1";
    const pane = el.closest<HTMLElement>(stacked ? ".vm-study" : ".vm-study-machines");
    return (stacked ? -100 : 100) / (pane?.clientHeight || window.innerHeight);
  }

  function commit(value: number) {
    const next = clamp(value);
    setHeight(next);
    try { localStorage.setItem(storageKey, String(next)); } catch { /* Session-only preference. */ }
  }

  function cancel(id: number) {
    if (id !== drag.current?.id) return;
    setHeight(drag.current.start);
    drag.current = null;
  }

  return <div ref={grip} className="vm-console-grip" role="separator" tabIndex={0}
    aria-label="Terminal height" aria-controls={screenId} aria-orientation="horizontal"
    aria-valuemin={min} aria-valuemax={max} aria-valuenow={height} aria-valuetext={height + "%"}
    title="Drag to resize the terminal, or use the Up and Down arrow keys"
    onPointerDown={e => {
      if (e.button !== 0 || drag.current) return;
      e.preventDefault();
      e.currentTarget.focus({ preventScroll: true });
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { id: e.pointerId, y: e.clientY, start: height, scale: scale() };
    }}
    onPointerMove={e => {
      const d = drag.current;
      if (d?.id === e.pointerId) setHeight(clamp(d.start + (e.clientY - d.y) * d.scale));
    }}
    onPointerUp={e => {
      const d = drag.current;
      if (d?.id !== e.pointerId) return;
      drag.current = null;
      commit(d.start + (e.clientY - d.y) * d.scale);
    }}
    onPointerCancel={e => cancel(e.pointerId)} onLostPointerCapture={e => cancel(e.pointerId)}
    onKeyDown={e => {
      if (e.altKey || e.ctrlKey || e.metaKey || drag.current) return;
      let next: number;
      switch (e.key) {
        case "ArrowUp": next = height - Math.sign(scale()) * 5; break;
        case "ArrowDown": next = height + Math.sign(scale()) * 5; break;
        case "Home": next = min; break;
        case "End": next = max; break;
        default: return;
      }
      e.preventDefault();
      e.stopPropagation();
      commit(next);
    }}
  />;
}
