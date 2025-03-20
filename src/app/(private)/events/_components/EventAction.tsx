"use client";

import ApiClient from "@/api-client/";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useEventStore } from "@/store/event-store";
import { EventType } from "@/type/event-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import EventDialog from "./EventDialog";

const apiClient = new ApiClient();

const EventAction = ({ event }: { event: EventType }) => {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { selectedEventId: activeEventId } = useEventStore();

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.deleteEventById(event.id),
    mutationKey: ["event", event.id, "delete"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Your event <b>{event.name}</b> has been deleted
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <div className="flex flex-row space-x-4 items-center">
      <EventDialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(!isOpen);
        }}
      />
      <TooltipWrapper content={"Delete"}>
        <Button
          variant="outline"
          size="icon"
          className="text-red-500"
          disabled={activeEventId === event.id}
          onClick={(e) => {
            e.stopPropagation();
            deleteMutation.mutate();
          }}
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipWrapper>
    </div>
  );
};

export default EventAction;
