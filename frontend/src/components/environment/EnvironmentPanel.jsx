import { Plus } from "lucide-react";
import { useState } from "react";

import EnvironmentList from "./EnvironmentList";
import CreateEnvironmentModal from "./CreateEnvironmentModal";
import EnvironmentVariables from "./EnvironmentVariables";

export default function EnvironmentPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full">

  <div className="w-64 border-r">

    <div className="flex items-center justify-between border-b p-4">

      <h2 className="font-semibold">
        Environments
      </h2>

      <button
        onClick={() => setOpen(true)}
        className="rounded bg-blue-600 p-2 text-white"
      >
        <Plus size={18} />
      </button>

    </div>

    <EnvironmentList />

  </div>

  <div className="flex-1">

    <EnvironmentVariables />

  </div>

  <CreateEnvironmentModal
    open={open}
    onClose={() => setOpen(false)}
  />

</div>
  );
}