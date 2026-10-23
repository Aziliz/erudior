// Public keys trusted to sign course catalogs (base64 Ed25519). Written by
// `npm run course-keys`; the matching secret key lives only in the GitHub secret
// COURSE_SIGNING_KEY and on the machine that generated it (.keys/, never committed).
// To rotate: add the new key here, ship an app update, then switch the secret.
export const COURSE_PUBLIC_KEYS: string[] = [];
