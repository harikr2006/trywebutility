"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { convertBase } from "@/lib/tools/number-base";

export default function NumberBasePage() {
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [decimal, setDecimal] = useState("");
  const [hex, setHex] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleChange(value: string, base: 2 | 8 | 10 | 16) {
    const result = convertBase(value, base);
    if (!result.error) {
      setHasError(false);
      setBinary(result.binary);
      setOctal(result.octal);
      setDecimal(result.decimal);
      setHex(result.hex);
    } else {
      setHasError(true);
      if (base === 2) { setBinary(value); setOctal(""); setDecimal(""); setHex(""); }
      else if (base === 8) { setOctal(value); setBinary(""); setDecimal(""); setHex(""); }
      else if (base === 10) { setDecimal(value); setBinary(""); setOctal(""); setHex(""); }
      else { setHex(value); setBinary(""); setOctal(""); setDecimal(""); }
    }
  }

  const inputClass = (isError: boolean) =>
    `flex-1 h-9 rounded-md border px-3 font-mono text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none ${
      isError ? "border-destructive" : "border-border/60"
    }`;

  const rows: { label: string; value: string; base: 2 | 8 | 10 | 16 }[] = [
    { label: "Binary", value: binary, base: 2 },
    { label: "Octal", value: octal, base: 8 },
    { label: "Decimal", value: decimal, base: 10 },
    { label: "Hex", value: hex, base: 16 },
  ];

  return (
    <ToolShell
      title="Number Base Converter"
      description="Convert numbers between binary, octal, decimal, and hexadecimal."
    >
      <div className="flex flex-col gap-3 max-w-xl">
        {rows.map(({ label, value, base }) => (
          <div key={label} className="flex items-center gap-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-20 shrink-0">
              {label}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value, base)}
              placeholder={label}
              className={inputClass(hasError && value === "" && rows.some(r => r.base !== base && r.value !== ""))}
            />
            <CopyButton text={value} />
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

