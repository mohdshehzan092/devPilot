import { X, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function WorkspaceModal({ open, onClose }) {
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
  } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createWorkspace(name, description);

    setName("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[500px] rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-xl font-semibold">
            Workspaces
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* Workspace List */}

        <div className="max-h-60 overflow-y-auto p-5">

          {workspaces.map((workspace) => (

            <div
              key={workspace._id}
              className={`mb-2 flex items-center justify-between rounded-lg border p-3 cursor-pointer ${
                selectedWorkspace?._id === workspace._id
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              <div
                onClick={() => setSelectedWorkspace(workspace)}
                className="flex-1"
              >
                <h3 className="font-medium">
                  {workspace.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {workspace.description}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => {
                    const newName = prompt(
                      "Rename Workspace",
                      workspace.name
                    );

                    if (newName)
                      updateWorkspace(workspace._id, newName);
                  }}
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    removeWorkspace(workspace._id)
                  }
                >
                  <Trash2
                    size={18}
                    className="text-red-500"
                  />
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Create */}

        <div className="border-t p-5">

          <h3 className="mb-3 font-semibold">
            Create Workspace
          </h3>

          <input
            placeholder="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full rounded-lg border p-3"
          />

          <textarea
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4 w-full rounded-lg border p-3"
          />

          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Create Workspace
          </button>

        </div>

      </div>

    </div>
  );
}