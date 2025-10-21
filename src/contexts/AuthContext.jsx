import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiRequest, {
  clearSession,
  getStoredSession,
  logoutFromServer,
  refreshAuthSession,
  saveSession,
} from '../utils/apiClient';

const AuthContext = createContext();

const normalizeRole = (role) => {
  if (!role) return null;
  return role.toLowerCase();
};

const buildUserDetails = (user) => {
  if (!user) return null;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return {
    ...user,
    name: fullName || user.email,
    full_name: fullName || user.email,
  };
};

const mapRegistrationPayload = ({
  email,
  password,
  fullName,
  contactNumber,
  role,
  academyName,
  academyDescription,
  academyId,
}) => {
  const [firstName, ...rest] = (fullName ?? '').trim().split(/\s+/);
  const lastName = rest.length > 0 ? rest.join(' ') : undefined;

  const payload = {
    email,
    password,
    firstName: firstName ?? email,
    lastName,
    phoneNumber: contactNumber,
    role,
  };

  if (academyName) {
    payload.academyName = academyName;
  }
  if (academyDescription) {
    payload.academyDescription = academyDescription;
  }
  if (academyId) {
    payload.academyId = academyId;
  }

  return payload;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [academyMemberships, setAcademyMemberships] = useState([]);
  const [pendingAcademyRequests, setPendingAcademyRequests] = useState([]);
  const [ownerAcademy, setOwnerAcademy] = useState(null);
  const [academyLimits, setAcademyLimits] = useState({ teacher: null, student: null });
  const [loadingAcademies, setLoadingAcademies] = useState(false);

  const setDatabaseInitialized = useCallback((status) => {
    setDbInitialized(Boolean(status));
  }, []);

  const applySession = useCallback((session) => {
    if (!session?.user) {
      setUser(null);
      setUserDetails(null);
      setUserRole(null);
      setIsPending(false);
      return;
    }

    const nextUser = session.user;
    setUser(nextUser);
    setUserDetails(buildUserDetails(nextUser));
    setUserRole(normalizeRole(nextUser.role));
    setIsPending(nextUser.status !== 'APPROVED');
  }, []);

  useEffect(() => {
    let active = true;

    const initialise = async () => {
      try {
        const stored = getStoredSession();
        if (stored.user && active) {
          applySession({ user: stored.user });
        }

        if (stored.refreshToken) {
          try {
            const refreshed = await refreshAuthSession(stored.refreshToken);
            if (active && refreshed) {
              applySession(refreshed);
            }
          } catch (error) {
            console.error('Failed to restore session from refresh token', error);
            clearSession();
            if (active) {
              applySession(null);
            }
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initialise();

    return () => {
      active = false;
    };
  }, [applySession]);

  const loadAcademiesContext = useCallback(async () => {
    if (!user?.id || user?.status !== 'APPROVED') {
      setAcademyMemberships([]);
      setPendingAcademyRequests([]);
      setOwnerAcademy(null);
      return { success: true, memberships: [] };
    }

    setLoadingAcademies(true);
    try {
      const approvedMembershipPromise = apiRequest(
        '/academies/memberships?limit=100&page=1&status=APPROVED',
      ).catch(() => null);
      const pendingMembershipPromise = apiRequest(
        '/academies/memberships?limit=100&page=1&status=PENDING',
      ).catch(() => null);
      const ownerPromise =
        userRole === 'academy_owner'
          ? apiRequest('/academies/owner').catch(() => null)
          : Promise.resolve(null);
      const platformSettingsPromise = apiRequest('/platform-settings').catch(() => null);

      const [approvedMemberships, pendingMemberships, ownerDetails, platformSettings] =
        await Promise.all([
          approvedMembershipPromise,
          pendingMembershipPromise,
          ownerPromise,
          platformSettingsPromise,
        ]);

      const approvedList = Array.isArray(approvedMemberships?.data)
        ? approvedMemberships.data
        : [];
      const pendingList = Array.isArray(pendingMemberships?.data)
        ? pendingMemberships.data
        : [];

      setAcademyMemberships(approvedList);
      setPendingAcademyRequests(pendingList);
      setOwnerAcademy(ownerDetails ?? null);
      if (platformSettings) {
        setAcademyLimits({
          teacher: platformSettings.maxAcademiesPerTeacher ?? null,
          student: platformSettings.maxAcademiesPerStudent ?? null,
        });
      }

      return { success: true, memberships: approvedList };
    } catch (error) {
      console.error('Failed to load academy context', error);
      setAcademyMemberships([]);
      setPendingAcademyRequests([]);
      setOwnerAcademy(null);
      return { success: false, error };
    } finally {
      setLoadingAcademies(false);
    }
  }, [user?.id, user?.status, userRole]);

  useEffect(() => {
    if (!user?.id || user?.status !== 'APPROVED') {
      setAcademyMemberships([]);
      setPendingAcademyRequests([]);
      setOwnerAcademy(null);
      return;
    }
    loadAcademiesContext();
  }, [loadAcademiesContext, user?.id, user?.status, userRole]);

  const signIn = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: { email, password },
          omitAuth: true,
          retry: false,
        });

        if (data?.accessToken && data?.refreshToken && data?.user) {
          saveSession(data);
          applySession(data);
          setLoading(false);
          return { data, error: null };
        }

        throw new Error('Unexpected login response format');
      } catch (error) {
        console.error('login failed', error);
        setLoading(false);
        return { data: null, error };
      }
    },
    [applySession],
  );

  const registerViaAuth = useCallback(async (payload) => {
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: payload,
        omitAuth: true,
        retry: false,
      });
      return { success: true };
    } catch (error) {
      console.error('registration failed', error);
      return { success: false, error };
    }
  }, []);

  const registerAcademyOwner = useCallback(
    async (email, password, fullName, academyName, contactNumber, academyDescription) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'ACADEMY_OWNER',
        academyName,
        academyDescription,
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const registerTeacher = useCallback(
    async (email, password, fullName, academyId, _specialization, _experience, contactNumber) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'TEACHER',
        academyId,
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const registerStudent = useCallback(
    async (email, password, fullName, academyId, contactNumber, _gradeLevel, _age, _guardianContact) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'STUDENT',
        academyId,
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const verifyRegistrationOtp = useCallback(async (email, otp) => {
    try {
      const data = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: { email, otp },
        omitAuth: true,
        retry: false,
      });
      return { success: true, message: data?.message };
    } catch (error) {
      console.error('verifyRegistrationOtp failed', error);
      return { success: false, error };
    }
  }, []);

  const resendRegistrationOtp = useCallback(async (email) => {
    try {
      const data = await apiRequest('/auth/resend-otp', {
        method: 'POST',
        body: { email },
        omitAuth: true,
        retry: false,
      });
      return { success: true, message: data?.message };
    } catch (error) {
      console.error('resendRegistrationOtp failed', error);
      return { success: false, error };
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const latest = await apiRequest(`/users/${user.id}`);
      const session = { user: latest };
      saveSession({ ...getStoredSession(), user: latest });
      applySession(session);
      await loadAcademiesContext();
      return latest;
    } catch (error) {
      console.error('Failed to fetch user details', error);
      return null;
    }
  }, [applySession, loadAcademiesContext, user?.id]);

  const fetchAcademies = useCallback(async ({ search = '', page = 1, limit = 20 } = {}) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) {
        params.append('search', search.trim());
      }
      const response = await apiRequest(`/academies?${params.toString()}`);
      return {
        success: true,
        data: Array.isArray(response?.data) ? response.data : [],
        meta: response?.meta ?? null,
      };
    } catch (error) {
      console.error('fetchAcademies failed', error);
      return { success: false, error };
    }
  }, []);

  const requestAcademyMembership = useCallback(
    async (academyId) => {
      if (!academyId) {
        return { success: false, error: 'Academy identifier is required.' };
      }

      try {
        const result = await apiRequest('/academies/memberships', {
          method: 'POST',
          body: { academyId },
        });
        await loadAcademiesContext();
        return { success: true, data: result };
      } catch (error) {
        console.error('requestAcademyMembership failed', error);
        return { success: false, error };
      }
    },
    [loadAcademiesContext],
  );

  const signOut = useCallback(async () => {
    try {
      const { refreshToken } = getStoredSession();
      await logoutFromServer(refreshToken ?? undefined);
    } finally {
      applySession(null);
      setAcademyMemberships([]);
      setPendingAcademyRequests([]);
      setOwnerAcademy(null);
      setAcademyLimits({ teacher: null, student: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [applySession]);

  const value = {
    user,
    userDetails,
    userRole,
    loading,
    isPending,
    dbInitialized,
    setDatabaseInitialized,
    academyMemberships,
    pendingAcademyRequests,
    ownerAcademy,
    academyLimits,
    loadingAcademies,
    refreshAcademyContext: loadAcademiesContext,
    registerAcademyOwner,
    registerTeacher,
    registerStudent,
    verifyRegistrationOtp,
    resendRegistrationOtp,
    fetchAcademies,
    requestAcademyMembership,
    fetchUserDetails,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
