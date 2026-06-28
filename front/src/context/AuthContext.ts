import { createContext } from "react";

export type User = {
  [x: string]: any;
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "LAWYER" | "CLERK";
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);