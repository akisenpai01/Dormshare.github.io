import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dormshare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('dormshare_token'));

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('dormshare_user', JSON.stringify(userData));
    localStorage.setItem('dormshare_token', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dormshare_user');
    localStorage.removeItem('dormshare_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, Object: { login, logout } }}>
      {children}
    </AuthContext.Provider>
  );
};
