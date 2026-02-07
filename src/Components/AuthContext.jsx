import React, { createContext, useRef, useState, useEffect } from "react";
import axios from "./axios";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [credentials, setCredentials] = useState(
    JSON.parse(sessionStorage.getItem("cooperative-details"))
  );
  const [sidebarState, setSidebarState] = useState(sessionStorage.getItem("sidebarState"));
  
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const activityTimeoutRef = useRef(null);

  const callEndpoint = async () => {
    const currentCredentials = JSON.parse(sessionStorage.getItem("cooperative-details"));
    if (!currentCredentials?.refreshToken || !currentCredentials?.logInfo?.nodeId) {
      clearRefreshLogic();
      return;
    }

    try {
      const payload = {
        refreshToken: currentCredentials.refreshToken,
        nodeId: currentCredentials.logInfo.nodeId,
      };

      const resp = await axios.post("Account/refresh-token", payload);
      const newCredentials = resp.data;

      sessionStorage.setItem("cooperative-details", JSON.stringify(newCredentials));
      setCredentials(newCredentials);
    } catch (error) {
      if (error.response?.status === 401) {
        setCredentials(null);
        sessionStorage.removeItem("cooperative-details");
        navigate('/cooperative-signin');
        clearRefreshLogic();
      }
      console.error("Token refresh failed:", error);
    }
  };

  const clearRefreshLogic = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    intervalRef.current = null;
    activityTimeoutRef.current = null;
  };

  const resetActivityTimeout = () => {
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      callEndpoint();
    }, 5 * 60 * 1000); // 5 minutes after activity
  };

  const handleReconnect = () => {
    console.log("Network reconnected. Attempting token refresh...");
    callEndpoint();
  };

  useEffect(() => {
    if (credentials?.token && credentials?.refreshToken) {
      callEndpoint(); // immediate refresh
      intervalRef.current = setInterval(callEndpoint, 7 * 60 * 1000); // periodic refresh

      // Activity detection
      window.addEventListener("mousemove", resetActivityTimeout);
      window.addEventListener("keydown", resetActivityTimeout);
      window.addEventListener("scroll", resetActivityTimeout);

      // Network reconnect
      window.addEventListener("online", handleReconnect);

      resetActivityTimeout();
    }

    return () => {
      clearRefreshLogic();
      window.removeEventListener("mousemove", resetActivityTimeout);
      window.removeEventListener("keydown", resetActivityTimeout);
      window.removeEventListener("scroll", resetActivityTimeout);
      window.removeEventListener("online", handleReconnect);
    };
  }, [credentials?.token]);

  return (
    <UserContext.Provider value={{ credentials, setCredentials, setSidebarState, sidebarState }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthContext;
