import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      window.location.replace("/login");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
