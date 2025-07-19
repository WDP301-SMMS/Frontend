import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../hooks/axiosInstance";
import { decodeToken, isTokenExpired } from "~/libs/utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      logout();
    } else {
      const decoded = decodeToken(token);
      setUser(decoded);
      setRole(decoded.role);
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  const login = (token) => {
    setLoading(true);
    localStorage.setItem("token", token);

    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
      setRole(decoded.role);
      setIsLoggedIn(true);

      switch (decoded.role) {
        case "Parent":
          navigate("/health-profiles");
          break;
        case "Nurse":
          navigate("/management/nurse");
          break;
        case "Admin":
          navigate("/management/admin");
          break;
        case "Manager":
          navigate("/management/manager");
          break;
        default:
          navigate("/");
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setRole(null);
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setRole(null);
      setIsLoggedIn(false);
      setLoading(false);
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