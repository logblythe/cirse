"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { User } from "@/type/user";
import { ColumnDef } from "@tanstack/react-table";
import UserAction from "./user-action";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    cell: ({ row }) =>
      row.getIsSelected() ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null,
  },
  {
    accessorKey: "id",
    header: "User Id",
  },
  {
    accessorKey: "email",
    header: "Username",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Switch disabled checked={row.original.enabled} />
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      return row.original.roles?.join(", ");
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <UserAction user={row.original} />;
    },
  },
];
