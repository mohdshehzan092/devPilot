import { createFileRoute } from "@tanstack/react-router";
import WorkspaceShell from "@/components/devpilot/WorkspaceShell";
import AuthGate from "@/components/devpilot/AuthGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevPilot — AI-Native API Workspace" },
      {
        name: "description",
        content:
          "Design, send and debug HTTP requests in a fast dark workspace with AI-assisted bodies, tests and error explanations.",
      },
      { property: "og:title", content: "DevPilot — AI-Native API Workspace" },
      {
        property: "og:description",
        content:
          "Design, send and debug HTTP requests with AI-assisted bodies, tests and error explanations.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AuthGate>
      <WorkspaceShell />
    </AuthGate>
  );
}
