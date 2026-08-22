import { useState } from "react";

import UrlBar from "./UrlBar";
import RequestTabs from "./RequestTabs";

import ParamsTab from "./tabs/ParamsTab";
import HeadersTab from "./tabs/HeadersTab";
import BodyTab from "./tabs/BodyTab";
import AuthTab from "./tabs/AuthTab";
import TestsTab from "./tabs/TestsTab";
import PathParamsTab from "./tabs/PathParamsTab";

export default function RequestEditor() {
  const [activeTab, setActiveTab] =
    useState("params");

  return (
    <div className="flex flex-col h-full">

      <UrlBar />

      <RequestTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 overflow-auto">

        {activeTab === "params" && (
          <ParamsTab />
        )}

        {activeTab === "headers" && (
          <HeadersTab />
        )}

        {activeTab === "body" && ( 
          <BodyTab />
        )}

        {activeTab === "auth" && (
          <AuthTab />
        )}

        {activeTab === "tests" && (
          <TestsTab />
        )}
        {activeTab === "path" && (
  <PathParamsTab />
)}
      </div>
    </div>
  );
}