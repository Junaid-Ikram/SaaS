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
  const { user, academyMemberships, loadingAcademies } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesMeta, setClassesMeta] = useState(null);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedAcademyId, setSelectedAcademyId] = useState(null);

  useEffect(() => {
    if (!Array.isArray(academyMemberships) || academyMemberships.length === 0) {
      setSelectedAcademyId(null);
      return;
    }

    setSelectedAcademyId((prev) => {
      if (prev && academyMemberships.some((membership) => membership.academyId === prev)) {
        return prev;
      }
      return academyMemberships[0]?.academyId ?? null;
    });
  }, [academyMemberships]);

  const activeAcademyId = useMemo(
    () => selectedAcademyId ?? academyMemberships?.[0]?.academyId ?? null,
    [academyMemberships, selectedAcademyId],
  );

  const academyOptions = useMemo(
    () =>
      (academyMemberships ?? []).map((membership) => ({
        value: membership.academyId,
        label: membership.academy?.name ?? "Unnamed Academy",
        status: membership.status,
      })),
    [academyMemberships],
  );

  const hasAcademyAccess = Boolean(activeAcademyId);

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

    if (!Array.isArray(academyMemberships) || academyMemberships.length === 0) {
      setClasses([]);
      setClassesMeta(null);
      setStudents([]);
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

      if (activeAcademyId) {
        params.append("academyId", activeAcademyId);
      }

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

      const studentParams = new URLSearchParams({
        limit: "100",
        page: "1",
        status: "APPROVED",
      });
      if (activeAcademyId) {
        studentParams.append("academyId", activeAcademyId);
      }

      const [classesResponse, studentsResponse] = await Promise.all([
        apiRequest(`/classes?${params.toString()}`),
        apiRequest(`/users/students?${studentParams.toString()}`),
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
  }, [academyMemberships, activeAcademyId, filters, showToast, userId]);

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

      if (!activeAcademyId) {
        const message = "Join an academy before scheduling classes.";
        showToast({
          status: "error",
          title: "No academy selected",
          description: message,
        });
        return { success: false, error: message };
      }
      try {
        await apiRequest("/classes", {
          method: "POST",
          body: {
            ...payload,
            teacherId: userId,
            academyId: activeAcademyId,
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
    [activeAcademyId, load, showToast, userId],
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
    loadingAcademies,
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
    academyOptions,
    activeAcademyId,
    setActiveAcademyId: setSelectedAcademyId,
    academyMemberships,
    hasAcademyAccess,
  };
};

export default useTeacherDashboardData;
