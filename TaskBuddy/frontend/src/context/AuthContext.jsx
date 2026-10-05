import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY } from '../services/api.js';
import * as authService from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // While a saved token is being verified we don't know yet if the user is logged in.
  const [initializing, setInitializing] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // On first load: if a token is stored, ask the backend who it belongs to.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setInitializing(false);
      return undefined;
    }

    let cancelled = false;
    authService
      .getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch((err) => {
        // Only discard the token if the server rejected it (not on a network failure).
        if (err.response?.status === 401) localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The Axios interceptor fires this event when the server returns 401 for a stored token.
  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.loginUser(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (details) => {
    const data = await authService.registerUser(details);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
