"use client";

import { User } from "@/type/user";
import { ChangePasswordButton } from "./change-password-button";
import { DeleteUserButton } from "./delete-user-button";

const UserAction = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row space-x-4 items-center">
      <DeleteUserButton user={user} />
      <ChangePasswordButton user={user} />
    </div>
  );
};

export default UserAction;
