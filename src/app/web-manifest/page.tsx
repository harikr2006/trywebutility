"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Display = "standalone" | "fullscreen" | "minimal-ui" | "browser";
type Orientation = "any" | "portrait" | "landscape";

interface ManifestForm {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: Display;
  theme_color: string;
  background_color: string;
  orientation: Orientation;
}

function buildManifest(f: ManifestForm): string {
  const obj: Record<string, string> = {
    name: f.name || "My App",
    short_name: f.short_name || f.name || "App",
    description: f.description,
    start_url: f.start_url || "/",
    display: f.display,
    theme_color: f.theme_color,
    background_color: f.background_color,
    orientation: f.orientation,
  };
  if (!obj.description) delete obj.description;
  return JSON.stringify(obj, null, 2);
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";
const inputClass =
  "w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const selectClass =
  "w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function WebManifestPage() {
  const [form, setForm] = useState<ManifestForm>({
    name: "",
    short_name: "",
    description: "",
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    orientation: "any",
  });

  function set<K extends keyof ManifestForm>(key: K, val: ManifestForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const json = buildManifest(form);

  return (
    <ToolShell
      title="Web App Manifest Generator"
      description="Configure your Progressive Web App manifest.json with a live preview."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass}>App Name</label>
            <input
              className={inputClass}
              placeholder="My Awesome App"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Short Name</label>
            <input
              className={inputClass}
              placeholder="MyApp"
              value={form.short_name}
              onChange={(e) => set("short_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <Textarea
              className="resize-none text-sm"
              placeholder="A short description of your app"
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Start URL</label>
            <input
              className={inputClass}
              placeholder="/"
              value={form.start_url}
              onChange={(e) => set("start_url", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Display</label>
              <select
                className={selectClass}
                value={form.display}
                onChange={(e) => set("display", e.target.value as Display)}
              >
                <option value="standalone">standalone</option>
                <option value="fullscreen">fullscreen</option>
                <option value="minimal-ui">minimal-ui</option>
                <option value="browser">browser</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Orientation</label>
              <select
                className={selectClass}
                value={form.orientation}
                onChange={(e) => set("orientation", e.target.value as Orientation)}
              >
                <option value="any">any</option>
                <option value="portrait">portrait</option>
                <option value="landscape">landscape</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.theme_color}
                  onChange={(e) => set("theme_color", e.target.value)}
                  className="h-9 w-12 rounded-md border border-border/60 cursor-pointer p-0.5 bg-transparent"
                />
                <code className="text-xs font-mono">{form.theme_color}</code>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.background_color}
                  onChange={(e) => set("background_color", e.target.value)}
                  className="h-9 w-12 rounded-md border border-border/60 cursor-pointer p-0.5 bg-transparent"
                />
                <code className="text-xs font-mono">{form.background_color}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className={labelClass}>manifest.json Preview</p>
            <div className="flex gap-2 items-center">
              <CopyButton text={json} />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => downloadFile(json, "manifest.json")}
              >
                Download
              </Button>
            </div>
          </div>
          <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto min-h-64 whitespace-pre">
            {json}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
