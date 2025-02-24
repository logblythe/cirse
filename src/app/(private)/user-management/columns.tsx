"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/type/user";
import { ColumnDef } from "@tanstack/react-table";
import UserAction from "./components/user-action";
import { UserToggleSwitch } from "./components/user-toggle-switch";

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
      return <UserToggleSwitch user={row.original} />;
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
