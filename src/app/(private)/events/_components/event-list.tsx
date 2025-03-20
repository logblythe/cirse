"use client";

import ApiClient from "@/api-client/";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event-store";
import { EventType } from "@/type/event-type";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventDialog from "./EventDialog";
import { columns } from "./columns";

const apiClient = new ApiClient();

const EventsList = () => {
  const router = useRouter();

  const { selectedEventId, selectEvent } = useEventStore();
  const [isOpen, setIsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const { data = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.getEvents(),
  });

  useEffect(() => {
    if (data.length === 0) return;
    const index = data?.findIndex(
      (event) => event.id === selectedEventId
    ) as number;
    setRowSelection({ [index]: true });
  }, [data, selectedEventId]);

  const handleRowClick = (event: EventType) => {
    selectEvent(event);
    router.push(`/portals?eventId=${event.id}`);
  };

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <div className="flex flex-row space-x-4 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>All Events</span>
          </h3>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        </div>
        <Button
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Import
        </Button>
        <EventDialog
          open={isOpen}
          onOpenChange={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default EventsList;
