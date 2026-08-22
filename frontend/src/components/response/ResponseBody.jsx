import { useExecution } from "../../context/ExecutionContext";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ResponseBody() {
  const { response } = useExecution();

  if (!response) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(response.response, null, 2)
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end border-b p-2">
        <button
          onClick={copy}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Copy
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language="json"
          style={oneDark}
          showLineNumbers
          wrapLongLines
          customStyle={{
            margin: 0,
            height: "100%",
            background: "#282C34",
            fontSize: "14px",
          }}
        >
          {JSON.stringify(response.response, null, 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}