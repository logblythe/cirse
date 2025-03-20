"use client";

import useCookie from "@/hooks/useCookie";
import { AuthUser } from "@/type/auth";
import { UserRole } from "@/type/user";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface TAuthContext {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  roles: UserRole[];
  setRoles(roles: UserRole[]): void;
}

export const AuthContext = createContext<TAuthContext>({
  user: null,
  setUser: () => {},
  roles: [],
  setRoles: (roles: UserRole[]) => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);

  const { getCookie } = useCookie();

  useEffect(() => {
    if (!user) {
      let existingUser = null;
      const getFromCookie = async () => (existingUser = getCookie("user"));
      getFromCookie();
      if (existingUser) {
        try {
          setUser(JSON.parse(existingUser));
          setRoles(JSON.parse(getCookie("roles") ?? ""));
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, roles, setRoles }}>
      {children}
    </AuthContext.Provider>
  );
};
