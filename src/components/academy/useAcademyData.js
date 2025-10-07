import { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const buildAuthHeaders = () => {
  const storedToken = localStorage.getItem('accessToken');
  return storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
};

const apiRequest = async (path, init = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data ?? payload;
};

const formatTimeRange = (startIso, endIso, timezone) => {
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: timezone });
    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });

    const date = dateFormatter.format(start);
    return `${date}, ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  } catch (error) {
    return '';
  }
};

const mapClassRecord = (record) => {
  const status = (record.status ?? 'UPCOMING').toLowerCase();
  const teacherName = record.teacher ? `${record.teacher.firstName} ${record.teacher.lastName ?? ''}`.trim() : 'Unassigned';

  return {
    id: record.id,
    title: record.title,
    description: record.description ?? '',
    teacher: teacherName,
    schedule: formatTimeRange(record.scheduledStart, record.scheduledEnd, record.timezone),
    date: record.scheduledStart,
    duration: record.durationMinutes,
    students_count: record.participantsCount ?? 0,
    attendance: status === 'ended' ? record.participantsCount ?? 0 : null,
    status,
    zoomLink: record.zoomJoinUrl,
  };
};

const mapTransactionType = (type) => {
  if (type === 'CREDIT' || type === 'TRANSFER_IN') {
    return 'purchase';
  }
  return 'usage';
};

const mapTransactionRecord = (record) => ({
  id: record.id,
  date: record.createdAt,
  amount: record.amount,
  type: mapTransactionType(record.type),
  status: 'Completed',
  transactionId: record.id,
  className: record.metadata?.classTitle ?? record.reason ?? 'N/A',
});

const deriveUserId = () => {
  try {
    const stored = localStorage.getItem('dummyUser');
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored);
    return parsed?.id ?? null;
  } catch (_error) {
    return null;
  }
};

const emptySubscriptionUsage = {
  studentLimit: 0,
  studentCount: 0,
  teacherLimit: 0,
  teacherCount: 0,
  storageLimit: 0,
  storageUsed: 0,
  zoomCreditsLimit: 0,
  zoomCreditsUsed: 0,
  recentActivity: [],
};

const defaultAcademyData = {
  id: '',
  name: 'Your Academy',
  createdAt: new Date().toISOString(),
  subscription: {
    plan: 'Professional',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
};

const useAcademyData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academyData, setAcademyData] = useState(defaultAcademyData);
  const [classes, setClasses] = useState([]);
  const [zoomCredits, setZoomCredits] = useState({ available: 0, used: 0, history: [] });
  const [subscriptionUsage, setSubscriptionUsage] = useState(emptySubscriptionUsage);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [payments, setPayments] = useState([]);

  const userId = useMemo(() => deriveUserId(), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [classesResponse, creditsSummary, transactionsResponse] = await Promise.all([
        apiRequest('/classes?limit=100'),
        userId ? apiRequest(`/zoom-credits/${userId}/summary`) : Promise.resolve(null),
        userId ? apiRequest(`/zoom-credits/${userId}/transactions?limit=50`) : Promise.resolve({ data: [] }),
      ]);

      const mappedClasses = Array.isArray(classesResponse?.data)
        ? classesResponse.data.map(mapClassRecord)
        : [];

      setClasses(mappedClasses);

      if (creditsSummary) {
        const transactions = Array.isArray(transactionsResponse?.data) ? transactionsResponse.data : [];
        const mappedHistory = transactions.map(mapTransactionRecord);
        setZoomCredits({
          available: creditsSummary.balance ?? 0,
          used: creditsSummary.totalDebited ?? 0,
          history: mappedHistory,
        });
      }

      setSubscriptionUsage((prev) => ({
        ...prev,
        teacherCount: teachers.length,
        studentCount: students.length,
        zoomCreditsUsed: creditsSummary?.totalDebited ?? prev.zoomCreditsUsed,
      }));

      setAcademyData((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load academy data');
    } finally {
      setLoading(false);
    }
  }, [students.length, teachers.length, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    loading,
    error,
    refresh: loadData,
    academyData,
    classes,
    zoomCredits,
    subscriptionUsage,
    notifications,
    unreadNotifications,
    pendingUsers,
    teachers,
    students,
    resources,
    payments,
    setNotifications,
    setUnreadNotifications,
    setPendingUsers,
    setTeachers,
    setStudents,
    setResources,
    setPayments,
  };
};

export default useAcademyData;
