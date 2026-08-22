import { Trash2 } from "lucide-react";

import { useHistory } from "../../context/HistoryContext";
import { useRequest } from "../../context/RequestContext";
import { useExecution } from "../../context/ExecutionContext";

export default function HistoryItem({ item }) {

  const {
    getHistory,
    removeHistory,
  } = useHistory();

  const {
    restoreRequest,
  } = useRequest();

  const {
    restoreResponse,
  } = useExecution();

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "text-green-600";
      case "POST":
        return "text-blue-600";
      case "PUT":
        return "text-orange-500";
      case "PATCH":
        return "text-yellow-500";
      case "DELETE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      onClick={async () => {

        const history =
          await getHistory(item._id);

        restoreRequest({

          _id: history.requestId,

          method: history.method,

          url: history.url,

          headers:
            history.requestHeaders || [],

          queryParams:
            history.queryParams || [],

          pathParams:
            history.pathParams || [],

          body:
            typeof history.requestBody === "string"
              ? history.requestBody
              : JSON.stringify(
                  history.requestBody,
                  null,
                  2
                ),

          bodyType:
            history.bodyType || "NONE",

          auth:
            history.auth || {},

          testScript:
            history.testScript || "",
        });

        restoreResponse({

          status:
            history.responseStatus,

          headers:
            history.responseHeaders,

          responseTime:
            history.responseTime,

          size:
            history.responseSize,

          response:
            history.responseBody,

          tests: {
            passed: 0,
            failed: 0,
            results: [],
          },
        });

      }}
      className="flex justify-between items-center px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
    >
      <div>

        <p
          className={`font-semibold ${getMethodColor(
            item.method
          )}`}
        >
          {item.method}
        </p>

        <p className="text-sm text-gray-600 truncate w-56">
          {item.url}
        </p>

      </div>

      <button
        onClick={async (e) => {

          e.stopPropagation();

          await removeHistory(item._id);

        }}
      >
        <Trash2
          size={18}
          className="text-red-500 hover:text-red-700"
        />
      </button>

    </div>
  );
}