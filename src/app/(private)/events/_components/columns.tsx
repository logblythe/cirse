"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { EventType } from "@/type/event-type";
import { ColumnDef } from "@tanstack/react-table";
import EventAction from "./EventAction";

export const columns: ColumnDef<EventType>[] = [
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
    header: "Event Id",
  },
  {
    accessorKey: "name",
    header: "Event Name",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      return <EventAction event={event} />;
    },
  },
];
