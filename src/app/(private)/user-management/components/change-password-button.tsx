import { Button } from "@/components/ui/button";
import { User } from "@/type/user";
import React from "react";
import CreateUserDialog from "../create-user-dialog";

export const ChangePasswordButton = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        size={"sm"}
        className="text-xs"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Change Password
      </Button>
      <CreateUserDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
      />
    </>
  );
};
