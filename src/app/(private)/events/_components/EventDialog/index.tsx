"use client";

import ApiClient from "@/api-client/";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { useEventStore } from "@/store/event-store";
import { EventType } from "@/type/event-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const apiClient = new ApiClient();

type DialogProps = {
  event?: EventType;
  open: boolean;
  onOpenChange: () => void;
};

enum DialogStep {
  EventImport,
  EventSelection,
  RuleSelection,
}

const FormSchema = z.object({
  items: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    })
    .optional(),
});

export default function EventDialog(props: DialogProps) {
  const { open, onOpenChange, event } = props;

  const { selectedEventId: activeEventId } = useEventStore();

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const swoogoEventsMutation = useMutation({
    mutationFn: ({
      payload,
      method,
    }: {
      payload: any;
      method: "PUT" | "POST";
    }) => apiClient.saveEvent(payload, method),
    onError: (error) => {
      showErrorToast(error.message);
    },
    onSuccess: () => {
      onOpenChange();
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-2/3 flex flex-col"
        onClick={handleModalClick}
      >
        Dialog Content
      </DialogContent>
    </Dialog>
  );
}
