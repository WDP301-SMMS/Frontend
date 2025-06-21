// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../hooks/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Memoized function to check login status
  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await api.get('/members/profile');
      setIsLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Run on initial load and route changes
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setLoading(false); 
    toast.success('Login successful!');
  };

  const logout = async () => {
    try {
      await api.get('/members/logout');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);