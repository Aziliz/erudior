import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type MediaState = { dvd: boolean; kit: boolean; message: string };
const dvdUrl = "https://repo.almalinux.org/almalinux/10.3/isos/x86_64/AlmaLinux-10.3-x86_64-dvd.iso";
const kitUrl = "https://app.erudior.com/downloads/Erudior-AlmaLinux-10.3-Practice-Kit.zip";

export default function AlmaSetupMedia({ preparing }: { preparing: boolean }) {
  const [media, setMedia] = useState<MediaState | null>(null);
  const [picking, setPicking] = useState<"dvd" | "kit" | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let pending = false;
    async function refresh() {
      if (pending) return;
      pending = true;
      try {
        const data = await invoke<MediaState>("vm_setup_media", { kind: "status" });
        if (active) setMedia(data);
      } catch { /* The lesson reports provider startup errors. */ }
      finally { pending = false; }
    }
    void refresh();
    const interval = preparing || picking ? window.setInterval(refresh, 3000) : undefined;
    return () => { active = false; window.clearInterval(interval); };
  }, [preparing, picking]);

  async function choose(kind: "dvd" | "kit") {
    setPicking(kind);
    setError("");
    try {
      const result = await invoke<MediaState | null>("vm_setup_media", { kind });
      if (result) setMedia(result);
    } catch (cause) { setError(String(cause)); }
    finally { setPicking(null); }
  }

  return <div className="stack">
    <p>On first use, Erudior downloads the <a href={dvdUrl} target="_blank" rel="noreferrer">AlmaLinux 10.3 DVD</a> (10.1 GiB) and uses the included <a href={kitUrl} target="_blank" rel="noreferrer">practice kit</a> to install the lab. Erudior verifies both files. If you already have the files, select them below. You can use them offline.</p>
    <div className="row">
      <button className="btn" disabled={preparing || !!picking} onClick={() => void choose("dvd")}>Choose DVD ISO</button>
      {media?.dvd && <span>DVD cached</span>}
      <button className="btn" disabled={preparing || !!picking} onClick={() => void choose("kit")}>Choose practice kit ZIP</button>
      {media?.kit && <span>Kit cached</span>}
    </div>
    {(picking || preparing) && <p role="status">{media?.message || "Preparing the lab media…"}</p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
