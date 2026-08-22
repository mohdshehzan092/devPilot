import { Pencil, Trash2 } from "lucide-react";

export default function WorkspaceItem({
  workspace,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg cursor-pointer mb-2 ${
        selected
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100"
      }`}
      onClick={() => onSelect(workspace)}
    >
      <span>{workspace.name}</span>

      <div
        className="flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          size={16}
          className="cursor-pointer"
          onClick={() => onEdit(workspace)}
        />

        <Trash2
          size={16}
          className="cursor-pointer text-red-500"
          onClick={() => onDelete(workspace)}
        />
      </div>
    </div>
  );
}