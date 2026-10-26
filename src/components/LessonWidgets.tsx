// Mounts the interactive parts of ```map and ```sim lesson blocks into their static HTML.
// Lazy-loaded by the Markdown component only when a lesson has one (brings d3-geo and the
// simulation code; a map's shapes load later still, only for the base it uses).

import { createRoot, type Root } from "react-dom/client";
import { MapFigure } from "./GeoMap";
import SimView from "./SimView";

// Roots are unmounted after the current render (React warns about unmounting mid-render); a
// remount of the same element before then (Strict Mode runs effects twice) reuses the root.
const live = new WeakMap<Element, { root: Root; timer?: ReturnType<typeof setTimeout> }>();

export function mountWidgets(root: HTMLElement): () => void {
  const hosts: Element[] = [];
  const mount = (host: Element | null, node: React.ReactNode) => {
    if (!host) return;
    let entry = live.get(host);
    if (entry) clearTimeout(entry.timer);
    else {
      host.textContent = "";
      entry = { root: createRoot(host) };
      live.set(host, entry);
    }
    entry.root.render(node);
    hosts.push(host);
  };
  root.querySelectorAll<HTMLElement>("figure.geo-map").forEach((fig) =>
    mount(fig.querySelector(".map-mount"), <MapFigure source={fig.dataset.geoMap ?? ""} title={fig.dataset.mapTitle ?? "Map"} />),
  );
  root.querySelectorAll<HTMLElement>("figure.sim").forEach((fig) => mount(fig.querySelector(".sim-mount"), <SimView kind={fig.dataset.sim ?? ""} body={fig.dataset.simBody ?? ""} />));
  return () => {
    for (const h of hosts) {
      const e = live.get(h);
      if (!e) continue;
      e.timer = setTimeout(() => {
        e.root.unmount();
        live.delete(h);
      });
    }
  };
}
