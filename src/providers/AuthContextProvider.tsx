"use client";

import useCookie from "@/hooks/useCookie";
import { AuthUser } from "@/type/auth";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface TAuthContext {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<TAuthContext>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const { getCookie } = useCookie();

  useEffect(() => {
    if (!user) {
      let existingUser = null;
      const getFromCookie = async () => (existingUser = getCookie("user"));
      getFromCookie();
      if (existingUser) {
        try {
          setUser(JSON.parse(existingUser));
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
