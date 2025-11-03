const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const ASSET_BASE_URL = (import.meta.env.VITE_ASSET_BASE_URL ?? '').replace(/\/$/, '');

const ACCESS_TOKEN_KEY = 'qedu_access_token';
const REFRESH_TOKEN_KEY = 'qedu_refresh_token';
const USER_KEY = 'qedu_user';

const isBrowser = typeof window !== 'undefined';

export const resolveAssetUrl = (value) => {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalisedValue = value.startsWith('/') ? value : `/${value}`;

  const baseCandidates = [];
  if (ASSET_BASE_URL) {
    baseCandidates.push(ASSET_BASE_URL);
  }

  if (API_BASE_URL) {
    if (/^\/?storage\//i.test(normalisedValue) && /\/api$/i.test(API_BASE_URL)) {
      baseCandidates.push(API_BASE_URL.replace(/\/api$/i, ''));
    } else {
      baseCandidates.push(API_BASE_URL);
    }
  }

  const base = baseCandidates.find(Boolean);
  if (base) {
    return `${base}${normalisedValue}`;
  }

  return normalisedValue;
};

const readStorage = (key) => {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error('Failed to read from localStorage', error);
    return null;
  }
};

const writeStorage = (key, value) => {
  if (!isBrowser) return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Failed to write to localStorage', error);
  }
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response', error);
    return null;
  }
};

const getAccessToken = () => readStorage(ACCESS_TOKEN_KEY);
const getRefreshToken = () => readStorage(REFRESH_TOKEN_KEY);

export const getStoredSession = () => {
  if (!isBrowser) {
    return { accessToken: null, refreshToken: null, user: null };
  }

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const rawUser = readStorage(USER_KEY);

  let user = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch (error) {
      console.warn('Unable to parse cached user data', error);
      user = null;
    }
  }

  return { accessToken, refreshToken, user };
};

export const saveSession = ({ accessToken, refreshToken, user }) => {
  writeStorage(ACCESS_TOKEN_KEY, accessToken ?? null);
  writeStorage(REFRESH_TOKEN_KEY, refreshToken ?? null);
  if (user) {
    writeStorage(USER_KEY, JSON.stringify(user));
  } else {
    writeStorage(USER_KEY, null);
  }
};

export const clearSession = () => {
  writeStorage(ACCESS_TOKEN_KEY, null);
  writeStorage(REFRESH_TOKEN_KEY, null);
  writeStorage(USER_KEY, null);
};

let refreshPromise = null;

export const refreshAuthSession = async (refreshTokenOverride) => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = refreshTokenOverride ?? getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      const payload = await parseJsonSafely(response);

      if (!response.ok) {
        const message = payload?.message ?? 'Failed to refresh session';
        throw new Error(message);
      }

      const data = payload?.data;
      if (!data?.accessToken || !data?.refreshToken || !data?.user) {
        throw new Error('Malformed session payload received from server');
      }

      saveSession(data);
      return data;
    })
    .catch((error) => {
      clearSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    omitAuth = false,
    retry = true,
  } = options;

  const requestHeaders = { ...headers };

  let requestBody = body;
  const isFormData = body instanceof FormData;
  if (!isFormData && body && typeof body === 'object' && !headers['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  if (!omitAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 401 && !omitAuth && retry) {
    try {
      const refreshed = await refreshAuthSession();
      if (refreshed?.accessToken) {
        return apiRequest(path, { ...options, retry: false });
      }
    } catch (error) {
      throw error;
    }
  }

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const message = payload?.message ?? `Request to ${path} failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload?.data ?? null;
};

export const logoutFromServer = async (refreshTokenOverride) => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: refreshTokenOverride ? { refreshToken: refreshTokenOverride } : {},
    });
  } catch (error) {
    // Logging only; logout should proceed even if server request fails
    console.warn('Failed to inform server about logout', error);
  }
  clearSession();
};

export default apiRequest;

