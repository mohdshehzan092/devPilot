import { useEffect, useState } from "react";
import { useRequest } from "../../../context/RequestContext";
import * as aiService from "../../../services/ai.service";

export default function BodyTab() {
  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [bodyType, setBodyType] = useState("NONE");
  const [body, setBody] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!selectedRequest) return;

    setBodyType(
      selectedRequest.bodyType || "NONE"
    );

    setBody(
      selectedRequest.body || ""
    );
  }, [selectedRequest]);

  // -----------------------------
  // SAVE BODY
  // -----------------------------

  const save = async () => {
    if (!selectedRequest) return;

    await updateRequest(
      selectedRequest._id,
      {
        bodyType,
        body,
      }
    );
  };

  // -----------------------------
  // AI BODY
  // -----------------------------

  const handleAI = async () => {
    if (!selectedRequest) return;

    if (!aiPrompt.trim()) return;

    try {
      setAiLoading(true);

      let result;

      // --------------------------------
      // BODY EMPTY → GENERATE
      // --------------------------------

      if (!body.trim()) {
        result =
          await aiService.generateBody(
            aiPrompt.trim()
          );

        const generatedBody =
          result?.body || "";

        setBodyType("JSON");
        setBody(generatedBody);

        await updateRequest(
          selectedRequest._id,
          {
            bodyType: "JSON",
            body: generatedBody,
          }
        );
      }

      // --------------------------------
      // BODY EXISTS → MODIFY
      // --------------------------------

      else {
        let parsedBody;

        try {
          parsedBody = JSON.parse(body);
        } catch (error) {
          console.error(
            "Invalid JSON body:",
            error
          );

          return;
        }

        result =
          await aiService.modifyBody(
            parsedBody,
            aiPrompt.trim()
          );

        const modifiedBody =
          result?.body || "";

        setBodyType("JSON");
        setBody(modifiedBody);

        await updateRequest(
          selectedRequest._id,
          {
            bodyType: "JSON",
            body: modifiedBody,
          }
        );
      }

      setAiPrompt("");

    } catch (error) {
      console.error(
        "AI Body Error:",
        error
      );
    } finally {
      setAiLoading(false);
    }
  };

  // -----------------------------
  // NO REQUEST
  // -----------------------------

  if (!selectedRequest) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-3">

      {/* =========================
          BODY TYPE
      ========================= */}

      <select
        value={bodyType}
        onChange={(e) =>
          setBodyType(e.target.value)
        }
        onBlur={save}
        className="border rounded px-3 py-2 w-56"
      >
        <option value="NONE">
          None
        </option>

        <option value="JSON">
          JSON
        </option>

        <option value="RAW">
          Raw
        </option>

        <option value="FORM_DATA">
          Form Data
        </option>

        <option value="URL_ENCODED">
          URL Encoded
        </option>

        <option value="XML">
          XML
        </option>
      </select>


      {/* =========================
          SINGLE AI INPUT
      ========================= */}

      {bodyType !== "NONE" && (
        <div className="border rounded-lg p-3 bg-gray-50">

          <div className="flex gap-2">

            <input
              type="text"
              value={aiPrompt}
              onChange={(e) =>
                setAiPrompt(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !aiLoading
                ) {
                  handleAI();
                }
              }}
              placeholder={
                body.trim()
                  ? "Ask AI to modify this body..."
                  : "Ask AI to generate a request body..."
              }
              className="flex-1 border rounded px-3 py-2 bg-white outline-none"
            />

            <button
              type="button"
              onClick={handleAI}
              disabled={
                aiLoading ||
                !aiPrompt.trim()
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading
                ? "Thinking..."
                : "✨ AI"}
            </button>

          </div>

        </div>
      )}


      {/* =========================
          BODY EDITOR
      ========================= */}

      {bodyType !== "NONE" && (
        <textarea
          rows={18}
          value={body}
          onChange={(e) =>
            setBody(e.target.value)
          }
          onBlur={save}
          className="w-full border rounded p-3 font-mono outline-none resize-none"
          placeholder="Enter request body..."
        />
      )}

    </div>
  );
}