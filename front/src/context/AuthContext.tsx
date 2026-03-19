import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1️⃣ Initialize from localStorage (important)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // 2️⃣ Optional safety sync (handles edge cases)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token, // 🔑 important for protected routes
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
