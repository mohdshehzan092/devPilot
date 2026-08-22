import { createContext, useContext, useState } from "react";
import * as historyService from "../services/history.service";

const HistoryContext = createContext<any>(null);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory();
      setHistory(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getHistory = async (id: string) => {
    const data = await historyService.getHistoryById(id);
    setSelectedHistory(data);
    return data;
  };

  const removeHistory = async (id: string) => {
    try {
      await historyService.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <HistoryContext.Provider
      value={{ history, selectedHistory, loadHistory, getHistory, removeHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
