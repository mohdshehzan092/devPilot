import { Info, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPanel() {
  const { user } = useAuth();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-3">
        <Settings size={14} className="text-primary" />
        <h2 className="text-[13px] font-semibold">Settings</h2>
      </div>

      <div className="scroll-thin min-h-0 flex-1 space-y-4 p-3">
        <section className="rounded-lg border border-border bg-surface-2/50 p-3">
          <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Account
          </p>
          <p className="text-[12.5px] font-medium">{user?.name || "User"}</p>
          <p className="font-mono text-[11.5px] text-muted-foreground">
            {user?.email || "—"}
          </p>
        </section>

        <section className="rounded-lg border border-border bg-surface-2/50 p-3">
          <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            API
          </p>
          <p className="font-mono text-[11.5px] break-all text-muted-foreground">
            http://localhost:3000/api
          </p>
        </section>

        <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
          <Info size={13} className="mt-0.5 shrink-0" />
          DevPilot v1.0 — collections, environments, history and AI assistance
          for your API workflow.
        </p>
      </div>
    </div>
  );
}
