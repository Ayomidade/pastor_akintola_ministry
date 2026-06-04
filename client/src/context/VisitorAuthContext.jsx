// src/context/VisitorAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { visitorService } from "../services/visitor.service.js";

const VisitorAuthContext = createContext(null);

export function VisitorAuthProvider({ children }) {
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("visitorToken");
    if (token) {
      visitorService
        .getMe()
        .then((res) => setVisitor(res.data.visitor))
        .catch(() => {
          localStorage.removeItem("visitorToken");
          setVisitor(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await visitorService.login(credentials);
    localStorage.setItem("visitorToken", res.data.token);
    setVisitor(res.data.visitor);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("visitorToken");
    setVisitor(null);
  };

  return (
    <VisitorAuthContext.Provider
      value={{ visitor, loading, login, logout, setVisitor }}
    >
      {children}
    </VisitorAuthContext.Provider>
  );
}

export const useVisitorAuth = () => useContext(VisitorAuthContext);
