import { useCallback, useEffect, useMemo, useState } from 'react';
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

const safeLocaleDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
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

const mapTransactionRecord = (record) => ({
  id: record.id,
  date: record.createdAt,
  amount: record.amount,
  type: mapTransactionType(record.type),
  status: 'Completed',
  transactionId: record.id,
  className: record.metadata?.classTitle ?? record.reason ?? 'N/A',
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
  const [resources, setResources] = useState([]);
  const [payments, setPayments] = useState([]);

  const userId = user?.id ?? null;
  const academyName = useMemo(() => {
    if (!user) return 'Your Academy';
    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    return name ? `${name}'s Academy` : 'Your Academy';
  }, [user]);

  const mapTeacherRecord = useCallback(
    (teacher, classesByTeacher) => ({
      id: teacher.id,
      name: buildDisplayName(teacher),
      email: teacher.email,
      role: normaliseRole(teacher.role),
      status: teacher.status,
      joinDate: safeLocaleDate(teacher.createdAt),
      classes: classesByTeacher[teacher.id] ?? 0,
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
      enrolledClasses: student.metadata?.enrolledClasses ?? 0,
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

  const buildRecentActivity = useCallback((mappedClasses, mappedPending) => {
    const classActivity = mappedClasses.slice(0, 3).map((cls) => ({
      type: 'class',
      description: `Scheduled "${cls.title}"`,
      date: safeLocaleDate(cls.date),
    }));

    const pendingActivity = mappedPending.slice(0, 2).map((userRecord) => ({
      type: 'user',
      description: `New ${userRecord.role === 'teacher' ? 'teacher' : 'student'} application from ${userRecord.name}`,
      date: userRecord.requestDate,
    }));

    return [...classActivity, ...pendingActivity];
  }, []);

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

        if (Array.isArray(overview.upcomingClasses) && overview.upcomingClasses.length > 0) {
          setClasses(overview.upcomingClasses.map(mapClassRecord));
        }

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
      }

      const [
        classesResponse,
        teachersApprovedResponse,
        studentsApprovedResponse,
        teachersPendingResponse,
        studentsPendingResponse,
        zoomSummary,
        transactionsResponse,
      ] = await Promise.all([
        apiRequest('/classes?limit=100&page=1'),
        apiRequest('/users/teachers?limit=100&page=1&status=APPROVED'),
        apiRequest('/users/students?limit=100&page=1&status=APPROVED'),
        apiRequest('/users/teachers?limit=100&page=1&status=PENDING'),
        apiRequest('/users/students?limit=100&page=1&status=PENDING'),
        apiRequest(`/zoom-credits/${userId}/summary`).catch(() => null),
        apiRequest(`/zoom-credits/${userId}/transactions?limit=50&page=1`).catch(() => null),
      ]);

      const rawClasses = Array.isArray(classesResponse?.data) ? classesResponse.data : [];
      const mappedClasses = rawClasses.map(mapClassRecord);
      setClasses(mappedClasses);

      const classesByTeacher = mappedClasses.reduce((acc, item) => {
        if (item.teacherId) {
          acc[item.teacherId] = (acc[item.teacherId] ?? 0) + 1;
        }
        return acc;
      }, {});

      const rawTeachers = Array.isArray(teachersApprovedResponse?.data) ? teachersApprovedResponse.data : [];
      const mappedTeachers = rawTeachers.map((teacher) => mapTeacherRecord(teacher, classesByTeacher));
      setTeachers(mappedTeachers);

      const rawStudents = Array.isArray(studentsApprovedResponse?.data) ? studentsApprovedResponse.data : [];
      const mappedStudents = rawStudents.map(mapStudentRecord);
      setStudents(mappedStudents);

      const pendingTeacherRecords = Array.isArray(teachersPendingResponse?.data) ? teachersPendingResponse.data : [];
      const pendingStudentRecords = Array.isArray(studentsPendingResponse?.data) ? studentsPendingResponse.data : [];
      const rawPending = [...pendingTeacherRecords, ...pendingStudentRecords];
      const mappedPending = rawPending.map(mapPendingRecord);
      setPendingUsers(mappedPending);

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

      setSubscriptionUsage((prev) => ({
        studentLimit: prev.studentLimit || overview?.subscription?.limits?.students || 0,
        teacherLimit: prev.teacherLimit || overview?.subscription?.limits?.teachers || 0,
        storageLimit: prev.storageLimit || overview?.subscription?.limits?.storageGb || 0,
        studentCount: mappedStudents.length,
        teacherCount: mappedTeachers.length,
        storageUsed:
          prev.storageLimit > 0
            ? Math.min(prev.storageLimit, mappedStudents.length * 0.5)
            : Math.min(overview?.subscription?.limits?.storageGb ?? 0, mappedStudents.length * 0.5),
        zoomCreditsLimit: overview?.zoomCredits?.totalCredited ?? zoomSummary?.totalCredited ?? prev.zoomCreditsLimit,
        zoomCreditsUsed: overview?.zoomCredits?.totalDebited ?? zoomSummary?.totalDebited ?? prev.zoomCreditsUsed,
        recentActivity:
          prev.recentActivity.length > 0 ? prev.recentActivity : buildRecentActivity(mappedClasses, mappedPending),
      }));

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
  }, [academyName, buildRecentActivity, mapPendingRecord, mapStudentRecord, mapTeacherRecord, userId]);

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
        const updatedUser = await apiRequest(`/users/${userIdToApprove}/status`, {
          method: 'PATCH',
          body: { status: 'APPROVED' },
        });

        setPendingUsers((prev) => prev.filter((userRecord) => userRecord.id !== userIdToApprove));

        if (normaliseRole(updatedUser.role) === 'teacher') {
          setTeachers((prev) => [
            ...prev,
            mapTeacherRecord(updatedUser, classes.reduce((acc, cls) => {
              if (cls.teacherId) {
                acc[cls.teacherId] = (acc[cls.teacherId] ?? 0) + 1;
              }
              return acc;
            }, {})),
          ]);
          setSubscriptionUsage((prev) => ({
            ...prev,
            teacherCount: prev.teacherCount + 1,
          }));
        } else {
          setStudents((prev) => [...prev, mapStudentRecord(updatedUser)]);
          setSubscriptionUsage((prev) => ({
            ...prev,
            studentCount: prev.studentCount + 1,
          }));
        }

        return { success: true, user: updatedUser };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to approve user.';
        return { success: false, error: message };
      }
    },
    [classes, mapStudentRecord, mapTeacherRecord, pendingUsers],
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
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to reject user.';
        return { success: false, error: message };
      }
    },
    [pendingUsers],
  );

  const purchaseCredits = useCallback(
    async (amount) => {
      if (!userId) {
        return { success: false, error: 'Unable to determine current user.' };
      }

      try {
        await apiRequest('/zoom-credits/transactions', {
          method: 'POST',
          body: {
            userId,
            operation: 'credit',
            amount,
            reason: 'Manual credit purchase from dashboard',
          },
        });

        await loadData();
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to purchase credits.';
        return { success: false, error: message };
      }
    },
    [loadData, userId],
  );

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
    approvePendingUser,
    rejectPendingUser,
    purchaseCredits,
    setNotifications,
    setUnreadNotifications,
  };
};

export default useAcademyData;























