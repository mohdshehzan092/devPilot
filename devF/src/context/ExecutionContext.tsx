import { createContext, useContext, useState } from "react";
import * as executionService from "../services/execution.service";

const ExecutionContext = createContext<any>(null);

export const ExecutionProvider = ({ children }: { children: React.ReactNode }) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const execute = async (requestId: string) => {
    try {
      setLoading(true);
      const res = await executionService.executeRequest(requestId);
      setResponse({ success: true, ...res });
    } catch (err: any) {
      setResponse({
        success: false,
        status: err.response?.status,
        error: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreResponse = (response: any) => {
    setResponse({ success: true, ...response });
  };

  return (
    <ExecutionContext.Provider
      value={{ response, loading, execute, restoreResponse }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};

export const useExecution = () => useContext(ExecutionContext);
