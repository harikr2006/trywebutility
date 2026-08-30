"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { octalToChmod, bitsToChmod } from "@/lib/tools/chmod";

type Perms = { read: boolean; write: boolean; execute: boolean };

function toBits(p: Perms) { return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0); }

export default function ChmodPage() {
  const [owner, setOwner] = useState<Perms>({ read: true, write: true, execute: false });
  const [group, setGroup] = useState<Perms>({ read: true, write: false, execute: false });
  const [others, setOthers] = useState<Perms>({ read: true, write: false, execute: false });

  const result = bitsToChmod(toBits(owner), toBits(group), toBits(others));

  function toggle(who: "owner" | "group" | "others", bit: keyof Perms) {
    const setters = { owner: setOwner, group: setGroup, others: setOthers };
    const getters = { owner, group, others };
    setters[who]({ ...getters[who], [bit]: !getters[who][bit] });
  }

  const sections: { label: string; who: "owner" | "group" | "others"; perms: Perms }[] = [
    { label: "Owner", who: "owner", perms: owner },
    { label: "Group", who: "group", perms: group },
    { label: "Others", who: "others", perms: others },
  ];

  return (
    <ToolShell title="Chmod Calculator" description="Calculate Unix file permission modes between symbolic and numeric (octal) representations.">
      <div className="space-y-6 max-w-lg">
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border/60">
                <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Who</th>
                {["Read (r)", "Write (w)", "Execute (x)"].map(h => (
                  <th key={h} className="px-4 py-2 text-center font-semibold text-muted-foreground">{h}</th>
                ))}
                <th className="px-4 py-2 text-center font-semibold text-muted-foreground">Octal</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(({ label, who, perms }) => (
                <tr key={who} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-medium">{label}</td>
                  {(["read", "write", "execute"] as const).map((bit) => (
                    <td key={bit} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={perms[bit]}
                        onChange={() => toggle(who, bit)}
                        className="h-4 w-4 cursor-pointer accent-primary"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-mono">{toBits(perms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          {[
            { label: "Numeric (Octal)", value: result.numeric },
            { label: "Symbolic", value: result.symbolic },
            { label: "chmod command", value: `chmod ${result.numeric} filename` },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-base font-bold text-foreground">{value}</code>
                <CopyButton text={value} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
