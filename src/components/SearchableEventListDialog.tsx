import { default as ApiClient } from "@/api-client";
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
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const apiClient = new ApiClient();

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: ({
    eventId,
    eventName,
  }: {
    eventId: string;
    eventName: string;
  }) => void;
  selectedEventId: string;
  isMutating: boolean;
};

export default function SearchableEventListDialog({
  isOpen,
  onClose,
  selectedEventId,
  onEventSelect,
  isMutating,
}: DialogProps) {
  const swoogoEventsQuery = useQuery({
    queryKey: ["events/swoogo"],
    queryFn: () => apiClient.getSwoogoEvents(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-1/3 flex flex-col">
        <DialogHeader>
          <DialogTitle>Copy rule</DialogTitle>
          <DialogDescription>
            Choose the event where you would like to apply the selected rule.
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md flex-1">
          <CommandInput placeholder="Search..." />
          <CommandList>
            {swoogoEventsQuery.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin center mt-4 ml-4" />
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {swoogoEventsQuery.data?.map((item) => (
              <CommandItem key={item.eventId} value={item.eventName}>
                <div className="flex flex-row w-full items-center">
                  <p className="flex flex-1">{item.eventName}</p>
                  <Button
                    disabled={Boolean(selectedEventId === item.eventId)}
                    variant={"outline"}
                    onClick={() => onEventSelect(item)}
                  >
                    {item.eventId === selectedEventId && isMutating ? (
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
