import WorkspaceItem from "./WorkspaceItem";

export default function WorkspaceList({
  workspaces,
  selectedWorkspace,
  setSelectedWorkspace,
}) {
  return (
    <div className="mt-6 space-y-3">

      {workspaces.map((workspace) => (
        <WorkspaceItem
          key={workspace._id}
          workspace={workspace}
          selected={
            selectedWorkspace?._id === workspace._id
          }
          onSelect={setSelectedWorkspace}
        />
      ))}

    </div>
  );
}