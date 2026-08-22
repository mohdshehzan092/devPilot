import {
  Pencil,
  Trash2,
} from "lucide-react";

import { useRequest } from "../../context/RequestContext";

export default function RequestItem({
  request,
  selected,
  onClick,
}) {
  const {
    updateRequest,
    removeRequest,
  } = useRequest();

  const colors = {
    GET: "text-green-600",
    POST: "text-blue-600",
    PUT: "text-orange-500",
    PATCH: "text-yellow-500",
    DELETE: "text-red-600",
  };

  const handleRename = async () => {
    const name = prompt(
      "Request Name",
      request.name
    );

    if (!name || name === request.name)
      return;

    await updateRequest(request._id, {
      
      name,
    });
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Delete Request?"
    );

    if (!ok) return;

    await removeRequest(request._id);
  };

  return (
    <div
      className={`group mt-1 flex cursor-pointer items-center justify-between rounded-md px-2 py-2

      ${
        selected
          ? "bg-blue-100"
          : "hover:bg-slate-100"
      }`}
    >
      <button
        onClick={onClick}
        className="flex flex-1 items-center gap-2 text-left"
      >
        <span
          className={`w-14 text-xs font-bold ${
            colors[request.method]
          }`}
        >
          {request.method}
        </span>

        <span className="truncate text-sm">
          {request.name}
        </span>
      </button>

      <div className="hidden items-center gap-1 group-hover:flex">

        <button
          onClick={handleRename}
          className="rounded p-1 hover:bg-white"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={handleDelete}
          className="rounded p-1 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </button>

      </div>
    </div>
  );
}