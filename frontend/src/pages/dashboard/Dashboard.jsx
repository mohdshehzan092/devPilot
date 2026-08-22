import HistoryPanel from "../../components/history/HistoryPanel";
import RequestEditor from "../../components/request/RequestEditor";
import ResponseViewer from "../../components/response/ResponseViewer";
import EnvironmentPanel from "../../components/environment/EnvironmentPanel";
import { useSidebar } from "../../context/SidebarContext";

export default function Dashboard() {
  const { activePanel } = useSidebar();
  return (
    <div className="flex h-full bg-slate-100 overflow-hidden">

      {/* History Sidebar */}
      <div className="w-80 border-r bg-white">

  {activePanel === "history" && (
    <HistoryPanel />
  )}

  {activePanel === "environment" && (
    <EnvironmentPanel />
  )}

</div>

      {/* Main Content */}
      <div className="flex flex-1 min-w-0 flex-col">

        {/* Request */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <RequestEditor />
        </div>

        {/* Response */}
        <div className="h-80 shrink-0 border-t bg-white">
          <ResponseViewer />
        </div>

      </div>

    </div>
  );
}