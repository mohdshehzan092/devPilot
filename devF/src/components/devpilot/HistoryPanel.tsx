import { useEffect, useMemo, useState } from "react";
import { Clock, History as HistoryIcon, Search, Trash2 } from "lucide-react";

import { useHistory } from "@/context/HistoryContext";
import { useRequest } from "@/context/RequestContext";
import { useExecution } from "@/context/ExecutionContext";
import MethodBadge from "./MethodBadge";
import { statusColor } from "./StatusPill";
import { cn } from "@/lib/utils";

function timeAgo(value?: string) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diff)) return "";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function HistoryPanel() {
  const { history, loadHistory, getHistory, removeHistory } = useHistory();
  const { restoreRequest } = useRequest();
  const { restoreResponse } = useExecution();

  const [query, setQuery] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const items = useMemo(
    () =>
      history.filter((item: any) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          item.url?.toLowerCase().includes(q) ||
          item.method?.toLowerCase().includes(q) ||
          String(item.responseStatus || "").includes(q)
        );
      }),
    [history, query],
  );

  const restore = async (id: string) => {
    const entry: any = await getHistory(id);

    restoreRequest({
      _id: entry.requestId,
      method: entry.method,
      url: entry.url,
      headers: entry.requestHeaders || [],
      queryParams: entry.queryParams || [],
      pathParams: entry.pathParams || [],
      body:
        typeof entry.requestBody === "string"
          ? entry.requestBody
          : JSON.stringify(entry.requestBody, null, 2),
      bodyType: entry.bodyType || "NONE",
      auth: entry.auth || {},
      testScript: entry.testScript || "",
    });

    restoreResponse({
      status: entry.responseStatus,
      headers: entry.responseHeaders,
      responseTime: entry.responseTime,
      size: entry.responseSize,
      response: entry.responseBody,
      tests: { passed: 0, failed: 0, results: [] },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border px-3 py-3">
        <div className="mb-2.5 flex items-center gap-2">
          <HistoryIcon size={14} className="text-primary" />
          <h2 className="text-[13px] font-semibold">History</h2>
          <span className="ml-auto rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {history.length}
          </span>
        </div>

        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history..."
            className="field pl-7"
          />
        </div>
      </div>

      <div className="scroll-thin min-h-0 flex-1">
        {items.length === 0 ? (
          <p className="px-3 py-10 text-center text-[12px] text-muted-foreground">
            No executions yet
          </p>
        ) : (
          items.map((item: any) => (
            <div
              key={item._id}
              onClick={() => restore(item._id)}
              className="group grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2.5 transition-colors hover:bg-surface-2/70"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MethodBadge method={item.method} block />
                  <span
                    className={cn(
                      "font-mono text-[11px] font-semibold",
                      statusColor(item.responseStatus),
                    )}
                  >
                    {item.responseStatus ?? "ERR"}
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-[11.5px] text-muted-foreground">
                  {item.url}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
                  <Clock size={10} />
                  {item.responseTime ? `${item.responseTime} ms` : "—"}
                  <span className="text-border-strong">·</span>
                  {timeAgo(item.createdAt || item.updatedAt)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(item._id);
                }}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/12 hover:text-destructive"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
