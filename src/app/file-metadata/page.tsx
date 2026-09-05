"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0").toUpperCase();
}

function buildHexDump(bytes: Uint8Array): string {
  const count = Math.min(bytes.length, 64);
  const lines: string[] = [];
  for (let row = 0; row < count; row += 16) {
    const chunk = Array.from(bytes.slice(row, Math.min(row + 16, count)));
    const addr = row.toString(16).padStart(4, "0").toUpperCase();
    const hex = chunk.map(toHex).join(" ").padEnd(47, " ");
    const ascii = chunk
      .map((b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : "."))
      .join("");
    lines.push(`${addr}  ${hex}  ${ascii}`);
  }
  return lines.join("\n");
}

function detectMime(bytes: Uint8Array): string {
  // Build hex string from first 12 bytes for magic byte matching
  const h = Array.from(bytes.slice(0, 12)).map(toHex).join("");
  if (h.startsWith("FFD8FF")) return "image/jpeg";
  if (h.startsWith("89504E47")) return "image/png";
  if (h.startsWith("47494638")) return "image/gif";
  if (h.startsWith("52494646") && h.slice(16, 24) === "57454250") return "image/webp";
  if (h.startsWith("424D")) return "image/bmp";
  if (h.startsWith("00000100") || h.startsWith("00000200")) return "image/x-icon";
  if (h.startsWith("25504446")) return "application/pdf";
  if (h.startsWith("504B0304")) return "application/zip";
  if (h.startsWith("504B0506") || h.startsWith("504B0708")) return "application/zip (empty/spanned)";
  if (h.startsWith("1F8B")) return "application/gzip";
  if (h.startsWith("377ABCAF271C")) return "application/x-7z-compressed";
  if (h.startsWith("52617221")) return "application/x-rar-compressed";
  if (h.startsWith("494433") || h.startsWith("FFFB") || h.startsWith("FFF3") || h.startsWith("FFF2"))
    return "audio/mpeg";
  if (h.startsWith("4F676753")) return "audio/ogg";
  if (h.startsWith("664C6143")) return "audio/flac";
  if (h.startsWith("52494646") && h.slice(16, 24) === "57415645") return "audio/wav";
  if (h.startsWith("000001BA") || h.startsWith("000001B3")) return "video/mpeg";
  if (h.startsWith("1A45DFA3")) return "video/webm";
  if (h.startsWith("3026B275")) return "video/x-ms-wmv";
  if (h.startsWith("EFBBBF") || h.startsWith("FFFE") || h.startsWith("FEFF")) return "text/plain (BOM)";
  // Check for plain text (all ASCII printable)
  const allPrintable = Array.from(bytes.slice(0, 64)).every(
    (b) => b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x20 && b < 0x80)
  );
  if (allPrintable) return "text/plain (likely)";
  return "application/octet-stream (binary)";
}

