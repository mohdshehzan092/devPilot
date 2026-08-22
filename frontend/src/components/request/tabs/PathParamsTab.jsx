import { useEffect, useState } from "react";

import { useRequest } from "../../../context/RequestContext";

import KeyValueTable from "./KeyValueTable";

export default function PathParamsTab() {
  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [params, setParams] = useState([]);

  useEffect(() => {
    setParams(
      selectedRequest?.pathParams || []
    );
  }, [selectedRequest]);

  const save = async () => {
    if (!selectedRequest) return;

    await updateRequest(
      selectedRequest._id,
      {
        pathParams: params,
      }
    );
  };

  return (
    <div onBlur={save}>
      <KeyValueTable
        items={params}
        setItems={setParams}
      />
    </div>
  );
}