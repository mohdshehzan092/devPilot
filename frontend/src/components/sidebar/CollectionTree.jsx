import {
  Folder,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { useCollection } from "../../context/CollectionContext";
import RequestTree from "./RequestTree";

export default function CollectionTree() {
  const {
  collections,
  selectedCollection,
  setSelectedCollection,
  createCollection,
  updateCollection,
  removeCollection,
} = useCollection();

  const handleCreate = async () => {
    const name = prompt("Collection Name");

    if (!name) return;

    try {
      await createCollection(name, "");
    } catch (err) {
      console.log(err);
      alert("Unable to create collection.");
    }
  };
const handleRename = async (collection) => {
  const name = prompt(
    "Collection Name",
    collection.name
  );

  if (!name || name === collection.name) return;

  await updateCollection(
    collection._id,
    name,
    collection.description
  );
};
const handleDelete = async (collection) => {
  const ok = window.confirm(
    "Delete Collection?"
  );

  if (!ok) return;

  await removeCollection(collection._id);
};
  return (
    <div className="p-3">

      <div className="mb-3 flex items-center justify-between">

        <h3 className="text-sm font-semibold text-gray-500">
          Collections
        </h3>

        <button
          onClick={handleCreate}
          className="rounded p-1 hover:bg-slate-100"
        >
          <Plus size={18} />
        </button>

      </div>

      <div className="space-y-1">

{collections.map((collection) => (

  <div key={collection._id}>

    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2

      ${
        selectedCollection?._id === collection._id
          ? "bg-blue-100"
          : "hover:bg-slate-100"
      }`}
    >

      <button
        onClick={() =>
          setSelectedCollection(collection)
        }
        className="flex flex-1 items-center gap-2 text-left"
      >

        <Folder size={18} />

        <span>{collection.name}</span>

      </button>

      <div className="hidden items-center gap-1 group-hover:flex">

        <button
          onClick={() => handleRename(collection)}
          className="rounded p-1 hover:bg-white"
        >
          <Pencil size={15} />
        </button>

        <button
          onClick={() => handleDelete(collection)}
          className="rounded p-1 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={15} />
        </button>

      </div>

    </div>

    {/* Requests */}

    {selectedCollection?._id === collection._id && (
      <RequestTree />
    )}

  </div>

))}

      </div>

    </div>
  );
}