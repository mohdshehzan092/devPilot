import { useRequest } from "../../context/RequestContext";

import RequestItem from "./RequestItem";

export default function RequestTree() {
  const {
    requests,
    selectedRequest,
    setSelectedRequest,
    createRequest,
  } = useRequest();

  const handleCreate = async () => {
    const name = prompt("Request Name");

    if (!name) return;

    await createRequest(name);
  };

  return (
    <div className="ml-5 mt-2">

      {requests.map((request) => (
        <RequestItem
          key={request._id}
          request={request}
          selected={
            selectedRequest?._id === request._id
          }
          onClick={() =>
            setSelectedRequest(request)
          }
        />
      ))}

      <button
        onClick={handleCreate}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        + New Request
      </button>

    </div>
  );
}