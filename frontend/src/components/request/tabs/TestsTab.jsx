import { useEffect, useState } from "react";

import { useRequest } from "../../../context/RequestContext";

export default function TestsTab() {

  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [script, setScript] =
    useState("");

  useEffect(() => {
    if (!selectedRequest) return;

    setScript(
      selectedRequest.testScript || ""
    );
  }, [selectedRequest]);

  const save = async () => {
    if (!selectedRequest) return;

    await updateRequest(
      selectedRequest._id,
      {
        testScript: script,
      }
    );
  };

  return (
    <div
      className="p-4"
      onBlur={save}
    >
      <textarea
        rows={18}
        value={script}
        onChange={(e) =>
          setScript(e.target.value)
        }
        className="w-full border rounded p-3 font-mono"
        placeholder="// Write test script..."
      />
    </div>
  );
}