// Minimal JPEG EXIF parser
function parseJpegExif(bytes: Uint8Array): Record<string, string> {
  const result: Record<string, string> = {};
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return result;

  let i = 2;
  while (i < bytes.length - 3) {
    if (bytes[i] !== 0xff) break;
    const marker = bytes[i + 1];
    if (marker === 0xda) break; // SOS — start of scan, stop

    const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
    if (segLen < 2) break;

    if (marker === 0xe1 && i + 10 < bytes.length) {
      // APP1 — may contain EXIF
      const exifSig = String.fromCharCode(...Array.from(bytes.slice(i + 4, i + 10)));
      if (exifSig.startsWith("Exif")) {
        const tiff = i + 10; // TIFF header starts here
        if (tiff + 8 >= bytes.length) break;

        const byteOrder =
          bytes[tiff] === 0x49 && bytes[tiff + 1] === 0x49 ? "LE" : "BE";
        const le = byteOrder === "LE";

        function r16(off: number): number {
          const b = tiff + off;
          if (b + 1 >= bytes.length) return 0;
          return le ? bytes[b] | (bytes[b + 1] << 8) : (bytes[b] << 8) | bytes[b + 1];
        }
        function r32(off: number): number {
          const b = tiff + off;
          if (b + 3 >= bytes.length) return 0;
          return le
            ? (bytes[b] | (bytes[b + 1] << 8) | (bytes[b + 2] << 16) | (bytes[b + 3] << 24)) >>> 0
            : ((bytes[b] << 24) | (bytes[b + 1] << 16) | (bytes[b + 2] << 8) | bytes[b + 3]) >>> 0;
        }
        function rAscii(off: number, len: number): string {
          const b = tiff + off;
          return String.fromCharCode(...Array.from(bytes.slice(b, b + len)))
            .replace(/\0/g, "")
            .trim();
        }
        function rRational(off: number): string {
          const num = r32(off);
          const den = r32(off + 4);
          if (den === 0) return "0";
          return (num / den).toFixed(4);
        }

        const magic = r16(2); // Should be 0x002A for TIFF
        if (magic !== 0x002a) {
          i += 2 + segLen;
          continue;
        }

        const ifd0Offset = r32(4);
        if (ifd0Offset + 2 > bytes.length - tiff) {
          i += 2 + segLen;
          continue;
        }

        const numEntries = r16(ifd0Offset);
        const TAG_NAMES: Record<number, string> = {
          0x010f: "Camera Make",
          0x0110: "Camera Model",
          0x0112: "Orientation",
          0x011a: "X Resolution",
          0x011b: "Y Resolution",
          0x0128: "Resolution Unit",
          0x0132: "Date/Time",
          0x013b: "Artist",
          0x013e: "White Point",
          0x013f: "Primary Chromaticities",
          0x0213: "YCbCr Positioning",
          0x8769: "Exif IFD",
          0x8825: "GPS IFD",
          0xa003: "Pixel Y Dimension",
          0xa002: "Pixel X Dimension",
        };

        for (let e = 0; e < numEntries && e < 64; e++) {
          const eo = ifd0Offset + 2 + e * 12;
          if (eo + 12 > bytes.length - tiff) break;
          const tag = r16(eo);
          const type = r16(eo + 2);
          const count = r32(eo + 4);
          const tagName = TAG_NAMES[tag];
          if (!tagName) continue;

          if (type === 2) {
            // ASCII
            const dataOff = count <= 4 ? eo + 8 : r32(eo + 8);
            result[tagName] = rAscii(dataOff, count);
          } else if (type === 5 || type === 10) {
            // Rational or SRational
            const dataOff = r32(eo + 8);
            result[tagName] = rRational(dataOff);
          } else if (type === 3) {
            // SHORT
            result[tagName] = String(r16(eo + 8));
          } else if (type === 4 || type === 9) {
            // LONG or SLONG
            result[tagName] = String(r32(eo + 8));
          }
        }

        // Try GPS IFD
        if (result["GPS IFD"]) {
          const gpsOff = parseInt(result["GPS IFD"]);
          delete result["GPS IFD"];
          if (gpsOff + 2 < bytes.length - tiff) {
            const gpsEntries = r16(gpsOff);
            let latDeg = "",
              latRef = "",
              lonDeg = "",
              lonRef = "";
            for (let e = 0; e < gpsEntries && e < 32; e++) {
              const eo = gpsOff + 2 + e * 12;
              if (eo + 12 > bytes.length - tiff) break;
              const tag = r16(eo);
              const type = r16(eo + 2);
              const count = r32(eo + 4);
              if (tag === 1 && type === 2) {
                latRef = rAscii(eo + 8, count);
              } else if (tag === 2 && type === 5) {
                const off = r32(eo + 8);
                const d = r32(off) / (r32(off + 4) || 1);
                const m = r32(off + 8) / (r32(off + 12) || 1);
                const s = r32(off + 16) / (r32(off + 20) || 1);
                latDeg = `${d}° ${m}' ${s.toFixed(2)}"`;
              } else if (tag === 3 && type === 2) {
                lonRef = rAscii(eo + 8, count);
              } else if (tag === 4 && type === 5) {
                const off = r32(eo + 8);
                const d = r32(off) / (r32(off + 4) || 1);
                const m = r32(off + 8) / (r32(off + 12) || 1);
                const s = r32(off + 16) / (r32(off + 20) || 1);
                lonDeg = `${d}° ${m}' ${s.toFixed(2)}"`;
              }
            }
            if (latDeg) result["GPS Latitude"] = `${latDeg} ${latRef}`;
            if (lonDeg) result["GPS Longitude"] = `${lonDeg} ${lonRef}`;
          }
        }
        delete result["Exif IFD"];
      }
    }

    i += 2 + segLen;
  }

  return result;
}

