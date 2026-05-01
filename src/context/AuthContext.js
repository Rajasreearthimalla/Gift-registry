import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'gift-registry-token';
const USER_KEY = 'gift-registry-user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistAuth = (authPayload) => {
    setToken(authPayload.token);
    setUser(authPayload.user);
    localStorage.setItem(TOKEN_KEY, authPayload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authPayload.user));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await userService.getProfile();
        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    persistAuth(response);
    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    persistAuth(response);
    return response;
  };

  const logout = () => {
    clearAuth();
  };

  const updateCurrentUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

