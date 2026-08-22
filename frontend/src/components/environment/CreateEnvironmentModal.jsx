import { useState } from "react";

import { useEnvironment } from "../../context/EnvironmentContext";

export default function CreateEnvironmentModal({
  open,
  onClose,
}) {
  const { createEnvironment } =
    useEnvironment();

  const [name, setName] =
    useState("");

  if (!open) return null;

  const submit = async () => {
    if (!name.trim()) return;

    await createEnvironment(name);

    setName("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="w-96 rounded-xl bg-white p-6">

        <h2 className="mb-5 text-xl font-semibold">
          New Environment
        </h2>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Environment Name"
          className="mb-5 w-full rounded border p-2"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}