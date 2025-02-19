"use client";

import ApiClient from "@/api-client/";
import { ControlledSelect } from "@/components/ControlledSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  templateId: z.string().min(1, "Required"),
});

const apiClient = new ApiClient();

type DialogProps = {
  open: boolean;
  onClose: () => void;
  selectedEventId: string;
};

export default function AddPortalTemplateDialog(props: DialogProps) {
  const { open, onClose, selectedEventId } = props;

  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();

  const portalTemplatesQuery = useQuery({
    queryKey: ["portal-templates"],
    queryFn: () => apiClient.getPortalTemplates(),
  });

  const portalTemplates = portalTemplatesQuery.data;

  const addPortalToEventMutation = useMutation({
    mutationFn: ({ data }: { data: z.infer<typeof formSchema> }) =>
      apiClient.addPortalToEvent(selectedEventId, data.templateId),
    onError: (error) => {
      showErrorToast();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", selectedEventId, "portals"],
      });
      onClose();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    form.reset({
      templateId: "",
    });
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{"Add portal to event selected event"}</DialogTitle>
          <DialogDescription>
            To add portal, please select the template and save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit((data) => {
              addPortalToEventMutation.mutate({ data });
            })}
          >
            <ControlledSelect
              name="templateId"
              label="Templates"
              placeholder="Select template"
              items={
                portalTemplates?.map((template) => ({
                  name: template.name,
                  id: template.id,
                })) ?? []
              }
            />
            <div className="pt-4">
              <Button
                type="submit"
                disabled={addPortalToEventMutation.isPending}
                className="w-full"
              >
                {addPortalToEventMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
