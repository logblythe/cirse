"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import GroupAction from "./group-action";

export const columns: ColumnDef<any>[] = [
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
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      return <GroupAction />;
    },
  },
];
