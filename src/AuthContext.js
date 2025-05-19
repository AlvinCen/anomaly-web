import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "./axiosInstance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Login
  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.accessToken);
      setCurrentUser(response.data.user);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // 🟢 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 🟢 Refresh Token
  const refreshAccessToken = async () => {
    try {
      const response = await api.post("/auth/refresh");
      localStorage.setItem("token", response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      logout();
      throw new Error("Session expired");
    }
  };

  // 🟢 Axios Interceptor untuk Auto Refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/protected/dashboard")
        .then((response) => {
          console.log(response)
          setCurrentUser(response.data.user)
        })
        .catch(() => logout()); // Hapus token jika tidak valid
    }

    // Setup Axios Interceptor untuk Auto Refresh
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshAccessToken();
            error.config.headers["Authorization"] = `Bearer ${newToken}`;
            return api.request(error.config);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    setLoading(false);

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
