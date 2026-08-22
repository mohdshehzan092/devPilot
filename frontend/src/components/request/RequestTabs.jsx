const tabs = [
  "params",
  "path",
  "headers",
  "body",
  "auth",
  "tests",
];

export default function RequestTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 capitalize ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}