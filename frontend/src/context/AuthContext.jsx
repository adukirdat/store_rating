import { createContext, useEffect, useMemo, useState } from 'react';
import { clearStoredAuth, getStoredAuth, storeAuth } from '../utils/authStorage.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, token: null, loading: true });

  const logout = () => {
    clearStoredAuth();
    setAuth({ user: null, token: null, loading: false });
  };

  const login = (session) => {
    const nextAuth = { token: session.token, user: session.user };
    storeAuth(nextAuth);
    setAuth({ ...nextAuth, loading: false });
  };

  useEffect(() => {
    const storedAuth = getStoredAuth();
    setAuth({
      token: storedAuth?.token || null,
      user: storedAuth?.user || null,
      loading: false,
    });

    window.addEventListener('auth:unauthorized', logout);
    return () => window.removeEventListener('auth:unauthorized', logout);
  }, []);

  const value = useMemo(() => ({
    ...auth,
    isAuthenticated: Boolean(auth.token && auth.user),
    login,
    logout,
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
