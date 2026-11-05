// Test-only transport helpers. Recovery never launches/reloads the application or
// repeats a native operation: the original in-page token must survive attachment.
export function bounded(operation, milliseconds, label) {
  let timer;
  return Promise.race([
    Promise.resolve().then(operation),
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}
export function disconnected(error) {
  return /Target.*closed|Target.*disconnected|Connection closed|Browser.*closed|Page.*closed/i.test(String(error?.message ?? error));
}
export async function readOperation({ getPage, reattach, token, timeout = 45000, poll = 100 }) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    let state;
    try {
      state = await bounded(() => getPage().evaluate(() => window.__portableResult), Math.max(1, end - Date.now()), 'Read native operation');
    } catch (error) {
      if (!disconnected(error)) throw error;
      await bounded(reattach, Math.max(1, end - Date.now()), 'Reattach native operation');
      continue;
    }
    if (!state || state.token !== token) throw new Error('Original native operation token missing after attachment');
    if (!state.pending) return state;
    await new Promise(resolve => setTimeout(resolve, Math.min(poll, Math.max(1, end - Date.now()))));
  }
  throw new Error('Native operation did not settle before deadline');
}
export async function cleanupStep(operation, label, report = console.error, timeout = 3000) {
  try { await bounded(operation, timeout, label); }
  catch (error) { report(`${label}: ${String(error?.message ?? error)}`); }
}
