import { useEffect, useState, type ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { inApp } from "../lib/storage";

const managed = "Erudior-Labs";
type Inventory = { hosts: { name: string; version: number }[]; selected: string | null; ready: boolean };

export default function VmProvider({ children }: { children: (provider: string) => ReactNode }) {
  const [provider, setProvider] = useState<string | null>(inApp ? null : "");
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [target, setTarget] = useState(managed);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [revision, refresh] = useState(0);

  useEffect(() => {
    if (!inApp) return;
    let live = true;
    async function inspect() {
      try {
        const kind = await invoke<string>("install_kind");
        if (!live) return;
        if (kind !== "windows") {
          setProvider(["linux-package", "appimage", "macos"].includes(kind) ? kind : "");
          return;
        }
        const data = await invoke<Inventory>("vm_windows_host");
        if (!live) return;
        if (data.ready) { setProvider(kind); return; }
        setInventory(data);
        const hosts = data.hosts.filter(h => h.version === 2);
        const previous = hosts.find(h => h.name.toLowerCase() === data.selected?.toLowerCase());
        setTarget(previous && previous.name.toLowerCase() !== managed.toLowerCase() ? previous.name : managed);
      } catch (cause) { if (live) setError(String(cause)); }
    }
    void inspect();
    return () => { live = false; };
  }, [revision]);

  async function setup() {
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await invoke<{ state: "ready" | "restart" }>("vm_windows_host", { target });
      if (result.state === "ready") setProvider("windows");
      else setMessage("Restart Windows, reopen this course, and choose Set up Windows labs again to finish.");
    } catch (cause) { setError(String(cause)); }
    finally { setBusy(false); }
  }

  if (provider !== null) return <>{children(provider)}</>;
  if (!inventory && !error) return <p role="status">Checking the local lab host…</p>;
  const hosts = inventory?.hosts.filter(h => h.version === 2 && h.name.toLowerCase() !== managed.toLowerCase()) ?? [];
  return <section className="stack" aria-label="Windows lab setup" aria-busy={busy}>
    <h2>Set up Windows labs</h2>
    <p>Erudior can install a dedicated Debian host in WSL 2 or use an existing Debian 13 or later distribution. Your practice machines run AlmaLinux.</p>
    {inventory && <>
      {hosts.length > 0 && <label>Lab host <select value={target} disabled={busy} onChange={e => setTarget(e.target.value)}>
        <option value={managed}>Dedicated Debian host ({managed})</option>
        {hosts.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
      </select></label>}
      {inventory.selected && !inventory.hosts.some(h => h.name === inventory.selected && h.version === 2) &&
        <p>Your previous host, {inventory.selected}, is unavailable. Each host keeps its own practice disks.</p>}
      <p>Setup installs QEMU and the lab tools in the selected host. Windows may ask for administrator approval or a restart.</p>
      <button className="btn primary" disabled={busy} onClick={() => void setup()}>Set up Windows labs</button>
    </>}
    {busy && <p role="status">Preparing the Windows lab host…</p>}
    {message && <p role="status">{message}</p>}
    {error && <p role="alert">{error}</p>}
    {(error || message) && <button className="btn" disabled={busy} onClick={() => { setError(""); setMessage(""); refresh(r => r + 1); }}>Check again</button>}
  </section>;
}
