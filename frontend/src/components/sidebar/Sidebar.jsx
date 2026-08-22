import { PanelLeft } from "lucide-react";

import { useSidebar } from "../../context/SidebarContext";

import WorkspaceTree from "./WorkspaceTree";
import SidebarMenu from "./SidebarMenu";

export default function Sidebar() {
  const {
    isOpen,
    setIsOpen,
  } = useSidebar();

  return (
    <aside
      className={`border-r bg-white flex flex-col transition-all duration-300
      ${isOpen ? "w-72" : "w-16"}`}
    >

      {/* Toggle */}

      <div className="border-b p-3 flex justify-center">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <PanelLeft size={20} />
        </button>

      </div>

      <WorkspaceTree />

      <SidebarMenu />

    </aside>
  );
}