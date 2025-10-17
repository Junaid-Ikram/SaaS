import { useAuth } from '../../contexts/AuthContext';
import apiRequest from '../../utils/apiClient';
import { useCallback, useEffect, useMemo, useState } from 'react';

const toLocaleDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const useTeacherDashboardData = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const metrics = useMemo(() => {
    const upcoming = classes.filter((cls) => cls.status === 'upcoming');
    const completed = classes.filter((cls) => cls.status === 'ended');

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
      const [classesResponse, studentsResponse] = await Promise.all([
        apiRequest(`/classes?limit=100&page=1&teacherId=${userId}`),
        apiRequest('/users/students?limit=100&page=1&status=APPROVED'),
      ]);

      const mappedClasses = (classesResponse?.data ?? []).map((cls) => ({
        id: cls.id,
        title: cls.title,
        description: cls.description ?? '',
        status: cls.status?.toLowerCase() ?? 'upcoming',
        start: toLocaleDateTime(cls.scheduledStart),
        end: toLocaleDateTime(cls.scheduledEnd),
        participants: cls.participantsCount ?? 0,
        timezone: cls.timezone,
      }));

      const mappedStudents = (studentsResponse?.data ?? []).map((student) => ({
        id: student.id,
        name: `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() || student.email,
        email: student.email,
        status: student.status,
        joined: toLocaleDateTime(student.createdAt),
      }));

      setClasses(mappedClasses);
      setStudents(mappedStudents);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load dashboard data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    error,
    classes,
    students,
    metrics,
    refresh: load,
  };
};

export default useTeacherDashboardData;
