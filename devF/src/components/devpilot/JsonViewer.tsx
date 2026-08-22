import { useMemo, useState } from "react";
import { Check, ChevronsDownUp, ChevronsUpDown, Copy, Search } from "lucide-react";
import { highlightLine, prettyJson } from "./highlight";
import { cn } from "@/lib/utils";

export default function JsonViewer({ data }: { data: unknown }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    const pretty = prettyJson(data);
    if (!collapsed) return pretty;
    try {
      return JSON.stringify(
        typeof data === "string" ? JSON.parse(data) : data,
      ) as string;
    } catch {
      return pretty;
    }
  }, [data, collapsed]);

  const lines = text.length ? text.split("\n") : ["// empty response body"];
  const matches = query
    ? lines.filter((l) => l.toLowerCase().includes(query.toLowerCase())).length
    : 0;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="relative min-w-0 flex-1">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search response..."
            className="field pl-7 font-mono text-[12px]"
          />
        </div>

        {query && (
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {matches} line{matches === 1 ? "" : "s"}
          </span>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
          className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          {collapsed ? <ChevronsUpDown size={14} /> : <ChevronsDownUp size={14} />}
        </button>

        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          {copied ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-input">
        <div className="flex min-h-full font-mono text-[13px] leading-[20px]">
          <div className="sticky left-0 w-12 shrink-0 border-r border-border bg-surface py-3 text-right select-none">
            {lines.map((_, i) => (
              <div key={i} className="px-2 text-muted-foreground/60">
                {i + 1}
              </div>
            ))}
          </div>

          <pre className="min-w-0 flex-1 py-3 whitespace-pre">
            {lines.map((line, i) => {
              const hit =
                query && line.toLowerCase().includes(query.toLowerCase());
              return (
                <div
                  key={i}
                  className={cn("px-3", hit && "bg-primary-soft")}
                >
                  {highlightLine(line, "json")}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
