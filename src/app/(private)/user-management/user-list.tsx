"use client";

import ApiClient from "@/api-client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import React from "react";
import { columns } from "./columns";
import CreateUserDialog from "./create-user-dialog";

const apiClient = new ApiClient();

const UserList = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const usersQuery = useQuery({
    queryKey: ["users", "admin"],
    queryFn: () => apiClient.getUsers({ page: 0, size: 10 }),
  });

  const users = usersQuery.data?.data ?? [];

  return (
    <>
      <div className="container mx-auto py-10 space-y-2">
        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-row space-x-4 items-center">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              <span>All Users</span>
            </h3>
            {usersQuery.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={users} />
      </div>
      <CreateUserDialog open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default UserList;
