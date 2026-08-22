import { createFileRoute } from "@tanstack/react-router";
import AuthForm from "@/components/devpilot/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DevPilot" },
      {
        name: "description",
        content: "Sign in to your DevPilot workspace to build and run API requests.",
      },
      { property: "og:title", content: "Sign in — DevPilot" },
      {
        property: "og:description",
        content: "Sign in to your DevPilot workspace to build and run API requests.",
      },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
