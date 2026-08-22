import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activePanel, setActivePanel] =
    useState("collections");

  const [isOpen, setIsOpen] =
    useState(true);

  return (
    <SidebarContext.Provider
      value={{
        activePanel,
        setActivePanel,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () =>
  useContext(SidebarContext);