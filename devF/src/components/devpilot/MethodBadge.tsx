import { cn } from "@/lib/utils";

const METHOD_CLASS: Record<string, string> = {
  GET: "text-method-get",
  POST: "text-method-post",
  PUT: "text-method-put",
  PATCH: "text-method-patch",
  DELETE: "text-method-delete",
};

export function methodColor(method?: string) {
  return METHOD_CLASS[(method || "GET").toUpperCase()] ?? "text-muted-foreground";
}

export default function MethodBadge({
  method,
  className,
  block,
}: {
  method?: string;
  className?: string;
  block?: boolean;
}) {
  const label = (method || "GET").toUpperCase();

  return (
    <span
      className={cn(
        "font-mono text-[10px] font-bold tracking-wider uppercase",
        block &&
          "inline-flex w-[54px] shrink-0 justify-center rounded-md border border-border bg-surface-2 px-1.5 py-0.5",
        methodColor(label),
        className,
      )}
    >
      {label}
    </span>
  );
}
