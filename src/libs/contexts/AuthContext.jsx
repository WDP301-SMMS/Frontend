import React, { createContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../hooks/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await api.get("/user/me");
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

  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname, checkLoginStatus]);

  const login = async (token) => {
    setLoading(true);
    localStorage.setItem("token", token);

    try {
      const response = await api.get("/user/me");
      const userData = response.data.data;
      setUser(userData);
      setRole(userData.role);
      setIsLoggedIn(true);

      switch (userData.role) {
        case "Parent":
          navigate("/");
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
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
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
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, role, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
