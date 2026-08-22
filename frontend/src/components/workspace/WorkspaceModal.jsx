import { useEffect, useState } from "react";

export default function WorkspaceModal({
  open,
  onClose,
  onSubmit,
  title,
  defaultValue = "",
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-96">

        <h2 className="text-xl font-bold mb-5">
          {title}
        </h2>

        <input
          className="border rounded-lg w-full p-3"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!name.trim()) return;

              onSubmit(name);

              setName("");

              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}