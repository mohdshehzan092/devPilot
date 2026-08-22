import { CircleUserRound, Pencil, Trash2 } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function Navbar() {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    updateWorkspace,
    removeWorkspace,
  } = useWorkspace();

  const currentWorkspace =
    workspaces.find(
      (w) => w._id === selectedWorkspace?._id
    ) || null;

  const handleRename = async () => {
    if (!currentWorkspace) return;

    const newName = prompt(
      "Enter Workspace Name",
      currentWorkspace.name
    );

    if (!newName) return;

    await updateWorkspace(
      currentWorkspace._id,
      newName,
      currentWorkspace.description
    );
  };

  const handleDelete = async () => {
    if (!currentWorkspace) return;

    if (!window.confirm("Delete Workspace?")) return;

    await removeWorkspace(currentWorkspace._id);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div className="flex items-center gap-4">

        <h1 className="text-3xl font-bold text-blue-600">
          DevPilot
        </h1>

        <div className="flex flex-col">

          <div className="flex items-center gap-2">

            <select
              value={currentWorkspace?._id || ""}
              onChange={(e) => {
                const ws = workspaces.find(
                  (w) => w._id === e.target.value
                );

                setSelectedWorkspace(ws);
              }}
              className="rounded-lg border px-4 py-2"
            >
              {workspaces.map((workspace) => (
                <option
                  key={workspace._id}
                  value={workspace._id}
                >
                  {workspace.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRename}
              className="rounded border p-2 hover:bg-gray-100"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={handleDelete}
              className="rounded border p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>

          </div>

          <p className="ml-1 mt-1 text-xs text-gray-500">
            {currentWorkspace?.description ||
              "No Description"}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        <CircleUserRound size={36} />

        <div>
          <p className="font-semibold">User</p>
          <p className="text-sm text-gray-500">
            user@gmail.com
          </p>
        </div>

      </div>

    </header>
  );
}