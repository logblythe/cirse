import ApiClient from "@/api-client";
import { AuthContext } from "@/providers/AuthContextProvider";
import { AuthUser } from "@/type/auth";
import { useContext } from "react";
import useCookie from "./useCookie";

const apiClient = new ApiClient();

export const useUser = () => {
  const { user, setUser, roles, setRoles } = useContext(AuthContext);
  const { setCookie, removeCookie } = useCookie();

  const addUser = async (user: AuthUser) => {
    setUser(user);
    setCookie("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    const myDetails = await apiClient.getMe();
    setRoles(myDetails.roles);
    setCookie("roles", JSON.stringify(myDetails.roles));
    localStorage.setItem("roles", JSON.stringify(myDetails.roles));
  };

  const removeUser = () => {
    setUser(null);
    removeCookie("user");
    localStorage.removeItem("user");
    localStorage.removeItem;
  };

  return { user, addUser, removeUser, roles };
};
