import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { useSidebar } from "@/context/SidebarContext";
import TopBar from "./TopBar";
import ActivityRail from "./ActivityRail";
import CollectionsPanel from "./CollectionsPanel";
import HistoryPanel from "./HistoryPanel";
import EnvironmentPanel from "./EnvironmentPanel";
import SettingsPanel from "./SettingsPanel";
import RequestEditor from "./RequestEditor";
import ResponseViewer from "./ResponseViewer";
import { cn } from "@/lib/utils";

function SidePanel() {
  const { activePanel } = useSidebar();

  if (activePanel === "history") return <HistoryPanel />;
  if (activePanel === "environment") return <EnvironmentPanel />;
  if (activePanel === "settings") return <SettingsPanel />;
  return <CollectionsPanel />;
}

export default function WorkspaceShell() {
  const { isOpen, setIsOpen } = useSidebar();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar onToggleNav={() => setDrawer((d) => !d)} />

      <div className="flex min-h-0 flex-1">
        {/* Desktop navigation */}
        <div className="hidden lg:flex">
          <ActivityRail />
          <aside
            className={cn(
              "flex min-h-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
              isOpen ? "w-80" : "w-0 overflow-hidden",
            )}
          >
            <SidePanel />
          </aside>
          <button
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Collapse panel" : "Expand panel"}
            className="h-full w-3 shrink-0 border-r border-border text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            {isOpen ? (
              <PanelLeftClose size={12} className="mx-auto" />
            ) : (
              <PanelLeftOpen size={12} className="mx-auto" />
            )}
          </button>
        </div>

        {/* Mobile / tablet drawer */}
        {drawer && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setDrawer(false)}
            />
            <div className="animate-fade-up relative flex h-full">
              <ActivityRail />
              <aside className="flex h-full w-72 min-w-0 flex-col border-r border-border bg-sidebar">
                <div className="flex items-center justify-end border-b border-border px-2 py-1.5">
                  <button
                    onClick={() => setDrawer(false)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  >
                    <X size={15} />
                  </button>
                </div>
                <SidePanel />
              </aside>
            </div>
          </div>
        )}

        {/* Main workspace: request above, response below */}
        <main className="min-w-0 flex-1">
          <Group orientation="vertical" className="h-full">
            <Panel defaultSize="58%" minSize="25%" className="min-h-0">
              <RequestEditor />
            </Panel>

            <Separator className="group relative h-1.5 shrink-0 bg-border transition-colors hover:bg-primary/60 data-[state=dragging]:bg-primary">
              <span className="absolute top-1/2 left-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-strong group-hover:bg-primary" />
            </Separator>

            <Panel defaultSize="42%" minSize="20%" className="min-h-0 bg-surface">
              <ResponseViewer />
            </Panel>
          </Group>
        </main>
      </div>
    </div>
  );
}
