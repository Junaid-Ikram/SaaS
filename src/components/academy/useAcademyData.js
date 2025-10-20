import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiRequest from '../../utils/apiClient';

const EMPTY_SUBSCRIPTION_USAGE = {
  studentLimit: 0,
  teacherLimit: 0,
  storageLimit: 0,
  studentCount: 0,
  teacherCount: 0,
  storageUsed: 0,
  zoomCreditsLimit: 0,
  zoomCreditsUsed: 0,
  recentActivity: [],
};

const EMPTY_USER_SUMMARY = {
  approved: 0,
  pending: 0,
  rejected: 0,
  inactive: 0,
};

const EMPTY_CLASSES_SUMMARY = {
  upcoming: 0,
  ongoing: 0,
  ended: 0,
  cancelled: 0,
};

const DEFAULT_CLASSES_FILTERS = {
  page: 1,
  limit: 10,
  status: 'ALL',
  search: '',
  teacherId: 'all',
};

const safeLocaleDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

const normaliseRole = (role) => (role ? role.toLowerCase() : null);

const mapClassRecord = (record) => {
  const status = (record.status ?? 'UPCOMING').toLowerCase();
  const teacherName = record.teacher
    ? `${record.teacher.firstName} ${record.teacher.lastName ?? ''}`.trim() || record.teacher.email
    : 'Unassigned';

  return {
    id: record.id,
    title: record.title,
    description: record.description ?? '',
    teacher: teacherName,
    teacherId: record.teacher?.id ?? null,
    schedule: formatTimeRange(record.scheduledStart, record.scheduledEnd, record.timezone),
    date: record.scheduledStart,
    endDate: record.scheduledEnd,
    duration: record.durationMinutes,
    students_count: record.participantsCount ?? 0,
    attendance: status === 'ended' ? record.participantsCount ?? 0 : null,
    status,
    timezone: record.timezone,
    zoomLink: record.zoomJoinUrl,
  };
};

