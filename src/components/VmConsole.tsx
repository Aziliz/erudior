import { Channel, invoke } from "@tauri-apps/api/core";
import { createPortal } from "react-dom";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Terminal } from "@xterm/xterm";
import type { VmLabScenario } from "../lib/vmLab";

type ConsoleEvent = { kind: "output"; bytes: number[] } | { kind: "closed"; message: string };
export type GuestRole = "client" | "server";

export const VmConsoleTarget = createContext<HTMLDivElement | null>(null);

interface ConsoleProps {
  role: GuestRole;
  profile: string;
  course: string;
  lesson: string;
  scenario: VmLabScenario;
  expected: string;
  close: () => void;
}

export default function VmConsole({ role, profile, course, lesson, scenario, expected, close }: ConsoleProps) {
  const target = useContext(VmConsoleTarget);
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Connecting…");

  useEffect(() => {
    const id = crypto.randomUUID();
    let disposed = false;
    let opened = false;
    let ended = false;
    let terminal: Terminal | undefined;
    let observer: ResizeObserver | undefined;
    const release = () => invoke("vm_console_close", { id }).catch(() => {});
    setStatus("Connecting…");

    async function connect() {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"), import("@xterm/addon-fit"), import("@xterm/xterm/css/xterm.css"),
      ]);
      if (disposed || !host.current) return;
      terminal = new Terminal({ cols: 80, rows: 24, scrollback: 1000, screenReaderMode: true, fontSize: 14 });
      const fit = new FitAddon();
      terminal.loadAddon(fit);
      terminal.open(host.current);
      fit.fit();
      observer = new ResizeObserver(() => {
        if (!disposed && host.current?.clientWidth) fit.fit();
      });
      observer.observe(host.current);

      const channel = new Channel<ConsoleEvent>();
      channel.onmessage = event => {
        if (disposed) return;
        if (event.kind === "output") {
          terminal?.write(new Uint8Array(event.bytes));
        } else {
          ended = true;
          setStatus(event.message);
        }
      };
      await invoke("vm_console_open", { id, role, profile, course, lesson, scenario, expected, channel });
      opened = true;
      if (disposed) {
        await release();
        return;
      }
      if (ended) return;
      setStatus("Connected. Press Enter for the login prompt.");
      terminal.focus();
      const encoder = new TextEncoder();
      let pending = Promise.resolve();
      terminal.onData(text => {
        const bytes = encoder.encode(text);
        for (let offset = 0; offset < bytes.length; offset += 4096) {
          const block = Array.from(bytes.subarray(offset, offset + 4096));
          pending = pending.then(async () => {
            if (!disposed && !ended) await invoke("vm_console_write", { id, bytes: block });
          }).catch(error => {
            if (!disposed) {
              ended = true;
              setStatus(String(error));
            }
          });
        }
      });
    }

    void connect().catch(error => { if (!disposed) setStatus(String(error)); });
    return () => {
      disposed = true;
      if (opened) void release();
      observer?.disconnect();
      terminal?.dispose();
    };
  }, [role, profile, course, lesson, scenario, expected, target]);

  const consoleView = <section className="vm-console" aria-label={role + " serial console"}>
    <div className="row">
      <h3>{role === "client" ? "Client" : "Server"} console</h3>
      <button className="btn" onClick={close}>Close console</button>
    </div>
    <p role="status">{status}</p>
    {target && <p className="small muted"><kbd>F6</kbd> switches between the reading and the terminal.</p>}
    <div ref={host} className="vm-console-screen" aria-label={role + " terminal"} onKeyDown={event => event.stopPropagation()} />
  </section>;
  return target ? createPortal(consoleView, target) : consoleView;
}
