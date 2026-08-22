import { useWorkspace } from "../../context/WorkspaceContext";
import CollectionTree from "./CollectionTree";
import { useSidebar } from "../../context/SidebarContext";
export default function WorkspaceTree() {

  const { selectedWorkspace } = useWorkspace();
  const { isOpen } = useSidebar();
if (!isOpen) {
  return null;
}
  return (
    <div className="p-4">

      <h2 className="mb-3 text-xs font-semibold uppercase text-gray-500">
        Workspace
      </h2>

      <div className="rounded-xl border bg-white">

        <div className="border-b p-3">

          <h3 className="font-semibold">

            {selectedWorkspace?.name || "No Workspace"}

          </h3>

          <p className="text-xs text-gray-500">

            {selectedWorkspace?.description ||
              "No Description"}

          </p>

        </div>

        <CollectionTree />

      </div>

    </div>
  );
}