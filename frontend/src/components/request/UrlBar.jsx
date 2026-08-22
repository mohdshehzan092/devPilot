import { useEffect, useState } from "react";
import { useRequest } from "../../context/RequestContext";
import { useExecution } from "../../context/ExecutionContext";

export default function UrlBar() {
  const { selectedRequest, updateRequest } = useRequest();
  const { execute } = useExecution();

  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");

const handleUrlChange = (e) => {
  const url = e.target.value;

  // URL parse karke sirf pathname se params nikalo
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Invalid URL hai to puri string use karo
    // but port pattern (:digits only) exclude karo
  }

  // Sirf pathname se match karo
  const matches = pathname.match(/:([A-Za-z_][A-Za-z0-9_]*)/g) || [];

  const pathParams = matches.map((item) => ({
    key: item.substring(1),
    value: "",
    enabled: true,
  }));

  updateRequest(selectedRequest._id, {
    url,
    pathParams,
  });
};


  useEffect(() => {
    if (!selectedRequest) return;

    setMethod(selectedRequest.method || "GET");
    setUrl(selectedRequest.url || "");
  }, [selectedRequest]);

  if (!selectedRequest) return null;

  const saveMethod = async (value) => {
    setMethod(value);

    await updateRequest(selectedRequest._id, {
      method: value,
    });
  };

  const saveUrl = async () => {
    await updateRequest(selectedRequest._id, {
      url,
    });
  };

 return (
  <div className="flex items-center gap-2 p-3 border-b">

    <select
      value={method}
      onChange={(e) => saveMethod(e.target.value)}
      className="w-28 shrink-0 border rounded px-2 py-2"
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="PATCH">PATCH</option>
      <option value="DELETE">DELETE</option>
    </select>

    <input
      type="text"
      value={selectedRequest.url}
      onChange={handleUrlChange}
      placeholder="Enter request URL"
      className="flex-1 min-w-0 border rounded px-3 py-2"
    />

    <button
      onClick={() => execute(selectedRequest._id)}
      className="shrink-0 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      Send
    </button>

  </div>
);
}