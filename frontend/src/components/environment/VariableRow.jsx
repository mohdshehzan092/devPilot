import { Trash2 } from "lucide-react";
import { useEnvironment } from "../../context/EnvironmentContext";

export default function VariableRow({
  variable,
  index,
}) {
  const {
    selectedEnvironment,
    setSelectedEnvironment,
  } = useEnvironment();

  const change = (field, value) => {
    const variables = [
      ...selectedEnvironment.variables,
    ];

    variables[index] = {
      ...variables[index],
      [field]: value,
    };

    setSelectedEnvironment({
      ...selectedEnvironment,
      variables,
    });
  };

  const remove = () => {
    const variables =
      selectedEnvironment.variables.filter(
        (_, i) => i !== index
      );

    setSelectedEnvironment({
      ...selectedEnvironment,
      variables,
    });
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_40px] gap-2 border-b p-2">
      <input
        value={variable.key}
        onChange={(e) =>
          change("key", e.target.value)
        }
        placeholder="Key"
        className="rounded border p-2"
      />

      <input
        value={variable.value}
        onChange={(e) =>
          change("value", e.target.value)
        }
        placeholder="Value"
        className="rounded border p-2"
      />

      <button onClick={remove}>
        <Trash2
          size={18}
          className="text-red-500"
        />
      </button>
    </div>
  );
}