// Homepage section: homeschool rules for a chosen state, from the same rules file the parent
// dashboard uses (content/states/states.yaml -> samples/states.json).
import { useState } from "react";
import { statesData, type StateInfo } from "../lib/states";

const allStates = (): StateInfo[] => [...statesData().states].sort((a, b) => a.name.localeCompare(b.name));

const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const ROWS: { key: keyof StateInfo; label: string }[] = [
  { key: "ages", label: "Compulsory ages" },
  { key: "notice", label: "Notice" },
  { key: "time", label: "Required time" },
  { key: "subjects", label: "Required subjects" },
  { key: "assessment", label: "Testing or evaluation" },
  { key: "records", label: "Records to keep" },
  { key: "teacher", label: "Parent qualifications" },
  { key: "routes", label: "Other legal routes" },
];

export function HomeStatesSection() {
  const states = allStates();
  const [code, setCode] = useState(states[0].code);
  const s = states.find((x) => x.code === code) ?? states[0];
  return (
    <section className="home-states" id="state-requirements" aria-labelledby="h-states">
      <h2 id="h-states">Homeschool requirements by state</h2>
      <p>What each state asks of homeschooling families, with links to the law. The desktop app uses the same rules for its reminders and records.</p>
      <label className="state-picker">
        <span className="small muted">State</span>
        <select className="input" value={code} onChange={(e) => setCode(e.target.value)}>
          {states.map((x) => (
            <option key={x.code} value={x.code}>
              {x.name}
            </option>
          ))}
        </select>
      </label>
      <table className="state-table">
        <caption className="sr-only">Homeschool requirements in {s.name}</caption>
        <tbody aria-live="polite">
          {ROWS.map((r) => (
            <tr key={r.key}>
              <th scope="row">{r.label}</th>
              <td>{String(s[r.key] ?? "None")}</td>
            </tr>
          ))}
          {s.unsettled && (
            <tr>
              <th scope="row">Still changing</th>
              <td>{s.unsettled}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Sources</th>
            <td>
              {s.sources.map((u, i) => (
                <span key={u}>
                  {i > 0 && " · "}
                  <a href={u} rel="noopener" target="_blank">
                    {new URL(u).hostname.replace(/^www\./, "")}
                  </a>
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="small muted state-note">
        Last checked {longDate(s.checked)}. A plain-language summary for planning, not legal advice; laws change, so check the sources or your
        state's education department.
      </p>
    </section>
  );
}
