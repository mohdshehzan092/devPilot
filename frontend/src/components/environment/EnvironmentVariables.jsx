import { Plus } from "lucide-react";
import { useEnvironment } from "../../context/EnvironmentContext";
import VariableRow from "./VariableRow";

export default function EnvironmentVariables() {
  const {
    selectedEnvironment,
    setSelectedEnvironment,
    updateEnvironment,
  } = useEnvironment();

  if (!selectedEnvironment) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select Environment
      </div>
    );
  }

  const variables =
    selectedEnvironment.variables || [];

  const addVariable = () => {
    setSelectedEnvironment({
      ...selectedEnvironment,
      variables: [
        ...variables,
        {
          key: "",
          value: "",
        },
      ],
    });
  };

  const saveVariables = async () => {
    await updateEnvironment(
      selectedEnvironment._id,
      {
        variables: selectedEnvironment.variables,
      }
    );
  };

  return (
    <div className="flex flex-col h-full">

      <div className="border-b p-4">
        <h2 className="font-semibold text-lg">
          {selectedEnvironment.name}
        </h2>
      </div>

      <div className="flex-1 overflow-auto">

        <div className="grid grid-cols-2 gap-2 p-3 font-semibold border-b bg-gray-50">
          <div>KEY</div>
          <div>VALUE</div>
        </div>

        {variables.map((item, index) => (
          <VariableRow
            key={index}
            index={index}
            variable={item}
          />
        ))}

      </div>

      <div className="border-t p-3 flex gap-3">

        <button
          onClick={addVariable}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
        >
          <Plus size={16} />
          Add Variable
        </button>

        <button
          onClick={saveVariables}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Save
        </button>

      </div>

    </div>
  );
}