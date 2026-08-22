import { createContext, useContext, useEffect, useState } from "react";

import * as workspaceService from "../services/workspace.service";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceService.getWorkspaces();

setWorkspaces(workspaces);

if (workspaces.length > 0) {
  setSelectedWorkspace(workspaces[0]);
}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const createWorkspace = async (
  name,
  description
) => {
  const workspace =
    await workspaceService.createWorkspace(
      name,
      description
    );

  setWorkspaces((prev) => [...prev, workspace]);

  setSelectedWorkspace(workspace);
};
const updateWorkspace = async (id, name, description) => {
  await workspaceService.updateWorkspace(id, name, description);

  await fetchWorkspaces();
};  const removeWorkspace = async (id) => {
    await workspaceService.deleteWorkspace(id);

    const remaining = workspaces.filter(
      (w) => w._id !== id
    );

    setWorkspaces(remaining);

    setSelectedWorkspace(
      remaining.length ? remaining[0] : null
    );
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        loading,
        fetchWorkspaces,
        createWorkspace,
        updateWorkspace,
        removeWorkspace,
        setSelectedWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () =>
  useContext(WorkspaceContext);