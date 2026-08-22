import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import * as environmentService from "../services/environment.service";
import { useWorkspace } from "./WorkspaceContext";

const EnvironmentContext = createContext();

export const EnvironmentProvider = ({ children }) => {
  const { selectedWorkspace } = useWorkspace();

  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadEnvironments = async () => {
    if (!selectedWorkspace) {
      setEnvironments([]);
      setSelectedEnvironment(null);
      return;
    }

    setLoading(true);

    try {
      const data =
        await environmentService.getEnvironments(
          selectedWorkspace._id
        );

      setEnvironments(data);

      if (data.length) {
        setSelectedEnvironment(data[0]);
      } else {
        setSelectedEnvironment(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvironments();
  }, [selectedWorkspace]);

  const createEnvironment = async (name) => {
    const env =
      await environmentService.createEnvironment({
        name,
        workspaceId: selectedWorkspace._id,
        variables: [],
      });

    setEnvironments((prev) => [...prev, env]);

    setSelectedEnvironment(env);
  };

  const updateEnvironment = async (
    id,
    payload
  ) => {
    const cleanedVariables =
      (payload.variables || []).filter(
        (v) =>
          v.key.trim() !== "" ||
          v.value.trim() !== ""
      );

    const updated =
      await environmentService.updateEnvironment(
        id,
        {
          ...payload,
          variables: cleanedVariables,
        }
      );

    setEnvironments((prev) =>
      prev.map((item) =>
        item._id === id ? updated : item
      )
    );

    setSelectedEnvironment(updated);
  };

  const removeEnvironment = async (id) => {
    await environmentService.deleteEnvironment(id);

    const remaining =
      environments.filter(
        (item) => item._id !== id
      );

    setEnvironments(remaining);

    setSelectedEnvironment(
      remaining.length
        ? remaining[0]
        : null
    );
  };

  return (
    <EnvironmentContext.Provider
      value={{
        environments,
        selectedEnvironment,
        setSelectedEnvironment,

        loading,

        loadEnvironments,

        createEnvironment,

        updateEnvironment,

        removeEnvironment,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () =>
  useContext(EnvironmentContext);