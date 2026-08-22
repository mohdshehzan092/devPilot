import { Plus } from "lucide-react";

export default function WorkspaceHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-2xl font-bold">
          Workspaces
        </h2>

        <p className="text-sm text-gray-500">
          Organize your API projects
        </p>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <Plus size={18} />

        New Workspace
      </button>
    </div>
  );
}