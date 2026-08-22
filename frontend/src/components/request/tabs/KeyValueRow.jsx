export default function KeyValueRow({
  item,
  onChange,
  onDelete,
}) {
  return (
    <tr className="border-b">

      <td className="p-2 w-10">
        <input
          type="checkbox"
          checked={item.enabled}
          onChange={(e) =>
            onChange({
              ...item,
              enabled: e.target.checked,
            })
          }
        />
      </td>

      <td className="p-2">
        <input
          className="w-full border rounded px-2 py-1"
          placeholder="Key"
          value={item.key}
          onChange={(e) =>
            onChange({
              ...item,
              key: e.target.value,
            })
          }
        />
      </td>

      <td className="p-2">
        <input
          className="w-full border rounded px-2 py-1"
          placeholder="Value"
          value={item.value}
          onChange={(e) =>
            onChange({
              ...item,
              value: e.target.value,
            })
          }
        />
      </td>

      <td className="w-12 text-center">
        <button
          onClick={onDelete}
          className="text-red-500"
        >
          ✕
        </button>
      </td>

    </tr>
  );
}