import { useEffect } from "react";
import { useHistory } from "../../context/HistoryContext";
import HistoryItem from "./HistoryItem";
import HistorySearch from "./HistorySearch";

export default function HistoryPanel() {
  const {
    history,
    loadHistory,
  } = useHistory();
console.log("History Panel:", history);
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="h-full flex flex-col border-r bg-white">

      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          History
        </h2>
      </div>

      <HistorySearch />

      <div className="flex-1 overflow-auto">

        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No History
          </div>
        ) : (
          history.map((item) => (
            <HistoryItem
              key={item._id}
              item={item}
            />
          ))
        )}

      </div>

    </div>
  );
}