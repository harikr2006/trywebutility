"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { xmlToYaml, yamlToXml } from "@/lib/tools/xml-yaml";

const XML_EXAMPLE = `<?xml version="1.0"?>
<person>
  <name>Alice</name>
  <age>30</age>
</person>`;

export default function XmlYamlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"xml-to-yaml" | "yaml-to-xml">(
    "xml-to-yaml"
  );

  function handleConvert(dir: "xml-to-yaml" | "yaml-to-xml") {
    setDirection(dir);
    const result =
      dir === "xml-to-yaml" ? xmlToYaml(input) : yamlToXml(input);
    if (result.error) {
      setError(result.error);
      setOutput("");
    } else {
      setError(null);
      setOutput(result.output);
    }
  }

  const inputLabel = direction === "xml-to-yaml" ? "XML Input" : "YAML Input";
  const outputLabel =
    direction === "xml-to-yaml" ? "YAML Output" : "XML Output";

  return (
    <ToolShell
      title="XML ↔ YAML"
      description="Convert between XML and YAML formats."
    >
      <div className="space-y-4">
        {/* Direction buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="h-8"
            variant={direction === "xml-to-yaml" ? "default" : "outline"}
            onClick={() => handleConvert("xml-to-yaml")}
          >
            XML → YAML
          </Button>
          <Button
            size="sm"
            className="h-8"
            variant={direction === "yaml-to-xml" ? "default" : "outline"}
            onClick={() => handleConvert("yaml-to-xml")}
          >
            YAML → XML
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {inputLabel}
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                direction === "xml-to-yaml"
                  ? XML_EXAMPLE
                  : "person:\n  name: Alice\n  age: 30"
              }
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {outputLabel}
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
