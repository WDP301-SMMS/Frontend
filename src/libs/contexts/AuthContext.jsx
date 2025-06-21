// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../hooks/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Memoized function to check login status
  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await api.get('/user/me');
      setUser(response.data.data);
      setRole(response.data.data.role);
      setIsLoggedIn(true);
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on initial load and route changes
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  const login = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token.accessToken);
    checkLoginStatus();
    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setRole(null);
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);