const formatTimeRange = (startIso, endIso, timezone) => {
  if (!startIso || !endIso) return '';
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
    return `${date}, ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
  } catch (error) {
    return '';
  }
};

const mapTransactionType = (type) => (type === 'CREDIT' || type === 'TRANSFER_IN' ? 'purchase' : 'usage');

const mapTransactionRecord = (record) => {
  const metadata = record?.metadata ?? {};
  const paymentStatus = typeof metadata.paymentStatus === 'string' ? metadata.paymentStatus : 'Completed';
  const source = typeof metadata.source === 'string' ? metadata.source : null;
  const description =
    source === 'purchase'
      ? record.reason ?? 'Credit purchase'
      : metadata.classTitle ?? record.reason ?? 'N/A';

  return {
    id: record.id,
    date: record.createdAt ?? record.date ?? new Date().toISOString(),
    amount: record.amount,
    type: mapTransactionType(record.type),
    status: paymentStatus,
    transactionId: record.id,
    className: description,
  };
};

const mapResourceRecord = (record) => ({
  id: record.id,
  title: record.title,
  description: record.description ?? '',
  type: record.fileType ?? 'other',
  mimeType: record.mimeType ?? '',
  size: record.fileSize ?? 0,
  classId: record.classId ?? null,
  class: record.classTitle ?? (record.classId ? 'Class Resource' : 'General'),
  uploaderId: record.uploaderId,
  uploader: record.uploaderName ?? 'Unknown',
  downloadUrl: record.fileUrl,
  fileKey: record.fileKey ?? null,
  visibility: record.visibility ?? 'ACADEMY',
  uploadDate: record.createdAt ?? new Date().toISOString(),
  metadata: record.metadata ?? null,
});

const mapPaymentRecord = (payment) => ({
  id: payment.id,
  description: payment.reference ?? payment.provider ?? 'Payment',
  student: payment.userName ?? 'Unknown',
  date: safeLocaleDate(payment.createdAt),
  amount: Number(payment.amount ?? 0),
  status: (payment.status ?? '').toLowerCase(),
  type: payment.provider ?? 'internal',
  currency: payment.currency ?? 'USD',
});

const buildDisplayName = (user) => {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  return name || user.email;
};

const useAcademyData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academyData, setAcademyData] = useState({
    id: '',
    name: 'Your Academy',
    createdAt: new Date().toISOString(),
    subscription: {
      plan: 'Professional',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
    },
  });
  const [classes, setClasses] = useState([]);
  const [classesMeta, setClassesMeta] = useState(null);
  const [classesSummary, setClassesSummary] = useState(EMPTY_CLASSES_SUMMARY);
  const [classesFilters, setClassesFilters] = useState(DEFAULT_CLASSES_FILTERS);
  const classesFiltersRef = useRef(DEFAULT_CLASSES_FILTERS);
  const [classesLoading, setClassesLoading] = useState(false);
  const [zoomCredits, setZoomCredits] = useState({
    available: 0,
    used: 0,
    totalCredited: 0,
    history: [],
  });
  const [subscriptionUsage, setSubscriptionUsage] = useState(EMPTY_SUBSCRIPTION_USAGE);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachersSummary, setTeachersSummary] = useState(EMPTY_USER_SUMMARY);
  const [studentsSummary, setStudentsSummary] = useState(EMPTY_USER_SUMMARY);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  useEffect(() => {
    classesFiltersRef.current = classesFilters;
  }, [classesFilters]);

  const userId = user?.id ?? null;
  const academyName = useMemo(() => {
    if (!user) return 'Your Academy';
    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    return name ? `${name}'s Academy` : 'Your Academy';
  }, [user]);

  const mapTeacherRecord = useCallback(
    (teacher) => ({
      id: teacher.id,
      name: buildDisplayName(teacher),
      email: teacher.email,
      role: normaliseRole(teacher.role),
      status: teacher.status,
      joinDate: safeLocaleDate(teacher.createdAt),
      classes: teacher._count?.teachingClasses ?? 0,
      phoneNumber: teacher.phoneNumber ?? '',
    }),
    [],
  );

  const mapStudentRecord = useCallback(
    (student) => ({
      id: student.id,
      name: buildDisplayName(student),
      email: student.email,
      role: normaliseRole(student.role),
      status: student.status,
      joinDate: safeLocaleDate(student.createdAt),
      enrolledClasses: student._count?.classParticipants ?? 0,
      phoneNumber: student.phoneNumber ?? '',
    }),
    [],
  );

  const mapPendingRecord = useCallback((pending) => ({
    id: pending.id,
    name: buildDisplayName(pending),
    email: pending.email,
    role: normaliseRole(pending.role),
    status: pending.status,
    requestDate: safeLocaleDate(pending.createdAt),
  }), []);

  const fetchClasses = useCallback(
    async (overrides = {}) => {
      const currentFilters = classesFiltersRef.current ?? DEFAULT_CLASSES_FILTERS;
      const nextFilters = { ...currentFilters, ...overrides };
      const params = new URLSearchParams();
      params.set('page', String(nextFilters.page ?? 1));
      params.set('limit', String(nextFilters.limit ?? 10));
      if (nextFilters.status && nextFilters.status !== 'ALL') {
        params.set('status', nextFilters.status);
      }
      if (nextFilters.teacherId && nextFilters.teacherId !== 'all') {
        params.set('teacherId', nextFilters.teacherId);
      }
      if (nextFilters.search) {
        params.set('search', nextFilters.search);
      }

      setClassesLoading(true);
      try {
        const response = await apiRequest(`/classes?${params.toString()}`);
        if (response) {
          const mapped = Array.isArray(response.data) ? response.data.map(mapClassRecord) : [];
          setClasses(mapped);
          setClassesMeta(response.meta ?? null);
          setClassesSummary(response.summary ?? EMPTY_CLASSES_SUMMARY);
          classesFiltersRef.current = nextFilters;
          setClassesFilters(nextFilters);
        }
      } catch (err) {
        console.error('Failed to fetch classes', err);
      } finally {
        setClassesLoading(false);
      }
    },
    [mapClassRecord],
  );

  const loadResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const response = await apiRequest('/resources?limit=100&page=1');
      const mapped = Array.isArray(response?.data) ? response.data.map(mapResourceRecord) : [];
      setResources(mapped);
    } catch (error) {
      console.error('Failed to load resources', error);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const response = await apiRequest('/payments?limit=100&page=1');
      const mapped = Array.isArray(response?.data) ? response.data.map(mapPaymentRecord) : [];
      setPayments(mapped);
    } catch (error) {
      console.error('Failed to load payments', error);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const loadUserCollections = useCallback(async () => {
    try {
      const [
        teachersApprovedResponse,
        studentsApprovedResponse,
        teachersPendingResponse,
        studentsPendingResponse,
      ] = await Promise.all([
        apiRequest('/users/teachers?limit=100&page=1&status=APPROVED'),
        apiRequest('/users/students?limit=100&page=1&status=APPROVED'),
        apiRequest('/users/teachers?limit=100&page=1&status=PENDING'),
        apiRequest('/users/students?limit=100&page=1&status=PENDING'),
      ]);

      const teacherSummary = teachersApprovedResponse?.summary ?? EMPTY_USER_SUMMARY;
      const studentSummary = studentsApprovedResponse?.summary ?? EMPTY_USER_SUMMARY;

      const mappedTeachers = Array.isArray(teachersApprovedResponse?.data)
        ? teachersApprovedResponse.data.map(mapTeacherRecord)
        : [];
      const mappedStudents = Array.isArray(studentsApprovedResponse?.data)
        ? studentsApprovedResponse.data.map(mapStudentRecord)
        : [];

      setTeachers(mappedTeachers);
      setStudents(mappedStudents);
      setTeachersSummary(teacherSummary);
      setStudentsSummary(studentSummary);

      const pendingTeachers = Array.isArray(teachersPendingResponse?.data) ? teachersPendingResponse.data : [];
      const pendingStudents = Array.isArray(studentsPendingResponse?.data) ? studentsPendingResponse.data : [];
      const mappedPending = [...pendingTeachers, ...pendingStudents].map(mapPendingRecord);
      setPendingUsers(mappedPending);

      setSubscriptionUsage((prev) => ({
        ...prev,
        studentCount: studentSummary.approved ?? prev.studentCount,
        teacherCount: teacherSummary.approved ?? prev.teacherCount,
      }));
    } catch (error) {
      console.error('Failed to load user collections', error);
    }
  }, [mapPendingRecord, mapStudentRecord, mapTeacherRecord]);

  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nowIso = new Date().toISOString();
      const overview = await apiRequest('/dashboard/overview');

      if (overview) {
        const overviewTransactions = Array.isArray(overview.zoomCredits?.recentTransactions)
          ? overview.zoomCredits.recentTransactions.map((tx) => ({
              id: tx.id,
              date: tx.timestamp,
              amount: tx.amount,
              type: mapTransactionType(tx.type),
              status: 'Completed',
              transactionId: tx.id,
              className: tx.summary,
            }))
          : [];

        setAcademyData({
          id: overview.academy?.id ?? userId,
          name: overview.academy?.name ?? academyName,
          createdAt: overview.academy?.createdAt ?? overview.academy?.updatedAt ?? nowIso,
          subscription: {
            plan: overview.subscription?.plan ?? 'Professional',
            startDate: overview.academy?.createdAt ?? nowIso,
            endDate: overview.academy?.updatedAt ?? nowIso,
            status: 'active',
          },
        });

        setZoomCredits({
          available: overview.zoomCredits?.balance ?? 0,
          used: overview.zoomCredits?.totalDebited ?? 0,
          totalCredited: overview.zoomCredits?.totalCredited ?? 0,
          history: overviewTransactions,
        });

        setSubscriptionUsage({
          studentLimit: overview.subscription?.limits?.students ?? 0,
          teacherLimit: overview.subscription?.limits?.teachers ?? 0,
          storageLimit: overview.subscription?.limits?.storageGb ?? 0,
          studentCount: overview.subscription?.usage?.students ?? 0,
          teacherCount: overview.subscription?.usage?.teachers ?? 0,
          storageUsed: overview.subscription?.usage?.storageGb ?? 0,
          zoomCreditsLimit: overview.zoomCredits?.totalCredited ?? 0,
          zoomCreditsUsed: overview.zoomCredits?.totalDebited ?? 0,
          recentActivity: Array.isArray(overview.recentActivity)
            ? overview.recentActivity.map((item) => ({
                id: item.id,
                type: item.type,
                message: item.message,
                timestamp: item.timestamp,
              }))
            : [],
        });

        setClassesSummary({
          upcoming: overview.totals?.classes?.upcoming ?? 0,
          ongoing: overview.totals?.classes?.ongoing ?? 0,
          ended: overview.totals?.classes?.completedLast30Days ?? 0,
          cancelled: 0,
        });
      }

      await fetchClasses({ page: 1 });
      await loadUserCollections();
      await Promise.all([loadResources(), loadPayments()]);

      const [zoomSummary, transactionsResponse] = await Promise.all([
        apiRequest(`/zoom-credits/${userId}/summary`).catch(() => null),
        apiRequest(`/zoom-credits/${userId}/transactions?limit=50&page=1`).catch(() => null),
      ]);

      if (zoomSummary) {
        setZoomCredits((prev) => ({
          ...prev,
          available: zoomSummary.balance ?? prev.available,
          used: zoomSummary.totalDebited ?? prev.used,
          totalCredited: zoomSummary.totalCredited ?? prev.totalCredited,
        }));
      }

      if (transactionsResponse?.data) {
        const mappedHistory = Array.isArray(transactionsResponse.data)
          ? transactionsResponse.data.map(mapTransactionRecord)
          : [];
        setZoomCredits((prev) => ({
          ...prev,
          history: mappedHistory,
        }));
      }

      setAcademyData((prev) => ({
        ...prev,
        name: overview?.academy?.name ?? prev.name ?? academyName,
        updatedAt: nowIso,
      }));
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load academy data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [academyName, fetchClasses, loadPayments, loadResources, loadUserCollections, mapTransactionRecord, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const approvePendingUser = useCallback(
    async (userIdToApprove) => {
      const pendingUser = pendingUsers.find((candidate) => candidate.id === userIdToApprove);
      if (!pendingUser) {
        return { success: false, error: 'Pending user not found.' };
      }

      try {
        await apiRequest(`/users/${userIdToApprove}/status`, {
          method: 'PATCH',
          body: { status: 'APPROVED' },
        });

        setPendingUsers((prev) => prev.filter((userRecord) => userRecord.id !== userIdToApprove));
        await loadUserCollections();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to approve user.';
        return { success: false, error: message };
      }
    },
    [loadUserCollections, pendingUsers],
  );
  const rejectPendingUser = useCallback(
    async (userIdToReject, reason) => {
      const pendingUser = pendingUsers.find((candidate) => candidate.id === userIdToReject);
      if (!pendingUser) {
        return { success: false, error: 'Pending user not found.' };
      }

      const trimmedReason = reason?.trim();
      if (!trimmedReason) {
        return { success: false, error: 'Rejection reason is required.' };
      }

      try {
        await apiRequest(`/users/${userIdToReject}/status`, {
          method: 'PATCH',
          body: { status: 'REJECTED', rejectionReason: trimmedReason },
        });

        setPendingUsers((prev) => prev.filter((userRecord) => userRecord.id !== userIdToReject));
        await loadUserCollections();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to reject user.';
        return { success: false, error: message };
      }
    },
    [loadUserCollections, pendingUsers],
  );

  const purchaseCredits = useCallback(
    async ({ amount, planId, currency = 'USD' }) => {
      if (!userId) {
        return { success: false, error: 'Unable to determine current user.' };
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        return { success: false, error: 'Amount must be a positive number.' };
      }

      try {
        const payload = await apiRequest('/zoom-credits/purchase', {
          method: 'POST',
          body: {
            amount: Math.round(amount),
            planId,
            currency,
          },
        });

        if (!payload?.summary || !payload?.transaction) {
          return { success: false, error: 'Unexpected response from server.' };
        }

        const transactionRecord = mapTransactionRecord(payload.transaction);

        setZoomCredits((prev) => ({
          available: payload.summary.balance ?? prev.available,
          used: payload.summary.totalDebited ?? prev.used,
          totalCredited: payload.summary.totalCredited ?? prev.totalCredited,
          history: [transactionRecord, ...(prev.history ?? [])],
        }));

        await loadPayments();

        return { success: true, transaction: transactionRecord };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to purchase credits.';
        return { success: false, error: message };
      }
    },
    [loadPayments, mapTransactionRecord, userId],
  );

  const uploadResource = useCallback(
    async (payload) => {
      try {
        await apiRequest('/resources', {
          method: 'POST',
          body: payload,
        });
        await loadResources();
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to upload resource.';
        return { success: false, error: message };
      }
    },
    [loadResources],
  );

  const updateResource = useCallback(
    async (resourceId, updates) => {
      try {
        await apiRequest(`/resources/${resourceId}`, {
          method: 'PATCH',
          body: updates,
        });
        await loadResources();
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to update resource.';
        return { success: false, error: message };
      }
    },
    [loadResources],
  );

  const deleteResource = useCallback(
    async (resourceId) => {
      try {
        await apiRequest(`/resources/${resourceId}`, {
          method: 'DELETE',
        });
        await loadResources();
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to delete resource.';
        return { success: false, error: message };
      }
    },
    [loadResources],
  );

  return {
    loading,
    error,
    refresh: loadData,
    academyData,
    classes,
    classesMeta,
    classesSummary,
    classesFilters,
    classesLoading,
    loadClasses: fetchClasses,
    zoomCredits,
    subscriptionUsage,
    notifications,
    unreadNotifications,
    pendingUsers,
    teachers,
    students,
    teachersSummary,
    studentsSummary,
    resources,
    resourcesLoading,
    payments,
    paymentsLoading,
    approvePendingUser,
    rejectPendingUser,
    purchaseCredits,
    uploadResource,
    updateResource,
    deleteResource,
    refreshResources: loadResources,
    refreshPayments: loadPayments,
    setNotifications,
    setUnreadNotifications,
  };
};

export default useAcademyData;





























