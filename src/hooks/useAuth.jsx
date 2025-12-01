import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Token loader (safe)
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken && savedToken !== "undefined" ? savedToken : null;
  });

  // User loader (SUPER SAFE)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    if (!saved || saved === "undefined") return null;

    try {
      return JSON.parse(saved);
    } catch {
      console.warn("Invalid user JSON detected in localStorage. Resetting.");
      localStorage.removeItem("user");
      return null;
    }
  });

  // Attach token to axios globally
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // LOGIN
  const onLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "https://ca2-med-api.vercel.app/login",
        { email, password }
      );

      console.log("LOGIN SUCCESS:", response.data);

      const token = response.data.token;
      const user = response.data.user || null; // prevent undefined

      setToken(token);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return null;

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      return err.response?.data;
    }
  };

  // LOGOUT
  const onLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
