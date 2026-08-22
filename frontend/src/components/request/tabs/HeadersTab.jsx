import { useEffect, useState } from "react";

import { useRequest } from "../../../context/RequestContext";

import KeyValueTable from "./KeyValueTable";

export default function HeadersTab() {
  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    setHeaders(
      selectedRequest?.headers || []
    );
  }, [selectedRequest]);

  const save = async () => {
    if (!selectedRequest) return;

    await updateRequest(
      selectedRequest._id,
      {
        headers,
      }
    );
  };

  return (
    <div onBlur={save}>
      <KeyValueTable
        items={headers}
        setItems={setHeaders}
      />
    </div>
  );
}