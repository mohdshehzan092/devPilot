import { useState } from "react";
import { Layers, Plus, Save, Trash2 } from "lucide-react";

import { useEnvironment } from "@/context/EnvironmentContext";
import PromptModal from "./PromptModal";
import { cn } from "@/lib/utils";

export default function EnvironmentPanel() {
  const {
    environments,
    selectedEnvironment,
    setSelectedEnvironment,
    createEnvironment,
    updateEnvironment,
    removeEnvironment,
    loading,
  } = useEnvironment();

  const [open, setOpen] = useState(false);

  const variables = selectedEnvironment?.variables || [];

  const changeVar = (index: number, field: string, value: string) => {
    const next = [...variables];
    next[index] = { ...next[index], [field]: value };
    setSelectedEnvironment({ ...selectedEnvironment, variables: next });
  };

  const addVar = () => {
    setSelectedEnvironment({
      ...selectedEnvironment,
      variables: [...variables, { key: "", value: "" }],
    });
  };

  const removeVar = (index: number) => {
    setSelectedEnvironment({
      ...selectedEnvironment,
      variables: variables.filter((_: any, i: number) => i !== index),
    });
  };

  const save = async () => {
    if (!selectedEnvironment) return;
    await updateEnvironment(selectedEnvironment._id, {
      variables: selectedEnvironment.variables,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-3">
        <Layers size={14} className="text-primary" />
        <h2 className="text-[13px] font-semibold">Environments</h2>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="scroll-thin max-h-44 shrink-0 border-b border-border">
        {loading && (
          <p className="px-3 py-4 text-[12px] text-muted-foreground">
            Loading...
          </p>
        )}
        {!loading && environments.length === 0 && (
          <p className="px-3 py-6 text-center text-[12px] text-muted-foreground">
            No environments
          </p>
        )}
        {environments.map((env: any) => (
          <div
            key={env._id}
            onClick={() => setSelectedEnvironment(env)}
            className={cn(
              "group flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors",
              selectedEnvironment?._id === env._id
                ? "bg-primary-soft"
                : "hover:bg-surface-2/70",
            )}
          >
            <span className="min-w-0 flex-1 truncate text-[12.5px]">
              {env.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!window.confirm("Delete this environment?")) return;
                removeEnvironment(env._id);
              }}
              className="rounded p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-destructive"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {selectedEnvironment ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="truncate text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              {selectedEnvironment.name} variables
            </p>
          </div>

          <div className="scroll-thin min-h-0 flex-1 p-2">
            {variables.length === 0 && (
              <p className="px-1 py-6 text-center text-[12px] text-muted-foreground">
                No variables
              </p>
            )}

            {variables.map((item: any, index: number) => (
              <div
                key={index}
                className="mb-1.5 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_28px] items-center gap-1.5"
              >
                <input
                  value={item.key}
                  onChange={(e) => changeVar(index, "key", e.target.value)}
                  placeholder="KEY"
                  className="field font-mono text-[12px]"
                />
                <input
                  value={item.value}
                  onChange={(e) => changeVar(index, "value", e.target.value)}
                  placeholder="value"
                  className="field font-mono text-[12px]"
                />
                <button
                  onClick={() => removeVar(index)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex shrink-0 gap-2 border-t border-border p-2.5">
            <button
              onClick={addVar}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-[12px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Plus size={13} /> Variable
            </button>
            <button
              onClick={save}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 py-2 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Save size={13} /> Save
            </button>
          </div>
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-[12px] text-muted-foreground">
          Select an environment
        </p>
      )}

      <PromptModal
        open={open}
        title="New environment"
        label="Environment name"
        onCancel={() => setOpen(false)}
        onConfirm={async (name) => {
          setOpen(false);
          await createEnvironment(name);
        }}
      />
    </div>
  );
}
