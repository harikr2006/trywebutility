"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────
// String-based decimal arithmetic (no BigInt, no float errors)
// We represent all values as signed decimal strings and shift
// the decimal point by a fixed number of places.
// ─────────────────────────────────────────────────────────────

/**
 * Shift a decimal-string's decimal point by `places` digits.
 * Positive places = multiply by 10^places (shift right).
 * Negative places = divide by 10^places (shift left).
 */
function shiftDecimal(value: string, places: number): string {
  if (!value || value === "" || value === "-") return "";
  const negative = value.startsWith("-");
  const abs = negative ? value.slice(1) : value;

  // Split into integer and fractional parts
  const dotIdx = abs.indexOf(".");
  let intPart = dotIdx === -1 ? abs : abs.slice(0, dotIdx);
  let fracPart = dotIdx === -1 ? "" : abs.slice(dotIdx + 1);

  // Combine into a single digit string (no dot)
  const digits = intPart + fracPart;
  // Current decimal position from the right
  const currentDecimalPos = fracPart.length; // digits after decimal
  // New decimal position from the right
  const newDecimalPos = currentDecimalPos - places; // fewer fracDigits = right shift

  let result: string;
  if (newDecimalPos <= 0) {
    // All digits are integer, pad with zeros
    result = digits + "0".repeat(-newDecimalPos);
  } else if (newDecimalPos >= digits.length) {
    // All digits are fractional, pad with leading zeros
    const padded = "0".repeat(newDecimalPos - digits.length) + digits;
    result = "0." + padded;
  } else {
    const splitAt = digits.length - newDecimalPos;
    result = digits.slice(0, splitAt) + "." + digits.slice(splitAt);
  }

  // Remove leading zeros (but keep one before decimal)
  result = result.replace(/^0+(?=\d)/, "") || "0";
  // Remove trailing zeros after decimal
  if (result.includes(".")) {
    result = result.replace(/\.?0+$/, "");
  }

  return result ? (negative ? "-" + result : result) : "0";
}

// ── BTC units (relative to BTC) ───────────────────────────────
// mBTC  = 0.001 BTC  → shift = -3  (BTC → mBTC: multiply by 1000)
// μBTC  = 0.000001 BTC → shift = -6
// sat   = 0.00000001 BTC → shift = -8

type BtcField = "btc" | "mbtc" | "ubtc" | "sat";

interface BtcUnitDef {
  key: BtcField;
  label: string;
  symbol: string;
  desc: string;
  /** shift to go FROM btc TO this unit (positive = multiply by 10^shift) */
  shiftFromBtc: number;
}

const BTC_UNITS: BtcUnitDef[] = [
  { key: "btc",  label: "Bitcoin",      symbol: "BTC",  desc: "1 BTC",           shiftFromBtc:  0 },
  { key: "mbtc", label: "Millibitcoin", symbol: "mBTC", desc: "0.001 BTC",       shiftFromBtc:  3 },
  { key: "ubtc", label: "Bits / μBTC",  symbol: "μBTC", desc: "0.000001 BTC",    shiftFromBtc:  6 },
  { key: "sat",  label: "Satoshi",      symbol: "sat",  desc: "0.00000001 BTC",  shiftFromBtc:  8 },
];

// ── ETH units (relative to ETH) ───────────────────────────────
// Gwei = 10^-9 ETH → shift = 9
// Wei  = 10^-18 ETH → shift = 18

type EthField = "eth" | "gwei" | "wei";

interface EthUnitDef {
  key: EthField;
  label: string;
  symbol: string;
  desc: string;
  shiftFromEth: number;
}

const ETH_UNITS: EthUnitDef[] = [
  { key: "eth",  label: "Ether", symbol: "ETH",  desc: "1 ETH",     shiftFromEth:  0 },
  { key: "gwei", label: "Gwei",  symbol: "Gwei", desc: "10⁻⁹ ETH",  shiftFromEth:  9 },
  { key: "wei",  label: "Wei",   symbol: "Wei",  desc: "10⁻¹⁸ ETH", shiftFromEth: 18 },
];

