"use client";

import ApiClient from "@/api-client/";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { EventType } from "@/type/event-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const apiClient = new ApiClient();

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
};

export default function EventDialog(props: DialogProps) {
  const { open, onOpenChange } = props;

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const importEventMutation = useMutation({
    mutationFn: ({ event }: { event: EventType }) =>
      apiClient.importEvent(event),
    onMutate: (variables) => {
      return variables.event.id;
    },
    onError: (error) => {
      showErrorToast(error.message);
    },
    onSuccess: () => {
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["all-events"] });
    },
  });

  const importedEventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.getEvents(),
  });

  const allEventsQuery = useQuery({
    queryKey: ["all-events"],
    queryFn: () => apiClient.getAllEvents(),
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  const importedEventIds = importedEventsQuery.data?.map(({ id }) => id) ?? [];

  const eventsEligibleForImport = allEventsQuery.data?.filter(
    (event) => !importedEventIds.includes(event.id)
  );

  const isMutating = (id: string) => {
    return (
      importEventMutation.isPending &&
      importEventMutation.variables.event.id === id
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-2/3 flex flex-col"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <DialogTitle>Import Event</DialogTitle>
          <DialogDescription>
            Choose the event you would like to import.
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md flex-1 ">
          <CommandInput placeholder="Search..." />
          <CommandList className=" h-full min-h-full">
            {allEventsQuery.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin center mt-4 ml-4" />
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {eventsEligibleForImport?.map((event) => (
              <CommandItem key={event.id} value={event.name}>
                <div className="flex flex-row w-full items-center">
                  <p className="flex flex-1">{event.name}</p>
                  <Button
                    disabled={importEventMutation.isPending}
                    variant={"outline"}
                    onClick={() => {
                      importEventMutation.mutate({ event });
                    }}
                  >
                    {isMutating(event.id) ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Select
                  </Button>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
