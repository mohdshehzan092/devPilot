import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<any>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePanel, setActivePanel] = useState("collections");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider
      value={{ activePanel, setActivePanel, isOpen, setIsOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
