import { Plus, Trash2 } from "lucide-react";

export default function KeyValueTable({
  items,
  setItems,
  onCommit,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  emptyLabel = "No entries yet",
}: {
  items: any[];
  setItems: (next: any[]) => void;
  onCommit?: () => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  emptyLabel?: string;
}) {
  const update = (index: number, field: string, value: any) => {
    const list = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(list);
  };

  return (
    <div className="p-3" onBlur={onCommit}>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[36px_minmax(0,1fr)_minmax(0,1.4fr)_36px] items-center gap-2 border-b border-border bg-surface-2 px-2 py-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          <span />
          <span>{keyPlaceholder}</span>
          <span>{valuePlaceholder}</span>
          <span />
        </div>

        {items.length === 0 && (
          <p className="px-3 py-6 text-center text-[12px] text-muted-foreground">
            {emptyLabel}
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[36px_minmax(0,1fr)_minmax(0,1.4fr)_36px] items-center gap-2 border-b border-border px-2 py-1.5 last:border-b-0"
          >
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={item.enabled ?? true}
                onChange={(e) => update(index, "enabled", e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--primary)]"
              />
            </div>

            <input
              value={item.key ?? ""}
              onChange={(e) => update(index, "key", e.target.value)}
              placeholder={keyPlaceholder}
              className="field border-transparent bg-transparent font-mono text-[12px] hover:border-border"
            />

            <input
              value={item.value ?? ""}
              onChange={(e) => update(index, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="field border-transparent bg-transparent font-mono text-[12px] hover:border-border"
            />

            <button
              onClick={() => {
                setItems(items.filter((_, i) => i !== index));
              }}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          setItems([...items, { key: "", value: "", enabled: true }])
        }
        className="mt-2 flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <Plus size={13} /> Add row
      </button>
    </div>
  );
}
