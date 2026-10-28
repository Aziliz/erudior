import { createHash } from "node:crypto";
import { verifySignature } from "../../src/lib/courseSign";

// Incident-specific allowlist. These are repository-history bytes, not newly signed content.
export const GERMAN_RECOVERY = [
  { id: "lang-german-a1", file: "lang-german-a1.r3.json", source: "languages/lang-german-a1.json", expected: "f1697c416f9beb989a11b3de716c7dcb36e41cf81a3c39b742351a4ed57cfa86", previous: "701456a4be27e8ea8ce273e6ecbbb35e7c2a686e16760318b8634b64577bf555" },
  { id: "lang-german-a2", file: "lang-german-a2.r2.json", source: "languages/lang-german-a2.json", expected: "f62025c229f443b947d83f5e6ad583c1223e364fcefe37118545d4894621b558", previous: "6e307fa4c6b214a044cb8ebe7cb1e0b7e6c1b8e67addb552d8b5b745a0f190aa" },
  { id: "lang-german-b1", file: "lang-german-b1.r2.json", source: "languages/lang-german-b1.json", expected: "7360c5973c0be948c698e9aa889542136f22ba54d8ac991583ba2d79f2e25fa8", previous: "016cef58d2f7164fb87aee4d68dbb1158e425de704ee13ea335db822783edff6" },
] as const;
export const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

export function recoveryDecision(catalogBytes: Uint8Array, signature: string, keys: string[],
  incident: typeof GERMAN_RECOVERY[number], source: Uint8Array, remote: Uint8Array): "restore" | "unchanged" {
  if (!verifySignature(catalogBytes, signature, keys)) throw Error("Recovery refused: catalog signature invalid.");
  const catalog = JSON.parse(new TextDecoder().decode(catalogBytes));
  if (catalog.format !== "examiner-catalog" || catalog.version !== 1 || !Array.isArray(catalog.courses))
    throw Error("Recovery refused: catalog schema invalid.");
  const matches = catalog.courses.filter((c: { id?: string; file?: string }) => c.id === incident.id || c.file === incident.file);
  if (matches.length !== 1 || matches[0].id !== incident.id || matches[0].file !== incident.file || matches[0].sha256 !== incident.expected)
    throw Error("Recovery refused: catalog no longer matches this incident.");
  if (digest(source) !== incident.expected) throw Error("Recovery refused: source does not match signed digest.");
  const actual = digest(remote);
  if (actual === incident.expected) return "unchanged";
  if (actual !== incident.previous) throw Error("Recovery refused: unexpected origin bytes; investigate before writing.");
  return "restore";
}
