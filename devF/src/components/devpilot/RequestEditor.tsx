import { useEffect, useState } from "react";
import { Loader2, Save, Send } from "lucide-react";

import { useRequest } from "@/context/RequestContext";
import { useExecution } from "@/context/ExecutionContext";
import * as aiService from "@/services/ai.service";

import KeyValueTable from "./KeyValueTable";
import CodeEditor from "./CodeEditor";
import AiBar from "./AiBar";
import { methodColor } from "./MethodBadge";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const TABS = ["params", "path", "headers", "body", "auth", "tests"] as const;
type Tab = (typeof TABS)[number];

export default function RequestEditor() {
  const { selectedRequest, updateRequest } = useRequest();
  const { execute, loading: sending } = useExecution();

  const [tab, setTab] = useState<Tab>("body");

  const [url, setUrl] = useState("");
  const [params, setParams] = useState<any[]>([]);
  const [pathParams, setPathParams] = useState<any[]>([]);
  const [headers, setHeaders] = useState<any[]>([]);
  const [bodyType, setBodyType] = useState("NONE");
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState("NONE");
  const [token, setToken] = useState("");
  const [script, setScript] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!selectedRequest) return;
    setUrl(selectedRequest.url || "");
    setParams(selectedRequest.queryParams || []);
    setPathParams(selectedRequest.pathParams || []);
    setHeaders(selectedRequest.headers || []);
    setBodyType(selectedRequest.bodyType || "NONE");
    setBody(selectedRequest.body || "");
    setAuthType(selectedRequest.auth?.type || "NONE");
    setToken(selectedRequest.auth?.token || "");
    setScript(selectedRequest.testScript || "");
  }, [selectedRequest]);

  if (!selectedRequest) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-[14px] font-medium">No request selected</p>
        <p className="max-w-xs text-[12.5px] text-muted-foreground">
          Pick a request from a collection, or create a new one to start
          building.
        </p>
      </div>
    );
  }

  const save = (payload: any) => updateRequest(selectedRequest._id, payload);

  const saveMethod = (value: string) => save({ method: value });

  const handleUrlChange = (value: string) => {
    setUrl(value);

    let pathname = value;
    try {
      pathname = new URL(value).pathname;
    } catch {
      /* keep raw value */
    }

    const matches = pathname.match(/:([A-Za-z_][A-Za-z0-9_]*)/g) || [];
    const nextPathParams = matches.map((item) => ({
      key: item.substring(1),
      value: "",
      enabled: true,
    }));

    setPathParams(nextPathParams);
    save({ url: value, pathParams: nextPathParams });
  };

  const handleAiBody = async () => {
    if (!aiPrompt.trim()) return;

    try {
      setAiLoading(true);

      if (!body.trim()) {
        const result = await aiService.generateBody(aiPrompt.trim());
        const generated = result?.body || "";
        setBodyType("JSON");
        setBody(generated);
        await save({ bodyType: "JSON", body: generated });
      } else {
        let parsedBody: any;
        try {
          parsedBody = JSON.parse(body);
        } catch (error) {
          console.error("Invalid JSON body:", error);
          return;
        }

        const result = await aiService.modifyBody(parsedBody, aiPrompt.trim());
        const modified = result?.body || "";
        setBodyType("JSON");
        setBody(modified);
        await save({ bodyType: "JSON", body: modified });
      }

      setAiPrompt("");
    } catch (error) {
      console.error("AI Body Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const tabCount: Record<string, number> = {
    params: params.length,
    path: pathParams.length,
    headers: headers.length,
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* URL bar */}
      <div className="shrink-0 border-b border-border p-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:flex">
          <div className="relative shrink-0">
            <select
              value={selectedRequest.method || "GET"}
              onChange={(e) => saveMethod(e.target.value)}
              className={cn(
                "w-[92px] appearance-none rounded-md border border-border bg-surface-2 px-3 py-2.5 font-mono text-[12px] font-bold outline-none focus:border-border-strong",
                methodColor(selectedRequest.method),
              )}
            >
              {METHODS.map((m) => (
                <option key={m} value={m} className="text-foreground">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <input
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="field min-w-0 flex-1 px-3 py-2.5 font-mono text-[13px]"
          />

          <div className="col-span-2 flex gap-2 sm:col-span-1">
            <button
              onClick={() => execute(selectedRequest._id)}
              disabled={sending}
              className="flex flex-1 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-[13px] font-bold text-primary-foreground shadow-[0_6px_18px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:flex-none"
            >
              {sending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {sending ? "Sending" : "Send"}
            </button>

            <button
              onClick={() =>
                save({
                  url,
                  queryParams: params,
                  pathParams,
                  headers,
                  bodyType,
                  body,
                  auth: { type: authType, token },
                  testScript: script,
                })
              }
              title="Save request"
              className="shrink-0 rounded-md border border-border px-3 py-2.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Save size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="scroll-thin flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-2">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn(
              "tab-underline shrink-0 capitalize",
              tab === item && "tab-underline-active",
            )}
          >
            {item === "path" ? "Path Vars" : item}
            {tabCount[item] ? (
              <span className="ml-1.5 rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {tabCount[item]}
              </span>
            ) : null}
            {item === "body" && bodyType !== "NONE" && (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="scroll-thin min-h-0 flex-1">
        {tab === "params" && (
          <KeyValueTable
            items={params}
            setItems={setParams}
            onCommit={() => save({ queryParams: params })}
            emptyLabel="No query params"
          />
        )}

        {tab === "path" && (
          <KeyValueTable
            items={pathParams}
            setItems={setPathParams}
            onCommit={() => save({ pathParams })}
            keyPlaceholder="Variable"
            emptyLabel="Add :variables to the URL to see them here"
          />
        )}

        {tab === "headers" && (
          <KeyValueTable
            items={headers}
            setItems={setHeaders}
            onCommit={() => save({ headers })}
            keyPlaceholder="Header"
            emptyLabel="No headers"
          />
        )}

        {tab === "body" && (
          <div className="flex h-full min-h-0 flex-col gap-2.5 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value);
                  save({ bodyType: e.target.value, body });
                }}
                className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-[12px] outline-none focus:border-border-strong"
              >
                <option value="NONE">None</option>
                <option value="JSON">JSON</option>
                <option value="RAW">Raw</option>
                <option value="FORM_DATA">Form Data</option>
                <option value="URL_ENCODED">URL Encoded</option>
                <option value="XML">XML</option>
              </select>

              {bodyType !== "NONE" && (
                <button
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(body), null, 2);
                      setBody(formatted);
                      save({ bodyType, body: formatted });
                    } catch {
                      /* not valid JSON — leave as-is */
                    }
                  }}
                  className="rounded-md border border-border px-2.5 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  Beautify
                </button>
              )}
            </div>

            {bodyType !== "NONE" && (
              <>
                <AiBar
                  value={aiPrompt}
                  onChange={setAiPrompt}
                  onRun={handleAiBody}
                  loading={aiLoading}
                  placeholder={
                    body.trim()
                      ? "Ask AI to modify this body..."
                      : "Ask AI to generate a request body..."
                  }
                  suggestions={
                    body.trim()
                      ? ["Add a name field", "Use realistic sample values"]
                      : ["Login payload with email and password"]
                  }
                />

                <CodeEditor
                  value={body}
                  onChange={setBody}
                  onBlur={() => save({ bodyType, body })}
                  language={bodyType === "JSON" ? "json" : "js"}
                  placeholder="Enter request body..."
                  className="min-h-[220px] flex-1"
                />
              </>
            )}

            {bodyType === "NONE" && (
              <p className="flex flex-1 items-center justify-center text-[12.5px] text-muted-foreground">
                This request has no body
              </p>
            )}
          </div>
        )}

        {tab === "auth" && (
          <div className="flex max-w-lg flex-col gap-3 p-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Auth type
              </label>
              <select
                value={authType}
                onChange={(e) => {
                  setAuthType(e.target.value);
                  save({ auth: { type: e.target.value, token } });
                }}
                className="field"
              >
                <option value="NONE">No Auth</option>
                <option value="BEARER">Bearer Token</option>
              </select>
            </div>

            {authType === "BEARER" && (
              <div className="animate-fade-up">
                <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Token
                </label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onBlur={() => save({ auth: { type: authType, token } })}
                  placeholder="eyJhbGciOiJIUzI1NiIs..."
                  className="field font-mono text-[12px]"
                />
              </div>
            )}
          </div>
        )}

        {tab === "tests" && (
          <div className="flex h-full min-h-0 flex-col p-3">
            <CodeEditor
              value={script}
              onChange={setScript}
              onBlur={() => save({ testScript: script })}
              language="js"
              placeholder="// Write test script..."
              className="min-h-[220px] flex-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}
