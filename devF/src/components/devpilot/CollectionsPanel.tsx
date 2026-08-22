import { useMemo, useState } from "react";
import {
  ChevronRight,
  FilePlus2,
  Folder,
  FolderOpen,
  FolderPlus,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { useCollection } from "@/context/CollectionContext";
import { useRequest } from "@/context/RequestContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import MethodBadge from "./MethodBadge";
import PromptModal from "./PromptModal";
import { cn } from "@/lib/utils";

type ModalState =
  | { kind: "new-collection" }
  | { kind: "rename-collection"; item: any }
  | { kind: "new-request" }
  | { kind: "rename-request"; item: any }
  | null;

export default function CollectionsPanel() {
  const { selectedWorkspace } = useWorkspace();
  const {
    collections,
    selectedCollection,
    setSelectedCollection,
    createCollection,
    updateCollection,
    removeCollection,
    loading,
  } = useCollection();
  const {
    requests,
    selectedRequest,
    setSelectedRequest,
    createRequest,
    updateRequest,
    removeRequest,
  } = useRequest();

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const filtered = useMemo(
    () =>
      collections.filter((c: any) =>
        c.name?.toLowerCase().includes(query.toLowerCase()),
      ),
    [collections, query],
  );

  const visibleRequests = useMemo(
    () =>
      requests.filter((r: any) =>
        query ? r.name?.toLowerCase().includes(query.toLowerCase()) : true,
      ),
    [requests, query],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border px-3 py-3">
        <div className="mb-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Workspace
            </p>
            <p className="truncate text-[13px] font-semibold">
              {selectedWorkspace?.name || "No workspace"}
            </p>
          </div>
          <button
            onClick={() => setModal({ kind: "new-collection" })}
            title="New collection"
            className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <FolderPlus size={15} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections..."
            className="field pl-7"
          />
        </div>
      </div>

      <div className="scroll-thin min-h-0 flex-1 px-2 py-2">
        {loading && (
          <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">
            Loading collections...
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-3 py-10 text-center">
            <Folder size={22} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-[12px] text-muted-foreground">
              No collections yet
            </p>
            <button
              onClick={() => setModal({ kind: "new-collection" })}
              className="mt-3 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Create collection
            </button>
          </div>
        )}

        {filtered.map((collection: any) => {
          const open = selectedCollection?._id === collection._id;

          return (
            <div key={collection._id} className="mb-0.5">
              <div
                className={cn(
                  "group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors",
                  open ? "bg-surface-2" : "hover:bg-surface-2/70",
                )}
              >
                <button
                  onClick={() => setSelectedCollection(collection)}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                >
                  <ChevronRight
                    size={13}
                    className={cn(
                      "shrink-0 text-muted-foreground transition-transform duration-200",
                      open && "rotate-90",
                    )}
                  />
                  {open ? (
                    <FolderOpen size={14} className="shrink-0 text-primary" />
                  ) : (
                    <Folder size={14} className="shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate text-[12.5px] font-medium">
                    {collection.name}
                  </span>
                </button>

                <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                  <button
                    onClick={() =>
                      setModal({ kind: "rename-collection", item: collection })
                    }
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this collection?")) return;
                      await removeCollection(collection._id);
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {open && (
                <div className="animate-fade-up mt-0.5 ml-[15px] border-l border-border pl-2">
                  {visibleRequests.map((request: any) => {
                    const active = selectedRequest?._id === request._id;
                    return (
                      <div
                        key={request._id}
                        className={cn(
                          "group flex items-center gap-1 rounded-md px-1.5 py-1.5 transition-colors",
                          active
                            ? "bg-primary-soft"
                            : "hover:bg-surface-2/70",
                        )}
                      >
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                        >
                          <MethodBadge method={request.method} block />
                          <span
                            className={cn(
                              "truncate text-[12.5px]",
                              active && "font-medium text-foreground",
                            )}
                          >
                            {request.name}
                          </span>
                        </button>

                        <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                          <button
                            onClick={() =>
                              setModal({ kind: "rename-request", item: request })
                            }
                            className="rounded p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            onClick={async () => {
                              if (!window.confirm("Delete this request?")) return;
                              await removeRequest(request._id);
                            }}
                            className="rounded p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setModal({ kind: "new-request" })}
                    className="mt-1 flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:bg-surface-2/70 hover:text-primary"
                  >
                    <FilePlus2 size={13} /> New request
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PromptModal
        open={modal?.kind === "new-collection"}
        title="New collection"
        label="Collection name"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          setModal(null);
          await createCollection(name, "");
        }}
      />

      <PromptModal
        open={modal?.kind === "rename-collection"}
        title="Rename collection"
        label="Collection name"
        initialValue={(modal as any)?.item?.name || ""}
        confirmLabel="Save"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          const item = (modal as any).item;
          setModal(null);
          await updateCollection(item._id, name, item.description);
        }}
      />

      <PromptModal
        open={modal?.kind === "new-request"}
        title="New request"
        label="Request name"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          setModal(null);
          await createRequest(name);
        }}
      />

      <PromptModal
        open={modal?.kind === "rename-request"}
        title="Rename request"
        label="Request name"
        initialValue={(modal as any)?.item?.name || ""}
        confirmLabel="Save"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          const item = (modal as any).item;
          setModal(null);
          await updateRequest(item._id, { name });
        }}
      />
    </div>
  );
}
