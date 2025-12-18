import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // const token = getCookie("token");
      // if (!token) {
      //   setLoading(false);
      //   return;
      // }
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (user) => {
    setUser(user);
  };

  const register = async (user) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout"); // call backend to clear cookie
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth};
