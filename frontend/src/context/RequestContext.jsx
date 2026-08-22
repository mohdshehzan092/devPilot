import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as requestService from "../services/request.service";

import { useWorkspace } from "./WorkspaceContext";
import { useCollection } from "./CollectionContext";

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const { selectedWorkspace } = useWorkspace();
  const { selectedCollection } = useCollection();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const fetchRequests = async (collectionId) => {
    if (!collectionId) {
      setRequests([]);
      setSelectedRequest(null);
      return;
    }

    setLoading(true);

    try {
      const items =
        await requestService.getRequests(collectionId);

      setRequests(items);

      if (items.length > 0) {
        setSelectedRequest(items[0]);
      } else {
        setSelectedRequest(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCollection?._id) {
      fetchRequests(selectedCollection._id);
      
    } else {
      setRequests([]);
      setSelectedRequest(null);
    }
  }, [selectedCollection]);

  const createRequest = async (name, method = "GET") => {
 ;

  if (!selectedWorkspace || !selectedCollection) {
   
    return;
  }

  const payload = {
    name,
    description: "",
    method,
    url: "",
    workspaceId: selectedWorkspace._id,
    collectionId: selectedCollection._id,
    headers: [],
    queryParams: [],
    pathParams: [],
    body: "",
    bodyType: "NONE",
    auth: {},
    aiPrompt: "",
    environmentId: "",
    testScript: "",
  };

  console.log(payload);

  const request = await requestService.createRequest(payload);

  setRequests((prev) => [...prev, request]);
  setSelectedRequest(request);
};

  const updateRequest = async (
    id,
    payload
  ) => {
    const updated =
      await requestService.updateRequest(
        id,
        payload
      );

    const list = requests.map((request) =>
      request._id === id ? updated : request
    );

    setRequests(list);

    setSelectedRequest(updated);
  };
const restoreRequest = (request) => {
  setSelectedRequest((prev) => ({
    ...prev,
    ...request,
  }));
};
  const removeRequest = async (id) => {
    await requestService.deleteRequest(id);

    const remaining = requests.filter(
      (request) => request._id !== id
    );

    setRequests(remaining);

    setSelectedRequest(
      remaining.length ? remaining[0] : null
    );
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        selectedRequest,
        loading,
        fetchRequests,
        createRequest,
        updateRequest,
        removeRequest,
        setSelectedRequest,
        restoreRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () =>
  useContext(RequestContext);