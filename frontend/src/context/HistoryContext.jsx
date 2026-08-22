import { createContext, useContext, useState } from "react";

import * as historyService from "../services/history.service";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const [selectedHistory, setSelectedHistory] = useState(null);

  const loadHistory = async () => {
    const data = await historyService.getHistory();

    setHistory(data);
  };

  const getHistory = async (id) => {
    const data = await historyService.getHistoryById(id);

    setSelectedHistory(data);

    return data;
  };

  const removeHistory = async (id) => {
    try {
      await historyService.deleteHistory(id);

      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        selectedHistory,

        loadHistory,
        getHistory,
        removeHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
