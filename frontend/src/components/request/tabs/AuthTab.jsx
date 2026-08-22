import { useEffect, useState } from "react";
import { useRequest } from "../../../context/RequestContext";

export default function AuthTab() {
  const {
    selectedRequest,
    updateRequest,
  } = useRequest();

  const [authType, setAuthType] =
    useState("NONE");

  const [token, setToken] =
    useState("");

  useEffect(() => {
    if (!selectedRequest) return;

    setAuthType(
      selectedRequest.auth?.type ||
        "NONE"
    );

    setToken(
      selectedRequest.auth?.token ||
        ""
    );
  }, [selectedRequest]);

  const save = async () => {
    if (!selectedRequest) return;

    await updateRequest(
      selectedRequest._id,
      {
        auth: {
          type: authType,
          token,
        },
      }
    );
  };

  return (
    <div
      className="p-4 flex flex-col gap-4"
      onBlur={save}
    >
      <select
        value={authType}
        onChange={(e) =>
          setAuthType(e.target.value)
        }
        className="border rounded px-3 py-2 w-64"
      >
        <option value="NONE">
          No Auth
        </option>

        <option value="BEARER">
          Bearer Token
        </option>
      </select>

      {authType === "BEARER" && (
        <input
          type="text"
          value={token}
          onChange={(e) =>
            setToken(e.target.value)
          }
          placeholder="Bearer Token"
          className="border rounded px-3 py-2"
        />
      )}
    </div>
  );
}