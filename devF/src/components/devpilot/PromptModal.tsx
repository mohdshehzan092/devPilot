import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function PromptModal({
  open,
  title,
  label,
  initialValue = "",
  confirmLabel = "Create",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  const submit = () => {
    if (!value.trim()) return;
    onConfirm(value.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-sm rounded-xl border border-border bg-popover p-5 shadow-[var(--shadow-pop)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>

        <label className="mb-1.5 block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </label>

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="field"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
