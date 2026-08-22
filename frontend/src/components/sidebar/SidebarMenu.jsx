import {
  Folder,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSidebar } from "../../context/SidebarContext";

export default function SidebarMenu() {
  const navigate = useNavigate();
  const {
    activePanel,
    setActivePanel,
    isOpen,
  } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  const Item = ({ icon: Icon, label, panel }) => (
    <button
      onClick={() => setActivePanel(panel)}
      className={`mb-2 flex w-full items-center rounded-lg p-2 transition
      ${
        activePanel === panel
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-slate-100"
      }`}
    >
      <Icon size={18} />

      {isOpen && (
        <span className="ml-3">
          {label}
        </span>
      )}
    </button>
  );

  return (
    <div className="mt-auto border-t p-4">

     

      <Item
        icon={History}
        label="History"
        panel="history"
      />

      <Item
        icon={Settings}
        label="Settings"
        panel="settings"
      />
<button
  onClick={() => setActivePanel("environment")}
>
  Environment
</button>
      <button
        onClick={handleLogout}
        className="flex w-full items-center rounded-lg p-2 text-red-600 hover:bg-red-50"
      >
        <LogOut size={18} />

        {isOpen && (
          <span className="ml-3">
            Logout
          </span>
        )}
      </button>

    </div>
  );
}