// ── BTC Section ───────────────────────────────────────────────
function BtcSection() {
  const [values, setValues] = useState<Record<BtcField, string>>({
    btc: "1",
    mbtc: "1000",
    ubtc: "1000000",
    sat: "100000000",
  });

  function handleChange(field: BtcField, raw: string) {
    // only allow valid decimal input
    if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;
    const unit = BTC_UNITS.find((u) => u.key === field)!;
    // convert this field's value to BTC (shift left by shiftFromBtc)
    const btcValue = shiftDecimal(raw, -unit.shiftFromBtc);
    const next: Record<BtcField, string> = { ...values, [field]: raw };
    if (raw !== "" && raw !== "-" && raw !== ".") {
      for (const u of BTC_UNITS) {
        if (u.key !== field) {
          next[u.key] = shiftDecimal(btcValue, u.shiftFromBtc);
        }
      }
    }
    setValues(next);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <span className="text-orange-500 text-base">₿</span> Bitcoin Units
      </h3>
      <div className="space-y-2">
        {BTC_UNITS.map((unit) => (
          <div key={unit.key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="w-28 shrink-0">
              <div className="font-mono font-semibold text-sm text-foreground">{unit.symbol}</div>
              <div className="text-xs text-muted-foreground">{unit.label}</div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={values[unit.key]}
              onChange={(e) => handleChange(unit.key, e.target.value)}
              className="flex-1 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-0"
              placeholder="0"
            />
            <div className="text-xs text-muted-foreground text-right w-24 shrink-0">{unit.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden text-xs">
        <div className="bg-muted/40 px-3 py-1.5 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
          Reference
        </div>
        <table className="w-full">
          <tbody>
            {[
              ["1 BTC", "= 1,000 mBTC = 1,000,000 μBTC = 100,000,000 sat"],
              ["1 mBTC", "= 0.001 BTC = 100,000 sat"],
              ["1 μBTC", "= 0.000001 BTC = 100 sat"],
              ["1 sat", "= 0.00000001 BTC"],
            ].map(([label, eq]) => (
              <tr key={label} className="border-t border-border/40">
                <td className="px-3 py-1.5 font-mono font-medium text-foreground w-20">{label}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{eq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ETH Section ───────────────────────────────────────────────
function EthSection() {
  const [values, setValues] = useState<Record<EthField, string>>({
    eth: "1",
    gwei: "1000000000",
    wei: "1000000000000000000",
  });

  function handleChange(field: EthField, raw: string) {
    if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;
    const unit = ETH_UNITS.find((u) => u.key === field)!;
    const ethValue = shiftDecimal(raw, -unit.shiftFromEth);
    const next: Record<EthField, string> = { ...values, [field]: raw };
    if (raw !== "" && raw !== "-" && raw !== ".") {
      for (const u of ETH_UNITS) {
        if (u.key !== field) {
          next[u.key] = shiftDecimal(ethValue, u.shiftFromEth);
        }
      }
    }
    setValues(next);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <span className="text-blue-500 text-base">Ξ</span> Ethereum Units
      </h3>
      <div className="space-y-2">
        {ETH_UNITS.map((unit) => (
          <div key={unit.key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="w-28 shrink-0">
              <div className="font-mono font-semibold text-sm text-foreground">{unit.symbol}</div>
              <div className="text-xs text-muted-foreground">{unit.label}</div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={values[unit.key]}
              onChange={(e) => handleChange(unit.key, e.target.value)}
              className="flex-1 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-0"
              placeholder="0"
            />
            <div className="text-xs text-muted-foreground text-right w-24 shrink-0">{unit.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden text-xs">
        <div className="bg-muted/40 px-3 py-1.5 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
          Reference
        </div>
        <table className="w-full">
          <tbody>
            {[
              ["1 ETH", "= 10⁹ Gwei = 10¹⁸ Wei"],
              ["1 Gwei", "= 0.000000001 ETH = 10⁹ Wei"],
              ["1 Wei", "= 10⁻¹⁸ ETH = 10⁻⁹ Gwei"],
            ].map(([label, eq]) => (
              <tr key={label} className="border-t border-border/40">
                <td className="px-3 py-1.5 font-mono font-medium text-foreground w-20">{label}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{eq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Tab = "btc" | "eth";

export default function CryptoConverterPage() {
  const [tab, setTab] = useState<Tab>("btc");

  return (
    <ToolShell
      title="Crypto Unit Converter"
      description="Convert between Bitcoin (BTC, mBTC, μBTC, Satoshi) and Ethereum (ETH, Gwei, Wei) units with full decimal precision."
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          <Button
            variant={tab === "btc" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("btc")}
          >
            ₿ Bitcoin
          </Button>
          <Button
            variant={tab === "eth" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("eth")}
          >
            Ξ Ethereum
          </Button>
        </div>

        {tab === "btc" ? <BtcSection /> : <EthSection />}

        <p className="text-xs text-muted-foreground">
          Precision note: conversions use string-based decimal shifting — no floating-point rounding errors. BTC is precise to the satoshi (8 decimal places); ETH is precise to the wei (18 decimal places).
        </p>
      </div>
    </ToolShell>
  );
}
