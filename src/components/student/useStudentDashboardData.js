import { useAuth } from '../../contexts/AuthContext';
import apiRequest from '../../utils/apiClient';
import { useCallback, useEffect, useMemo, useState } from 'react';

const mapClass = (cls) => ({
  id: cls.id,
  title: cls.title,
  description: cls.description ?? '',
  status: cls.status?.toLowerCase() ?? 'upcoming',
  start: cls.scheduledStart,
  end: cls.scheduledEnd,
  teacher: cls.teacher ? `${cls.teacher.firstName ?? ''} ${cls.teacher.lastName ?? ''}`.trim() || cls.teacher.email : 'Unassigned',
  timezone: cls.timezone,
  joinUrl: cls.zoomJoinUrl,
});

const formatDate = (value) => {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
};

const useStudentDashboardData = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const upcomingClasses = useMemo(
    () => classes.filter((cls) => cls.status === 'upcoming').sort((a, b) => new Date(a.start) - new Date(b.start)),
    [classes],
  );

  const metrics = useMemo(() => ({
    totalClasses: classes.length,
    upcomingCount: upcomingClasses.length,
    teacherCount: teachers.length,
  }), [classes.length, upcomingClasses.length, teachers.length]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [classResponse, teachersResponse] = await Promise.all([
        apiRequest('/classes?limit=50&page=1'),
        apiRequest('/users/teachers?limit=100&page=1&status=APPROVED'),
      ]);

      const fetchedClasses = (classResponse?.data ?? []).map(mapClass);
      const fetchedTeachers = (teachersResponse?.data ?? []).map((teacher) => ({
        id: teacher.id,
        name: `${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim() || teacher.email,
        email: teacher.email,
        joined: formatDate(teacher.createdAt),
        status: teacher.status,
      }));

      setClasses(fetchedClasses);
      setTeachers(fetchedTeachers);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load dashboard data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    user,
    loading,
    error,
    classes,
    teachers,
    metrics,
    upcomingClasses,
    refresh: load,
  };
};

export default useStudentDashboardData;
