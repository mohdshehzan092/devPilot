import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequest } from "../../context/RequestContext";

export default function RequestToolbar() {
  const { selectedRequest, updateRequest } =
    useRequest();

  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!selectedRequest) return;

    setMethod(selectedRequest.method);
    setUrl(selectedRequest.url || "");
  }, [selectedRequest]);

  useEffect(() => {
    if (!selectedRequest) return;

    const timer = setTimeout(() => {
      updateRequest(selectedRequest._id, {
        ...selectedRequest,
        method,
        url,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [method, url]);

  return (
    <div className="flex items-center gap-3 border-b p-4">

      <select
        value={method}
        onChange={(e) =>
          setMethod(e.target.value)
        }
        className="rounded border px-3 py-2"
      >
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>PATCH</option>
        <option>DELETE</option>
      </select>

      <input
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
        className="flex-1 rounded border px-3 py-2"
        placeholder="Enter Request URL"
      />

      <button className="rounded bg-blue-600 px-5 py-2 text-white">

        <Send size={18} />

      </button>

    </div>
  );
}