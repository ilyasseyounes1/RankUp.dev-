import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const displayName = localStorage.getItem('displayName');
    return token ? { token, username, displayName } : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('displayName', data.displayName);
    setAuth({ token: data.token, username: data.username, displayName: data.displayName });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
  };

  return <AuthCtx.Provider value={{ auth, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
