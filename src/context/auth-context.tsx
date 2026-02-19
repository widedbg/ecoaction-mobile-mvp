import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";

import { loginApi, signupApi } from "@/src/api/auth-api";
import type { AuthUser } from "@/src/types/models";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const authUser = await loginApi(email, password);
        setUser(authUser);
      },
      signup: async (username, email, password) => {
        const authUser = await signupApi(username, email, password);
        setUser(authUser);
      },
      logout: async () => {
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
