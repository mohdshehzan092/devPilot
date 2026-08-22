import { cn } from "@/lib/utils";

export function statusColor(status?: number) {
  if (!status) return "text-muted-foreground";
  if (status < 300) return "text-status-success";
  if (status < 400) return "text-status-redirect";
  if (status < 500) return "text-status-client";
  return "text-status-server";
}

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

export function statusText(status?: number) {
  if (!status) return "";
  return STATUS_TEXT[status] ?? "";
}

export default function StatusPill({
  status,
  className,
}: {
  status?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono text-[11px] font-semibold",
        statusColor(status),
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status ?? "—"}
      {statusText(status) && (
        <span className="font-normal opacity-80">{statusText(status)}</span>
      )}
    </span>
  );
}
