import { useLayoutEffect, useRef } from "react";
import { highlightLine } from "./highlight";
import { cn } from "@/lib/utils";

export default function CodeEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  language = "json",
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  language?: "json" | "js";
  className?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value.length ? value.split("\n") : [""];

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  useLayoutEffect(syncScroll, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = ta;
    const next = `${value.slice(0, s)}  ${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = s + 2;
    });
  };

  return (
    <div
      className={cn(
        "relative flex min-h-0 overflow-hidden rounded-lg border border-border bg-input font-mono text-[13px] leading-[20px]",
        className,
      )}
    >
      <div
        ref={gutterRef}
        aria-hidden
        className="w-12 shrink-0 overflow-hidden border-r border-border bg-surface py-3 text-right select-none"
      >
        {lines.map((_, i) => (
          <div key={i} className="px-2 text-muted-foreground/60">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden px-3 py-3 whitespace-pre text-foreground"
        >
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, language)}</div>
          ))}
        </pre>

        <textarea
          ref={taRef}
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          {...(onBlur ? { onBlur } : {})}
          placeholder={placeholder ?? ""}
          className="absolute inset-0 h-full w-full resize-none bg-transparent px-3 py-3 whitespace-pre text-transparent caret-primary outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
