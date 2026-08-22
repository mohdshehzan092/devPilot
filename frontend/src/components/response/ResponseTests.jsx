import { useExecution } from "../../context/ExecutionContext";

export default function ResponseTests() {
  const { response } = useExecution();

  return (
    <pre className="p-4 text-sm overflow-auto bg-gray-50 h-full">
      {JSON.stringify(response.tests, null, 2)}
    </pre>
  );
}