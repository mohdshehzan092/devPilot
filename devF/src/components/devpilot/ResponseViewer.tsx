import { useState } from "react";
import { AlertTriangle, Clock, HardDrive, Loader2, Sparkles } from "lucide-react";

import { useExecution } from "@/context/ExecutionContext";
import * as aiService from "@/services/ai.service";

import JsonViewer from "./JsonViewer";
import AiBar from "./AiBar";
import StatusPill, { statusColor } from "./StatusPill";
import { cn } from "@/lib/utils";

const TABS = ["body", "headers", "tests"] as const;
type Tab = (typeof TABS)[number];

export default function ResponseViewer() {
  const { response, loading } = useExecution();

  const [tab, setTab] = useState<Tab>("body");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const runAI = async () => {
    if (!aiPrompt.trim() || aiLoading || !response) return;

    try {
      setAiLoading(true);
      setAiResult("");

      const prompt = aiPrompt.toLowerCase();

      if (prompt.includes("test")) {
        const result = await aiService.generateTests(response.response);
        setAiResult(result?.script || "AI could not generate tests.");
        setTab("tests");
        return;
      }

      if (
        prompt.includes("summary") ||
        prompt.includes("summarize") ||
        prompt.includes("summarise")
      ) {
        const result = await aiService.summarizeResponse(response.response);
        setAiResult(result?.summary || "AI could not summarize the response.");
        return;
      }

      if (prompt.includes("error") || prompt.includes("explain")) {
        const result = await aiService.explainError({
          status: response.status,
          error: response.error,
          response: response.response,
        });
        setAiResult(result?.explanation || "AI could not explain the error.");
        return;
      }

      setAiResult(
        "Try: summarize response, generate tests, or explain error.",
      );
    } catch (error) {
      console.error("Response AI Error:", error);
      setAiResult("AI request failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const header = (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-3 py-2.5">
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Response
      </span>

      {response && (
        <>
          <StatusPill status={response.status} />
          <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground">
            <Clock size={12} />
            {response.responseTime ?? "—"} ms
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground">
            <HardDrive size={12} />
            {response.size ?? "—"} B
          </span>
        </>
      )}

      {loading && (
        <span className="ml-auto flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <Loader2 size={12} className="animate-spin" /> Executing
        </span>
      )}
    </div>
  );

  if (!response) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {header}
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-6 text-center">
          <Sparkles size={18} className="text-muted-foreground" />
          <p className="text-[13px] font-medium">No response yet</p>
          <p className="text-[12px] text-muted-foreground">
            Hit Send to execute this request.
          </p>
        </div>
      </div>
    );
  }

  const aiBar = (
    <div className="shrink-0 border-b border-border p-2.5">
      <AiBar
        value={aiPrompt}
        onChange={setAiPrompt}
        onRun={runAI}
        loading={aiLoading}
        placeholder={
          response.success
            ? "Ask AI: summarize response, generate tests..."
            : "Ask AI to explain this error..."
        }
        suggestions={
          response.success
            ? ["Summarize response", "Generate tests"]
            : ["Explain error"]
        }
      />

      {aiResult && (
        <div className="animate-fade-up mt-2 rounded-lg border border-border bg-surface-2/60 p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-ai uppercase">
            <Sparkles size={11} /> AI result
          </p>
          <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap">
            {aiResult}
          </p>
        </div>
      )}
    </div>
  );

  if (!response.success) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {header}
        {aiBar}

        <div className="scroll-thin min-h-0 flex-1 p-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3 py-2.5">
            <AlertTriangle size={15} className="shrink-0 text-destructive" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-destructive">
                Request failed
              </p>
              <p className="truncate text-[12px] text-muted-foreground">
                {response.error?.message || "The request could not be executed."}
              </p>
            </div>
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-3">
            {[
              ["Status", response.status ?? "—"],
              ["Path", response.error?.path || "—"],
              ["Time", response.error?.timestamp || "—"],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="min-w-0 rounded-lg border border-border bg-surface-2/50 px-3 py-2"
              >
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {label}
                </p>
                <p
                  className={cn(
                    "truncate font-mono text-[12px]",
                    label === "Status" && statusColor(response.status),
                  )}
                >
                  {String(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="h-[240px] overflow-hidden rounded-lg border border-border">
            <JsonViewer data={response.error} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {header}
      {aiBar}

      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn(
              "tab-underline capitalize",
              tab === item && "tab-underline-active",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        {tab === "body" && <JsonViewer data={response.response} />}

        {tab === "headers" && (
          <div className="scroll-thin h-full p-3">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2 border-b border-border bg-surface-2 px-3 py-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                <span>Header</span>
                <span>Value</span>
              </div>
              {Object.entries(response.headers || {}).length === 0 ? (
                <p className="px-3 py-6 text-center text-[12px] text-muted-foreground">
                  No headers
                </p>
              ) : (
                Object.entries(response.headers || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2 border-b border-border px-3 py-2 font-mono text-[12px] last:border-b-0"
                  >
                    <span className="truncate text-code-key">{key}</span>
                    <span className="break-all text-muted-foreground">
                      {String(value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === "tests" && <JsonViewer data={response.tests} />}
      </div>
    </div>
  );
}
