import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function fetchMe() {
      try {
        if (!token) return;
        const { data } = await API.get("/auth/me");
        setUser(data);
      } catch {
        // invalid token
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  const login = (tkn, usr) => {
    localStorage.setItem("token", tkn);
    setToken(tkn);
    setUser(usr || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
