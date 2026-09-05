"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle, Download } from "lucide-react";
import QRCode from "qrcode";

const SIZE_OPTIONS = [200, 300, 400];
const SECURITY_OPTIONS = [
  { label: "WPA/WPA2", value: "WPA" },
  { label: "WEP", value: "WEP" },
  { label: "None", value: "nopass" },
];

async function generateWifiQR(
  ssid: string,
  password: string,
  security: string,
  hidden: boolean,
  size: number
): Promise<string> {
  let wifiString = `WIFI:T:${security};S:${ssid};`;
  if (security !== "nopass") wifiString += `P:${password};`;
  wifiString += `H:${hidden};;`;
  return QRCode.toDataURL(wifiString, { width: size, margin: 2 });
}

export default function WifiQRPage() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [security, setSecurity] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState(300);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(
    currentSsid = ssid,
    currentPassword = password,
    currentSecurity = security,
    currentHidden = hidden,
    currentSize = size
  ) {
    if (!currentSsid.trim()) {
      setError("Please enter a network name (SSID).");
      setDataUrl("");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const url = await generateWifiQR(
        currentSsid,
        currentPassword,
        currentSecurity,
        currentHidden,
        currentSize
      );
      setDataUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code.");
      setDataUrl("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGenerate(ssid, password, security, hidden, size);
  }, [ssid, password, security, hidden, size]);

  return (
    <ToolShell
      title="WiFi QR Code Generator"
      description="Generate a QR code for your WiFi network. Guests scan it to connect instantly — no password typing needed."
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Network Name (SSID)
          </label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="My Home WiFi"
            className="w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Security Type
          </label>
          <div className="flex gap-1">
            {SECURITY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                className="h-8"
                variant={security === opt.value ? "default" : "outline"}
                onClick={() => setSecurity(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {security !== "nopass" && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="WiFi password"
                className="w-full h-9 rounded-md border border-border/60 bg-background px-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              QR Size
            </label>
            <div className="flex gap-1">
              {SIZE_OPTIONS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  className="h-8"
                  variant={size === s ? "default" : "outline"}
                  onClick={() => setSize(s)}
                >
                  {s}px
                </Button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground">Hidden network</span>
          </label>
        </div>

        <Button
          size="sm"
          className="h-8"
          onClick={() => handleGenerate()}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {dataUrl && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with a phone camera to instantly connect to WiFi — no typing needed.
            </p>
            <div className="flex justify-center">
              <img
                src={dataUrl}
                alt="WiFi QR Code"
                width={size}
                height={size}
                className="rounded-lg border p-4 bg-white"
              />
            </div>
            <div className="flex justify-center">
              <a href={dataUrl} download="wifi-qr.png">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
