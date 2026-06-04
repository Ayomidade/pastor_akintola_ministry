// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetupDone, setIsSetupDone] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const setupRes = await authService.checkSetup();
        setIsSetupDone(setupRes.data.isSetupDone);
        if (setupRes.data.isSetupDone) {
          const meRes = await authService.getMe();
          setAdmin(meRes.data.admin);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setAdmin(res.data.admin);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isSetupDone,
        login,
        logout,
        setAdmin,
        setIsSetupDone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
