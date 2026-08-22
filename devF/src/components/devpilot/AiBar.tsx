import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiBar({
  value,
  onChange,
  onRun,
  loading,
  placeholder,
  suggestions = [],
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  loading?: boolean;
  placeholder: string;
  suggestions?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-2/60 p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Sparkles
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ai"
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) onRun();
            }}
            placeholder={placeholder}
            className="field pl-8"
          />
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={loading || !value.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-ai px-3.5 py-2 text-[12px] font-semibold text-ai-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {loading ? "Thinking" : "Ask AI"}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
