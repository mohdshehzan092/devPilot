import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  ChevronDown,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Settings,
  Terminal,
  Trash2,
} from "lucide-react";

import { useWorkspace } from "@/context/WorkspaceContext";
import { useCollection } from "@/context/CollectionContext";
import { useRequest } from "@/context/RequestContext";
import { useEnvironment } from "@/context/EnvironmentContext";
import { useAuth } from "@/context/AuthContext";
import MethodBadge from "./MethodBadge";
import PromptModal from "./PromptModal";

export default function TopBar({ onToggleNav }: { onToggleNav: () => void }) {
  const router = useRouter();
  const {
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
  } = useWorkspace();
  const { selectedCollection } = useCollection();
  const { selectedRequest } = useRequest();
  const { environments, selectedEnvironment, setSelectedEnvironment } =
    useEnvironment();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"create" | "rename" | null>(null);

  const handleLogout = () => {
    logout?.();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.navigate({ to: "/login" });
  };

  const handleDelete = async () => {
    if (!selectedWorkspace) return;
    if (!window.confirm("Delete this workspace?")) return;
    await removeWorkspace(selectedWorkspace._id);
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
      <button
        onClick={onToggleNav}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
        aria-label="Toggle navigation"
      >
        <Menu size={17} />
      </button>

      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Terminal size={16} />
        </div>
        <span className="hidden text-[15px] font-bold tracking-tight sm:block">
          DevPilot
        </span>
      </div>

      <div className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" />

      {/* Workspace selector */}
      <div className="flex min-w-0 items-center gap-1">
        <div className="relative">
          <select
            value={selectedWorkspace?._id || ""}
            onChange={(e) => {
              const ws = workspaces.find((w: any) => w._id === e.target.value);
              setSelectedWorkspace(ws);
            }}
            className="appearance-none rounded-md border border-border bg-surface-2 py-1.5 pr-7 pl-2.5 text-[12px] font-medium outline-none focus:border-border-strong"
          >
            {workspaces.length === 0 && <option value="">No workspace</option>}
            {workspaces.map((w: any) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <button
          onClick={() => setModal("create")}
          title="New workspace"
          className="hidden rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:block"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() => selectedWorkspace && setModal("rename")}
          title="Rename workspace"
          className="hidden rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:block"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={handleDelete}
          title="Delete workspace"
          className="hidden rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive sm:block"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="hidden min-w-0 flex-1 items-center gap-2 px-2 xl:flex">
        {selectedRequest && (
          <div className="flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
            <span className="truncate">
              {selectedCollection?.name || "Collection"}
            </span>
            <span className="text-border-strong">/</span>
            <MethodBadge method={selectedRequest.method} />
            <span className="truncate text-foreground">
              {selectedRequest.name}
            </span>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Environment */}
        <div className="relative hidden md:block">
          <select
            value={selectedEnvironment?._id || ""}
            onChange={(e) => {
              const env = environments.find(
                (x: any) => x._id === e.target.value,
              );
              setSelectedEnvironment(env || null);
            }}
            className="appearance-none rounded-md border border-border bg-surface-2 py-1.5 pr-7 pl-2.5 font-mono text-[11px] outline-none focus:border-border-strong"
          >
            <option value="">No Environment</option>
            {environments.map((env: any) => (
              <option key={env._id} value={env._id}>
                {env.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-surface-2"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
              {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden min-w-0 text-left lg:block">
              <span className="block truncate text-[12px] font-medium">
                {user?.name || "User"}
              </span>
              <span className="block truncate text-[10px] text-muted-foreground">
                {user?.email || "signed in"}
              </span>
            </span>
            <ChevronDown size={13} className="text-muted-foreground" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="animate-fade-up absolute right-0 z-50 mt-2 w-52 rounded-lg border border-border bg-popover p-1.5 shadow-[var(--shadow-pop)]">
                <div className="border-b border-border px-2.5 py-2">
                  <p className="truncate text-[12px] font-medium">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
                <button className="mt-1 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground">
                  <Settings size={14} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] text-destructive transition-colors hover:bg-destructive/12"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <PromptModal
        open={modal === "create"}
        title="New workspace"
        label="Workspace name"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          setModal(null);
          await createWorkspace(name, "");
        }}
      />

      <PromptModal
        open={modal === "rename"}
        title="Rename workspace"
        label="Workspace name"
        initialValue={selectedWorkspace?.name || ""}
        confirmLabel="Save"
        onCancel={() => setModal(null)}
        onConfirm={async (name) => {
          setModal(null);
          await updateWorkspace(
            selectedWorkspace._id,
            name,
            selectedWorkspace.description,
          );
        }}
      />
    </header>
  );
}
