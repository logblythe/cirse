import { AuthContext } from "@/providers/AuthContextProvider";
import { AuthUser } from "@/type/auth";
import { useContext } from "react";
import useCookie from "./useCookie";

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setCookie, removeCookie } = useCookie();

  const addUser = (user: AuthUser) => {
    setUser(user);
    setCookie("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    removeCookie("user");
    localStorage.removeItem("user");
  };

  return { user, addUser, removeUser };
};
