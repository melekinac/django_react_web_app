import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(tokens) : null;
  });
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  useEffect(() => {
    const updateToken = async () => {
      if (!authTokens) return;

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: authTokens.refresh,
          }
        );
        const data = await response.data;
        setAuthTokens(data);
        setUserInfo(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
      }
    };

    updateToken();
    const interval = setInterval(updateToken, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [authTokens]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        credentials
      );
      const data = response.data;
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUserInfo(jwtDecode(data.access));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
    }
  };

  const logout = () => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUserInfo(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
