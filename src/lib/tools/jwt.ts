export interface JWTPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded;
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function decodeJWT(token: string): { data: JWTPayload | null; error: string | null } {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return { data: null, error: "Invalid JWT: must have 3 parts separated by dots" };
    }
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return {
      data: { header, payload, signature: parts[2] },
      error: null,
    };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

export function isExpired(payload: Record<string, unknown>): boolean {
  const exp = payload.exp as number | undefined;
  if (!exp) return false;
  return Date.now() / 1000 > exp;
}

export function formatUnixTime(ts: unknown): string {
  if (typeof ts !== "number") return String(ts);
  return new Date(ts * 1000).toUTCString();
}
