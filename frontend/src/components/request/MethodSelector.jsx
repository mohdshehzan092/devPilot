const methods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export default function MethodSelector({
  method,
  setMethod,
}) {

  return (

    <select
      value={method}
      onChange={(e) => setMethod(e.target.value)}
      className="w-28 rounded-lg border px-3 py-2 outline-none"
    >

      {methods.map((m) => (

        <option key={m}>
          {m}
        </option>

      ))}

    </select>

  );
}