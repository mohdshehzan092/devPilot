import { useState } from "react";

import { useExecution } from "../../context/ExecutionContext";
import * as aiService from "../../services/ai.service";

import ResponseBody from "./ResponseBody";
import ResponseHeaders from "./ResponseHeaders";
import ResponseTests from "./ResponseTests";

export default function ResponsePanel() {
  const { response } = useExecution();

  const [tab, setTab] = useState("body");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  if (!response) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No response yet
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) {
      return "text-green-600";
    }

    if (status >= 300 && status < 400) {
      return "text-blue-600";
    }

    if (status >= 400 && status < 500) {
      return "text-orange-500";
    }

    return "text-red-600";
  };

  const runAI = async () => {
    if (!aiPrompt.trim() || aiLoading) {
      return;
    }

    try {
      setAiLoading(true);
      setAiResult("");

      const prompt = aiPrompt.toLowerCase();

      /*
       * Generate Tests
       */
      if (
        prompt.includes("test") ||
        prompt.includes("tests")
      ) {
        const result =
          await aiService.generateTests(
            response.response
          );

        setAiResult(
          result?.script ||
            "AI could not generate tests."
        );

        setTab("tests");

        return;
      }

      /*
       * Summarize Response
       */
      if (
        prompt.includes("summary") ||
        prompt.includes("summarize") ||
        prompt.includes("summarise")
      ) {
        const result =
          await aiService.summarizeResponse(
            response.response
          );

        setAiResult(
          result?.summary ||
            "AI could not summarize the response."
        );

        return;
      }

      /*
       * Explain Error
       */
      if (
        prompt.includes("error") ||
        prompt.includes("explain")
      ) {
        const errorData = {
          status: response.status,
          error: response.error,
          response: response.response,
        };

        const result =
          await aiService.explainError(
            errorData
          );

        setAiResult(
          result?.explanation ||
            "AI could not explain the error."
        );

        return;
      }

      /*
       * Default
       */
      setAiResult(
        "Try: summarize response, generate tests, or explain error."
      );
    } catch (error) {
      console.error(
        "Response AI Error:",
        error
      );

      setAiResult(
        "AI request failed. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  /*
   * ERROR RESPONSE
   */
  if (!response.success) {
    return (
      <div className="flex flex-col h-full">

        {/* Header */}

        <div className="border-b px-5 py-3">
          <h2 className="text-red-600 font-bold text-lg">
            Request Failed
          </h2>
        </div>

        {/* AI */}

        <div className="border-b p-4 bg-gray-50">

          <div className="flex gap-2">

            <input
              type="text"
              value={aiPrompt}
              onChange={(e) =>
                setAiPrompt(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runAI();
                }
              }}
              placeholder="Ask AI about this error..."
              className="flex-1 border rounded px-3 py-2 bg-white"
            />

            <button
              onClick={runAI}
              disabled={
                aiLoading ||
                !aiPrompt.trim()
              }
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {aiLoading
                ? "Thinking..."
                : "✨ AI"}
            </button>

          </div>

          {aiResult && (
            <div className="mt-3 bg-white border rounded-lg p-3 whitespace-pre-wrap text-sm">
              {aiResult}
            </div>
          )}

        </div>

        {/* Error */}

        <div className="flex-1 p-6 overflow-auto">

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">

            <div className="space-y-4">

              <div>
                <span className="font-semibold">
                  Status :
                </span>{" "}
                {response.status}
              </div>

              <div>
                <span className="font-semibold">
                  Message :
                </span>{" "}
                {response.error?.message}
              </div>

              <div>
                <span className="font-semibold">
                  Path :
                </span>{" "}
                {response.error?.path}
              </div>

              <div>
                <span className="font-semibold">
                  Time :
                </span>{" "}
                {response.error?.timestamp}
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
   * SUCCESS RESPONSE
   */

  return (
    <div className="flex flex-col h-full">

      {/* Status Bar */}

      <div className="border-b flex gap-10 px-5 py-3">

        <div>
          <p className="text-xs text-gray-500">
            Status
          </p>

          <p
            className={`font-semibold ${getStatusColor(
              response.status
            )}`}
          >
            {response.status}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Time
          </p>

          <p className="font-semibold">
            {response.responseTime} ms
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Size
          </p>

          <p className="font-semibold">
            {response.size} bytes
          </p>
        </div>

      </div>

      {/* AI BAR */}

      <div className="border-b p-4 bg-gray-50">

        <div className="flex gap-2">

          <input
            type="text"
            value={aiPrompt}
            onChange={(e) =>
              setAiPrompt(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runAI();
              }
            }}
            placeholder="Ask AI: summarize response, generate tests..."
            className="flex-1 border rounded px-3 py-2 bg-white"
          />

          <button
            onClick={runAI}
            disabled={
              aiLoading ||
              !aiPrompt.trim()
            }
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {aiLoading
              ? "Thinking..."
              : "✨ AI"}
          </button>

        </div>

        {aiResult && (
          <div className="mt-3 bg-white border rounded-lg p-3 whitespace-pre-wrap text-sm">

            <div className="font-semibold mb-2">
              AI Result
            </div>

            {aiResult}

          </div>
        )}

      </div>

      {/* Tabs */}

      <div className="border-b flex">

        {["body", "headers", "tests"].map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                setTab(item)
              }
              className={`px-5 py-3 capitalize border-b-2 transition-all ${
                tab === item
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {item}
            </button>
          )
        )}

      </div>

      {/* Content */}

      <div className="flex-1 overflow-auto">

        {tab === "body" && (
          <ResponseBody />
        )}

        {tab === "headers" && (
          <ResponseHeaders />
        )}

        {tab === "tests" && (
          <ResponseTests />
        )}

      </div>

    </div>
  );
}