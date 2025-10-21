import { useCallback, useEffect, useState } from "react";
import apiRequest from "../../utils/apiClient";
import { useToast } from "../../contexts/ToastContext";

const DEFAULT_SETTINGS = {
  allowTeacherSelfRegistration: true,
  autoApproveStudents: false,
  notifyOwnerOnNewRegistration: true,
  requireZoomPassword: true,
  defaultClassDurationMinutes: 60,
};

const useAcademySettings = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest("/academy-settings");
      setSettings({ ...DEFAULT_SETTINGS, ...(response ?? {}) });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load academy settings.";
      setError(message);
      showToast({
        status: "error",
        title: "Failed to load settings",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const update = useCallback(
    async (patch) => {
      setSaving(true);
      setError(null);
      try {
        const response = await apiRequest("/academy-settings", {
          method: "PATCH",
          body: patch,
        });
        const merged = { ...DEFAULT_SETTINGS, ...(response ?? {}) };
        setSettings(merged);
        showToast({
          status: "success",
          title: "Settings saved",
          description: "Academy preferences updated successfully.",
        });
        return { success: true, data: merged };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to update academy settings.";
        setError(message);
        showToast({
          status: "error",
          title: "Save failed",
          description: message,
        });
        return { success: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    settings,
    loading,
    saving,
    error,
    refresh: load,
    update,
  };
};

export default useAcademySettings;
