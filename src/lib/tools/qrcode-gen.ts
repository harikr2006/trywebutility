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
