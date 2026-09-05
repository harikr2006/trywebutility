"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";

interface ScriptEntry {
  key: string;
  command: string;
  checked: boolean;
}

type Category = { label: string; scripts: ScriptEntry[] };

const DEFAULT_CATEGORIES: Category[] = [
  {
    label: "Dev",
    scripts: [
      { key: "start", command: "node index.js", checked: true },
      { key: "dev", command: "nodemon index.js", checked: true },
      { key: "watch", command: "tsc --watch", checked: false },
    ],
  },
  {
    label: "Build",
    scripts: [
      { key: "build", command: "tsc", checked: true },
      { key: "build:prod", command: "NODE_ENV=production tsc", checked: false },
      { key: "bundle", command: "webpack --mode production", checked: false },
    ],
  },
  {
    label: "Test",
    scripts: [
      { key: "test", command: "jest", checked: true },
      { key: "test:watch", command: "jest --watch", checked: false },
      { key: "test:coverage", command: "jest --coverage", checked: false },
      { key: "lint", command: "eslint . --ext .ts,.tsx,.js", checked: true },
      { key: "lint:fix", command: "eslint . --ext .ts,.tsx,.js --fix", checked: false },
    ],
  },
  {
    label: "Utility",
    scripts: [
      { key: "format", command: "prettier --write .", checked: false },
      { key: "clean", command: "rimraf dist", checked: false },
      { key: "prepare", command: "husky install", checked: false },
      { key: "postinstall", command: "patch-package", checked: false },
    ],
  },
];

const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

export default function NpmScriptsPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  function toggleScript(catIdx: number, scriptIdx: number) {
    setCategories((prev) => {
      const next = prev.map((c, ci) =>
        ci !== catIdx
          ? c
          : {
              ...c,
              scripts: c.scripts.map((s, si) =>
                si !== scriptIdx ? s : { ...s, checked: !s.checked }
              ),
            }
      );
      return next;
    });
  }

  function updateCommand(catIdx: number, scriptIdx: number, val: string) {
    setCategories((prev) => {
      const next = prev.map((c, ci) =>
        ci !== catIdx
          ? c
          : {
              ...c,
              scripts: c.scripts.map((s, si) =>
                si !== scriptIdx ? s : { ...s, command: val }
              ),
            }
      );
      return next;
    });
  }

  const activeScripts = categories.flatMap((c) =>
    c.scripts.filter((s) => s.checked)
  );

  const scriptsObject = Object.fromEntries(activeScripts.map((s) => [s.key, s.command]));

  const scriptsJson = JSON.stringify(scriptsObject, null, 2);

  const fullPackageJson = JSON.stringify(
    {
      name: "my-project",
      version: "1.0.0",
      scripts: scriptsObject,
    },
    null,
    2
  );

  const scriptsCopyText = `"scripts": ${scriptsJson}`;

  return (
    <ToolShell
      title="NPM Script Builder"
      description="Select and customize npm scripts, then copy the configuration for your package.json."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Script selector */}
        <div className="space-y-5">
          {categories.map((cat, ci) => (
            <div key={cat.label}>
              <p className={`${labelClass} mb-2`}>{cat.label}</p>
              <div className="space-y-2">
                {cat.scripts.map((script, si) => (
                  <div key={script.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={script.checked}
                      onChange={() => toggleScript(ci, si)}
                      id={`script-${ci}-${si}`}
                      className="accent-primary shrink-0"
                    />
                    <label
                      htmlFor={`script-${ci}-${si}`}
                      className="font-mono text-xs w-28 shrink-0 cursor-pointer"
                    >
                      {script.key}
                    </label>
                    <input
                      className="flex-1 rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={script.command}
                      onChange={(e) => updateCommand(ci, si, e.target.value)}
                      disabled={!script.checked}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="space-y-5">
          {/* Scripts object */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className={labelClass}>Scripts Object</p>
              <CopyButton text={scriptsCopyText} />
            </div>
            <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto min-h-28 whitespace-pre">
              {activeScripts.length === 0
                ? '// No scripts selected'
                : `"scripts": ${scriptsJson}`}
            </pre>
          </div>

          {/* Full package.json */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className={labelClass}>package.json Snippet</p>
              <CopyButton text={fullPackageJson} />
            </div>
            <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto min-h-28 whitespace-pre">
              {fullPackageJson}
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
