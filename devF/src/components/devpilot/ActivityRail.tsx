import { FolderTree, History, Layers, LogOut, Settings } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "collections", label: "Collections", icon: FolderTree },
  { key: "history", label: "History", icon: History },
  { key: "environment", label: "Env", icon: Layers },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function ActivityRail() {
  const { activePanel, setActivePanel, setIsOpen } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-border bg-sidebar px-2 py-3">
      {ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => {
            setActivePanel(key);
            setIsOpen(true);
          }}
          className={cn("rail-btn", activePanel === key && "rail-btn-active")}
        >
          <Icon size={18} />
          <span className="text-[9px] font-medium tracking-wide">{label}</span>
        </button>
      ))}

      <button
        onClick={() => {
          logout?.();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.navigate({ to: "/login" });
        }}
        className="rail-btn mt-auto hover:bg-destructive/12 hover:text-destructive"
      >
        <LogOut size={18} />
        <span className="text-[9px] font-medium tracking-wide">Logout</span>
      </button>
    </nav>
  );
}
