import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
    localStorage.setItem("token", data.token);
    setUser({ token: data.token });
  };

  const register = async (userData) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);