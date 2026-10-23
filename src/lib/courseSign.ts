// Signed course packages. The website publishes catalog.json plus catalog.json.sig, an
// Ed25519 signature of the catalog's exact bytes. The catalog lists every course file with
// its SHA-256, so one signature covers every package. Used by the app (browser or Tauri)
// and by scripts/publish-courses.mjs (Node 20+), which both have WebCrypto.

import nacl from "tweetnacl";

export const b64 = {
  encode(bytes: Uint8Array): string {
    let s = "";
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s);
  },
  decode(text: string): Uint8Array {
    const s = atob(text.trim());
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  },
};

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** True when `sig` (base64) is a valid signature of `bytes` by any of the trusted public keys. */
export function verifySignature(bytes: Uint8Array, sig: string, publicKeys: string[]): boolean {
  let signature: Uint8Array;
  try {
    signature = b64.decode(sig);
  } catch {
    return false;
  }
  if (signature.length !== nacl.sign.signatureLength) return false;
  return publicKeys.some((k) => {
    try {
      const key = b64.decode(k);
      return key.length === nacl.sign.publicKeyLength && nacl.sign.detached.verify(bytes, signature, key);
    } catch {
      return false;
    }
  });
}

export function signBytes(bytes: Uint8Array, secretKey: Uint8Array): string {
  return b64.encode(nacl.sign.detached(bytes, secretKey));
}

export function newKeyPair(): { publicKey: string; secretKey: string } {
  const kp = nacl.sign.keyPair();
  return { publicKey: b64.encode(kp.publicKey), secretKey: b64.encode(kp.secretKey) };
}

export function publicKeyOf(secretKey: string): string {
  return b64.encode(nacl.sign.keyPair.fromSecretKey(b64.decode(secretKey)).publicKey);
}
