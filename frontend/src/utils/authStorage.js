const AUTH_STORAGE_KEY = 'store-rating-auth';

export const getStoredAuth = () => {
  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const auth = JSON.parse(rawValue);
    if (auth?.token && auth?.user && auth.user.role) {
      return auth;
    }
  } catch {
    // Invalid persisted data is not a restorable session.
  }

  clearStoredAuth();
  return null;
};

export const storeAuth = (auth) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
