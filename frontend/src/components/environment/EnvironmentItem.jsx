import { Trash2 } from "lucide-react";

import { useEnvironment } from "../../context/EnvironmentContext";

export default function EnvironmentItem({
  item,
}) {
  const {
    selectedEnvironment,
    setSelectedEnvironment,
    removeEnvironment,
  } = useEnvironment();

  const active =
    selectedEnvironment?._id === item._id;

  return (
    <div
      onClick={() =>
        setSelectedEnvironment(item)
      }
      className={`flex items-center justify-between border-b px-4 py-3 cursor-pointer transition

      ${
        active
          ? "bg-blue-50"
          : "hover:bg-gray-50"
      }`}
    >
      <span className="font-medium">
        {item.name}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          removeEnvironment(item._id);
        }}
      >
        <Trash2
          size={17}
          className="text-red-500 hover:text-red-700"
        />
      </button>
    </div>
  );
}