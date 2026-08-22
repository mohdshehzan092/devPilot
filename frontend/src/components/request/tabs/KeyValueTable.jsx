export default function KeyValueTable({
  items,
  setItems,
}) {
  const updateItem = (
    index,
    field,
    value
  ) => {
    const list = [...items];

    list[index][field] = value;

    setItems(list);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        key: "",
        value: "",
        enabled: true,
      },
    ]);
  };

  const removeRow = (index) => {
    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="p-4">

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 w-16">
              Enable
            </th>

            <th className="p-2">
              Key
            </th>

            <th className="p-2">
              Value
            </th>

            <th className="p-2 w-20">
              Action
            </th>
          </tr>
        </thead>

        <tbody>

          {items.map((item, index) => (
            <tr key={index}>

              <td className="text-center">

                <input
                
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "enabled",
                      e.target.checked
                    )
                  }
                />

              </td>

              <td>

                <input
                  value={item.key}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "key",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </td>

              <td>

                <input
                  value={item.value}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "value",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </td>

              <td className="text-center">

                <button
                  onClick={() =>
                    removeRow(index)
                  }
                  className="text-red-500"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <button
        onClick={addRow}
        className="mt-3 text-blue-600"
      >
        + Add Param
      </button>

    </div>
  );
}