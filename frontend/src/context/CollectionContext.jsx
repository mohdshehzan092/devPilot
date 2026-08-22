import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as collectionService from "../services/collection.service";
import { useWorkspace } from "./WorkspaceContext";

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const { selectedWorkspace } = useWorkspace();

  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const fetchCollections = async (workspaceId) => {
    if (!workspaceId) {
      setCollections([]);
      setSelectedCollection(null);
      return;
    }

    setLoading(true);

    try {
      const items =
        await collectionService.getCollections(
          workspaceId
        );

      setCollections(items);

      if (items.length > 0) {
        setSelectedCollection(items[0]);
      } else {
        setSelectedCollection(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWorkspace?._id) {
      fetchCollections(selectedWorkspace._id);
    } else {
      setCollections([]);
      setSelectedCollection(null);
    }
  }, [selectedWorkspace]);

  const createCollection = async (
    name,
    description = ""
  ) => {
    const collection =
      await collectionService.createCollection(
        selectedWorkspace._id,
        name,
        description
      );

    setCollections((prev) => [...prev, collection]);

    setSelectedCollection(collection);
  };

  const updateCollection = async (
    id,
    name,
    description
  ) => {
    const updated =
      await collectionService.updateCollection(
        id,
        name,
        description
      );

    const list = collections.map((collection) =>
      collection._id === id ? updated : collection
    );

    setCollections(list);

    setSelectedCollection(updated);
  };

  const removeCollection = async (id) => {
    await collectionService.deleteCollection(id);

    const remaining = collections.filter(
      (collection) => collection._id !== id
    );

    setCollections(remaining);

    setSelectedCollection(
      remaining.length ? remaining[0] : null
    );
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        selectedCollection,
        loading,
        fetchCollections,
        createCollection,
        updateCollection,
        removeCollection,
        setSelectedCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () =>
  useContext(CollectionContext);