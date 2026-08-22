import { createFileRoute } from "@tanstack/react-router";
import AuthForm from "@/components/devpilot/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — DevPilot" },
      {
        name: "description",
        content: "Create a DevPilot account and start testing APIs with AI assistance.",
      },
      { property: "og:title", content: "Create account — DevPilot" },
      {
        property: "og:description",
        content: "Create a DevPilot account and start testing APIs with AI assistance.",
      },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
