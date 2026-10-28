/** Do not turn certificate, authentication, redirect or content failures into fallback reads. */
export function transientReleaseTransport(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (/^Temporary HTTP (429|5[0-9]{2})$/.test(error.message)) return true;
  if (error.name === "TimeoutError" || error.name === "AbortError") return true;
  const cause = error.cause as { code?: unknown } | undefined;
  return typeof cause?.code === "string" && ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN",
    "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT", "UND_ERR_BODY_TIMEOUT", "UND_ERR_SOCKET"].includes(cause.code);
}
