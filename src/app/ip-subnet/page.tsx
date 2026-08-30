"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { calculateSubnet } from "@/lib/tools/ip-subnet";

export default function IPSubnetPage() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<ReturnType<typeof calculateSubnet> | null>(null);

  function handleCalc() {
    setResult(calculateSubnet(input));
  }

  const rows: [string, string | number][] = result && !result.error ? [
    ["Network Address", result.networkAddress],
    ["Broadcast Address", result.broadcastAddress],
    ["First Host", result.firstHost],
    ["Last Host", result.lastHost],
    ["Subnet Mask", result.subnetMask],
    ["Wildcard Mask", result.wildcardMask],
    ["CIDR Prefix", `/${result.cidr}`],
    ["Total Hosts", result.totalHosts.toLocaleString()],
    ["Usable Hosts", result.usableHosts.toLocaleString()],
    ["IP Class", result.ipClass],
  ] : [];

  return (
    <ToolShell title="IP Subnet Calculator" description="Calculate network address, broadcast, host range, and more from CIDR notation.">
      <div className="space-y-4 max-w-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.0/24"
            className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            onKeyDown={(e) => e.key === "Enter" && handleCalc()}
          />
          <Button size="sm" className="h-9" onClick={handleCalc}>Calculate</Button>
        </div>

        {result?.error && (
          <div className="flex gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{result.error}</span>
          </div>
        )}

        {rows.length > 0 && (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground font-medium w-44">{label}</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">{value}</td>
                    <td className="px-4 py-2.5 text-right">
                      <CopyButton text={String(value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
