import { useExecution } from "../../context/ExecutionContext";

export default function ResponseHeaders() {
  const { response } = useExecution();

  const headers = response?.headers || {};

  return (
    <div className="p-4 overflow-auto">

      <table className="w-full border border-gray-200 text-sm">

        <thead className="bg-gray-100">

          <tr>

            <th className="border px-3 py-2 text-left w-1/3">
              Header
            </th>

            <th className="border px-3 py-2 text-left">
              Value
            </th>

          </tr>

        </thead>

        <tbody>

          {Object.entries(headers).length === 0 ? (

            <tr>
              <td
                colSpan={2}
                className="text-center py-8 text-gray-500"
              >
                No Headers
              </td>
            </tr>

          ) : (
            Object.entries(headers).map(([key, value]) => (
              <tr key={key}>

                <td className="border px-3 py-2 font-medium">
                  {key}
                </td>

                <td className="border px-3 py-2 break-all">
                  {String(value)}
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}