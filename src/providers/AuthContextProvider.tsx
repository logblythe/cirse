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
  username: string | null;
  setUsername: (username: string | null) => void;
}

export const AuthContext = createContext<TAuthContext>({
  user: null,
  setUser: () => {},
  roles: [],
  setRoles: (roles: UserRole[]) => {},
  username: null,
  setUsername: (username: string | null) => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [username, setUsername] = useState<string | null>(null);

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
          setUsername(getCookie("username") ?? null);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, roles, setRoles, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
