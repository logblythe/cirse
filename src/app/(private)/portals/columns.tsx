"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Portal } from "@/type/portal";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Portal>[] = [
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
    header: "Portal Id",
  },
  {
    accessorKey: "name",
    header: "Portal Name",
  },
];
