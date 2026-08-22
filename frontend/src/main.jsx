import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { CollectionProvider } from "./context/CollectionContext";
import { RequestProvider } from "./context/RequestContext";
import { ExecutionProvider } from "./context/ExecutionContext";
import { HistoryProvider } from "./context/HistoryContext";
import { SidebarProvider } from "./context/SidebarContext";
import { EnvironmentProvider } from "./context/EnvironmentContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <Toaster
      position="top-right"
      reverseOrder={false}
    />
   <AuthProvider>
  <WorkspaceProvider>
    <EnvironmentProvider>
    <CollectionProvider>
      <RequestProvider>
        <SidebarProvider>
          <HistoryProvider>
        <ExecutionProvider>
            <App />
        </ExecutionProvider>
          </HistoryProvider>
        </SidebarProvider>
      </RequestProvider>
    </CollectionProvider>
    </EnvironmentProvider>
  </WorkspaceProvider>
</AuthProvider>
  </React.StrictMode>
);