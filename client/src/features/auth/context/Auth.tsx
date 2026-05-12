import { createContext, useContext, useState } from "react";
import { login } from "../api/user.api";
import type { User } from "../models/User";

const AuthContext = createContext<{
  user: Omit<User, "name"> | null;
  Login: (email: string, password: string) => Promise<void>;
  Logout: () => void;
} | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userLog = JSON.parse(localStorage.getItem("user") || "{}") || null;
  const [user, setUser] = useState<Omit<User, "name"> | null>(userLog);

  const Login = async (email: string, password: string) => {
    const token = await login(email, password);
    localStorage.setItem("auth", JSON.stringify({ ...token }));
    localStorage.setItem("user", JSON.stringify({ email: email }));
    setUser({ email, ...token });
  };

  const Logout = () => {
    setUser(null);
    return localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
