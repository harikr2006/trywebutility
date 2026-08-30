export function fileToBase64(file: File): Promise<{ dataUrl: string; mimeType: string; sizeKB: number; error: string | null }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      const mimeType = file.type || "application/octet-stream";
      resolve({ dataUrl, mimeType, sizeKB, error: null });
    };
    reader.onerror = () => resolve({ dataUrl: "", mimeType: "", sizeKB: 0, error: "Failed to read file" });
    reader.readAsDataURL(file);
  });
}

export function base64ToImageTag(dataUrl: string, alt = "image"): string {
  return `<img src="${dataUrl}" alt="${alt}" />`;
}

export function base64ToCSSBackground(dataUrl: string): string {
  return `background-image: url("${dataUrl}");`;
}
