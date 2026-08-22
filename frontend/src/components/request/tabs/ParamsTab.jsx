import { useEffect, useState } from "react";

import { useRequest } from "../../../context/RequestContext";

import KeyValueTable from "./KeyValueTable";

export default function ParamsTab() {
  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [params, setParams] = useState([]);

  useEffect(() => {
    setParams(
      selectedRequest?.queryParams || []
    );
  }, [selectedRequest]);

  const save = async () => {
    await updateRequest(
      selectedRequest._id,
      {
        queryParams: params,
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