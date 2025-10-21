import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import apiRequest from "../../utils/apiClient";

const DEFAULT_FILTERS = {
  status: "all",
  search: "",
  from: "",
  to: "",
};

const toLocaleDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const normaliseClass = (record) => ({
  id: record.id,
  title: record.title,
  description: record.description ?? "",
  status: record.status?.toLowerCase() ?? "upcoming",
  scheduledStart: record.scheduledStart,
  scheduledEnd: record.scheduledEnd,
  start: toLocaleDateTime(record.scheduledStart),
  end: toLocaleDateTime(record.scheduledEnd),
  participants: record.participantsCount ?? 0,
  timezone: record.timezone ?? "UTC",
  creditsConsumed: record.creditsConsumed ?? 0,
  zoomJoinUrl: record.zoomJoinUrl ?? null,
});

const useTeacherDashboardData = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesMeta, setClassesMeta] = useState(null);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const metrics = useMemo(() => {
    const upcoming = classes.filter((cls) => cls.status === "upcoming");
    const completed = classes.filter((cls) => cls.status === "ended");

    return {
      totalClasses: classes.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      studentCount: students.length,
    };
  }, [classes, students]);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
        teacherId: userId,
      });

      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status.toUpperCase());
      }
      if (filters.search.trim()) {
        params.append("search", filters.search.trim());
      }
      if (filters.from) {
        params.append("from", filters.from);
      }
      if (filters.to) {
        params.append("to", filters.to);
      }

      const [classesResponse, studentsResponse] = await Promise.all([
        apiRequest(`/classes?${params.toString()}`),
        apiRequest("/users/students?limit=100&page=1&status=APPROVED"),
      ]);

      const mappedClasses = (classesResponse?.data ?? []).map(normaliseClass);
      setClasses(mappedClasses);
      setClassesMeta(classesResponse?.meta ?? null);

      const mappedStudents = (studentsResponse?.data ?? []).map((student) => ({
        id: student.id,
        name:
          `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
          student.email,
        email: student.email,
        status: student.status,
        joined: toLocaleDateTime(student.createdAt),
      }));
      setStudents(mappedStudents);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load dashboard data.";
      setError(message);
      showToast({
        status: "error",
        title: "Failed to load classes",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, showToast, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const createClass = useCallback(
    async (payload) => {
      if (!userId) {
        return {
          success: false,
          error: "Unable to determine teacher identity.",
        };
      }
      try {
        await apiRequest("/classes", {
          method: "POST",
          body: {
            ...payload,
            teacherId: userId,
          },
        });
        showToast({
          status: "success",
          title: "Class scheduled",
          description: "The Zoom class has been created successfully.",
        });
        await load();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to schedule class.";
        showToast({
          status: "error",
          title: "Creation failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [load, showToast, userId],
  );

  const updateClass = useCallback(
    async (classId, payload) => {
      try {
        await apiRequest(`/classes/${classId}`, {
          method: "PATCH",
          body: payload,
        });
        showToast({
          status: "success",
          title: "Class updated",
          description: "Changes have been saved successfully.",
        });
        await load();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to update class.";
        showToast({
          status: "error",
          title: "Update failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [load, showToast],
  );

  const deleteClass = useCallback(
    async (classId) => {
      try {
        await apiRequest(`/classes/${classId}`, {
          method: "DELETE",
        });
        showToast({
          status: "success",
          title: "Class removed",
          description: "The class and meeting have been cancelled.",
        });
        await load();
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to delete class.";
        showToast({
          status: "error",
          title: "Deletion failed",
          description: message,
        });
        return { success: false, error: message };
      }
    },
    [load, showToast],
  );

  return {
    loading,
    error,
    classes,
    classesMeta,
    students,
    filters,
    setFilters: updateFilters,
    metrics,
    refresh: load,
    createClass,
    updateClass,
    deleteClass,
  };
};

export default useTeacherDashboardData;
