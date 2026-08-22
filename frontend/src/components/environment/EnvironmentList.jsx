import { useEnvironment } from "../../context/EnvironmentContext";
import EnvironmentItem from "./EnvironmentItem";

export default function EnvironmentList() {
  const {
    environments,
    loading,
  } = useEnvironment();

  if (loading) {
    return (
      <div className="p-5 text-gray-500">
        Loading...
      </div>
    );
  }

  if (environments.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No Environment
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">

      {environments.map((env) => (
        <EnvironmentItem
          key={env._id}
          item={env}
        />
      ))}

    </div>
  );
}