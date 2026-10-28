import QRCode from "qrcode";

export async function generateQRDataURL(
  text: string,
  size: number = 300
): Promise<{ dataUrl: string; error: string | null }> {
  try {
    const dataUrl = await QRCode.toDataURL(text, { width: size });
    return { dataUrl, error: null };
  } catch (err) {
    return { dataUrl: "", error: err instanceof Error ? err.message : String(err) };
  }
}

export async function generateQRSVG(
  text: string
): Promise<{ svg: string; error: string | null }> {
  try {
    const svg = await QRCode.toString(text, { type: "svg" });
    return { svg, error: null };
  } catch (err) {
    return { svg: "", error: err instanceof Error ? err.message : String(err) };
  }
}
