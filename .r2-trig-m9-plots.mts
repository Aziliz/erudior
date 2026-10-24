import { renderFigure } from "./src/lib/figure.ts";
import fs from "fs";
const files = ["35-polar-coordinates.md","36-polar-graphs.md","37-parametric-equations.md","38-complex-trig-form.md","39-de-moivre-and-roots.md","39h1-polar-conics.md","39h2-cycloids.md","39h3-roots-of-unity.md"];
for (const f of files) {
  const md = fs.readFileSync("content/math/trigonometry/lessons/" + f, "utf8");
  const re = /```(plot|shape)\n([\s\S]*?)\n```/g; let m; let i = 0;
  while ((m = re.exec(md))) {
    const spec = { type: m[1], ...JSON.parse(m[2]) };
    let svg = renderFigure(spec as any);
    if (!svg.includes('xmlns=')) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    fs.writeFileSync(`/tmp/r2-trig-m9/plots/${f.slice(0, 4)}-${i++}.svg`, svg);
  }
}