function countPdfPages(bytes: Uint8Array): number {
  // Count /Type /Page entries (not /Pages) in decoded text
  const text = new TextDecoder("latin1").decode(bytes);
  // Match /Type /Page followed by a non-'s' character
  const matches = text.match(/\/Type\s*\/Page(?![s])/g);
  return matches ? matches.length : 0;
}

interface FileMeta {
  name: string;
  reportedType: string;
  detectedMime: string;
  size: number;
  lastModified: number;
  hexDump: string;
  isImage: boolean;
  imgWidth?: number;
  imgHeight?: number;
  exif?: Record<string, string>;
  pdfPages?: number;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-4 py-2.5 font-medium text-muted-foreground bg-muted/20 w-44 text-xs whitespace-nowrap">
        {label}
      </td>
      <td className="px-4 py-2.5 font-mono text-xs break-all">{value}</td>
    </tr>
  );
}

export default function FileMetadataPage() {
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [imgPreview, setImgPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    const isImage = file.type.startsWith("image/");
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(buf);
      const detectedMime = detectMime(bytes);
      const hexDump = buildHexDump(bytes);

      let exif: Record<string, string> | undefined;
      let pdfPages: number | undefined;

      if (file.type === "image/jpeg" || detectedMime === "image/jpeg") {
        exif = parseJpegExif(bytes);
      }
      if (isPdf || detectedMime === "application/pdf") {
        pdfPages = countPdfPages(bytes);
      }

      const baseMeta: FileMeta = {
        name: file.name,
        reportedType: file.type || "unknown",
        detectedMime,
        size: file.size,
        lastModified: file.lastModified,
        hexDump,
        isImage,
        exif: exif && Object.keys(exif).length > 0 ? exif : undefined,
        pdfPages,
      };

      if (isImage) {
        const url = URL.createObjectURL(file);
        if (imgPreview) URL.revokeObjectURL(imgPreview);
        setImgPreview(url);
        const img = new Image();
        img.onload = () =>
          setMeta({ ...baseMeta, imgWidth: img.naturalWidth, imgHeight: img.naturalHeight });
        img.src = url;
      } else {
        if (imgPreview) URL.revokeObjectURL(imgPreview);
        setImgPreview("");
        setMeta(baseMeta);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <ToolShell
      title="File Metadata Viewer"
      description="Inspect file metadata, MIME type from magic bytes, EXIF data for JPEG images, and a hex dump of the first 64 bytes."
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) processFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Drag & drop any file or{" "}
            <span className="text-primary font-medium">click to browse</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Images, PDFs, archives, audio, video — any file type
          </p>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
        </div>

        {meta && (
          <div className="space-y-5">
            {/* Image preview */}
            {imgPreview && (
              <img
                src={imgPreview}
                alt={meta.name}
                className="max-h-52 rounded-lg border border-border/60 object-contain"
              />
            )}

            {/* Basic metadata */}
            <div className="space-y-1.5">
              <h2 className="text-sm font-semibold">File Information</h2>
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <Row label="Name" value={meta.name} />
                    <Row label="Reported Type" value={meta.reportedType} />
                    <Row label="Detected MIME" value={meta.detectedMime} />
                    <Row label="Size" value={formatBytes(meta.size)} />
                    <Row
                      label="Last Modified"
                      value={new Date(meta.lastModified).toLocaleString()}
                    />
                    {meta.imgWidth !== undefined && (
                      <Row label="Dimensions" value={`${meta.imgWidth} × ${meta.imgHeight} px`} />
                    )}
                    {meta.pdfPages !== undefined && (
                      <Row
                        label="PDF Pages"
                        value={meta.pdfPages > 0 ? String(meta.pdfPages) : "Unknown (compressed)"}
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXIF data */}
            {meta.exif && Object.keys(meta.exif).length > 0 && (
              <div className="space-y-1.5">
                <h2 className="text-sm font-semibold">EXIF Data</h2>
                <div className="border border-border/60 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(meta.exif).map(([k, v]) => (
                        <Row key={k} label={k} value={v} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hex dump */}
            <div className="space-y-1.5">
              <h2 className="text-sm font-semibold">
                Hex Dump{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (first {Math.min(meta.size, 64)} bytes)
                </span>
              </h2>
              <pre className="bg-muted/40 border border-border/60 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
                {meta.hexDump}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
