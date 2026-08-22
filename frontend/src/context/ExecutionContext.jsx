import { createContext, useContext, useState } from "react";
import * as executionService from "../services/execution.service";

const ExecutionContext = createContext();

export const ExecutionProvider = ({ children }) => {
  const [response, setResponse] = useState(null);

  const execute = async (requestId) => {
    try {
      const res =
        await executionService.executeRequest(requestId);

      setResponse({
        success: true,
        ...res,
      });
    } catch (err) {
      setResponse({
        success: false,
        status: err.response?.status,
        error: err.response?.data,
      });
    }
  };

  // 👇 NEW
const restoreResponse = (response) => {
  setResponse({
    success: true,
    ...response,
  });
};

  return (
    <ExecutionContext.Provider
      value={{
        response,
        execute,
        restoreResponse,
      }}
    >
      {children}
    </ExecutionContext.Provider>
  );
};

export const useExecution = () =>
  useContext(ExecutionContext);