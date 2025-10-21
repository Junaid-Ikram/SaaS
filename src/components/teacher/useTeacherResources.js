import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import apiRequest from "../../utils/apiClient";
import { mapResourceRecord } from "../../utils/resourceTransforms";

const useTeacherResources = (classes = []) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classIds = useMemo(
    () => new Set(classes.map((cls) => cls.id)),
    [classes],
  );

  const loadResources = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest("/resources?limit=100&page=1");
      const rawResources = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      const mapped = rawResources.map(mapResourceRecord);
      const filtered = mapped.filter((resource) => {
        if (resource.uploaderId === userId) {
          return true;
        }
        if (resource.visibility === "PUBLIC") {
          return true;
        }
        if (resource.classId && classIds.has(resource.classId)) {
          return true;
        }
        return false;
      });
      setResources(filtered);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load resources.";
      setError(message);
      showToast({
        status: "error",
        title: "Failed to load resources",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [classIds, showToast, userId]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const createResource = useCallback(
    async (payload) => {
      try {
        await apiRequest("/resources", {
          method: "POST",
          body: payload,
        });
        showToast({
          status: "success",
          title: "Resource uploaded",
          description: "Students can now access this resource.",
        });
        await loadResources();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to upload resource.";
        showToast({
          status: "error",
          title: "Upload failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [loadResources, showToast],
  );

  const updateResource = useCallback(
    async (resourceId, updates) => {
      try {
        await apiRequest(`/resources/${resourceId}`, {
          method: "PATCH",
          body: updates,
        });
        showToast({
          status: "success",
          title: "Resource updated",
          description: "Your changes have been saved.",
        });
        await loadResources();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to update resource.";
        showToast({
          status: "error",
          title: "Update failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [loadResources, showToast],
  );

  const deleteResource = useCallback(
    async (resourceId) => {
      try {
        await apiRequest(`/resources/${resourceId}`, {
          method: "DELETE",
        });
        showToast({
          status: "success",
          title: "Resource removed",
          description: "The resource is no longer available to students.",
        });
        await loadResources();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to delete resource.";
        showToast({
          status: "error",
          title: "Deletion failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [loadResources, showToast],
  );

  return {
    resources,
    loading,
    error,
    refresh: loadResources,
    createResource,
    updateResource,
    deleteResource,
  };
};

export default useTeacherResources;
