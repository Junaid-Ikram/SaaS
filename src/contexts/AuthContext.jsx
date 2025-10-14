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

const mapRegistrationPayload = ({ email, password, fullName, contactNumber, role }) => {
  const [firstName, ...rest] = (fullName ?? '').trim().split(/\s+/);
  const lastName = rest.length > 0 ? rest.join(' ') : undefined;

  return {
    email,
    password,
    firstName: firstName ?? email,
    lastName,
    phoneNumber: contactNumber,
    role,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

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
    async (email, password, fullName, _academyName, contactNumber, _academyAddress) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'ACADEMY_OWNER',
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const registerTeacher = useCallback(
    async (email, password, fullName, _academyId, _specialization, _experience, contactNumber) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'TEACHER',
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const registerStudent = useCallback(
    async (email, password, fullName, _academyId, contactNumber, _gradeLevel, _age, _guardianContact) => {
      const payload = mapRegistrationPayload({
        email,
        password,
        fullName,
        contactNumber,
        role: 'STUDENT',
      });
      return registerViaAuth(payload);
    },
    [registerViaAuth],
  );

  const fetchUserDetails = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const latest = await apiRequest(`/users/${user.id}`);
      const session = { user: latest };
      saveSession({ ...getStoredSession(), user: latest });
      applySession(session);
      return latest;
    } catch (error) {
      console.error('Failed to fetch user details', error);
      return null;
    }
  }, [applySession, user?.id]);

  const fetchAcademies = useCallback(async () => {
    console.warn('fetchAcademies is not yet implemented against the backend');
    return { success: false, error: 'Academy directory not available yet.' };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { refreshToken } = getStoredSession();
      await logoutFromServer(refreshToken ?? undefined);
    } finally {
      applySession(null);
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
    registerAcademyOwner,
    registerTeacher,
    registerStudent,
    fetchAcademies,
    fetchUserDetails,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
