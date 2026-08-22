import { createContext, useContext, useEffect, useState } from "react";
import * as workspaceService from "../services/workspace.service";
import { useAuth } from "./AuthContext";
const WorkspaceContext = createContext<any>(null);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    try {
      const list = await workspaceService.getWorkspaces();
      setWorkspaces(list);
      if (list.length > 0) setSelectedWorkspace(list[0]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!user) {
    setWorkspaces([]);
    setSelectedWorkspace(null);
    setLoading(false);
    return;
  }

  fetchWorkspaces();
}, [user]);

  const createWorkspace = async (name: string, description?: string) => {
    const workspace = await workspaceService.createWorkspace(name, description);
    setWorkspaces((prev) => [...prev, workspace]);
    setSelectedWorkspace(workspace);
  };

  const updateWorkspace = async (
    id: string,
    name: string,
    description?: string,
  ) => {
    await workspaceService.updateWorkspace(id, name, description);
    await fetchWorkspaces();
  };

  const removeWorkspace = async (id: string) => {
    await workspaceService.deleteWorkspace(id);
    const remaining = workspaces.filter((w) => w._id !== id);
    setWorkspaces(remaining);
    setSelectedWorkspace(remaining.length ? remaining[0] : null);
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

export const useWorkspace = () => useContext(WorkspaceContext);
