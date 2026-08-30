export interface JWTGeneratorPayload {
  [key: string]: unknown;
}

export function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generateJWT(
  payload: JWTGeneratorPayload,
  secret: string,
  algorithm: "HS256" | "HS384" | "HS512"
): Promise<{ token: string; error: string | null }> {
  try {
    const hashAlgorithms: Record<string, string> = {
      HS256: "SHA-256",
      HS384: "SHA-384",
      HS512: "SHA-512",
    };

    const header = { alg: algorithm, typ: "JWT" };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: hashAlgorithms[algorithm] } },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(signingInput));
    const encodedSignature = base64UrlEncodeBuffer(signature);

    const token = `${signingInput}.${encodedSignature}`;
    return { token, error: null };
  } catch (err) {
    return { token: "", error: err instanceof Error ? err.message : String(err) };
  }
}
