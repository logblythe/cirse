"use client";

import ApiClient from "@/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { useEventStore } from "@/store/event-store";
import { Portal } from "@/type/portal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import AddPortalTemplateDialog from "./add-portal-template-dialog";

const apiClient = new ApiClient();

const PortalsPage = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  const { selectedEventId } = useEventStore();

  const { showErrorToast } = useNetworkErrorToast();

  const queryClient = useQueryClient();

  const eventPortalQuery = useQuery({
    queryKey: ["events", selectedEventId, "portals"],
    queryFn: () => apiClient.getEventPortals(selectedEventId!),
    enabled: Boolean(selectedEventId),
  });

  const removePortalMutation = useMutation({
    mutationFn: (portalId: string) => apiClient.removePortalFromEvent(portalId),
    onError: (error) => {
      showErrorToast();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events", selectedEventId, "portals"],
      });
    },
  });

  const portals = eventPortalQuery.data;

  const handleRowClick = (portal: Portal) => {
    router.push(`/lead-retrieval?portalId=${portal.id}`);
  };

  const handleRemovePortal = (portalId: string) => {
    removePortalMutation.mutate(portalId);
  };

  return (
    <>
      <div className="container mx-auto py-10 space-y-2">
        <div className="flex flex-row  justify-between items-end">
          <div className="flex flex-row space-x-4 items-center">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              <span>All Portals</span>
            </h3>
            {eventPortalQuery.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Portal
            </Button>
          </div>
        </div>
        {portals?.length === 0 && (
          <div className="text-center">No portals found</div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portals?.map((portal) => (
            <Card key={portal.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    <p
                      className="cursor-pointer"
                      onClick={() => handleRowClick(portal)}
                    >
                      {portal.name}
                    </p>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePortal(portal.id);
                      }}
                      disabled={removePortalMutation.isPending}
                    >
                      {removePortalMutation.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Trash2 className="w-6 h-6 text-red-400" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{portal.id}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      {selectedEventId ? (
        <AddPortalTemplateDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          selectedEventId={selectedEventId}
        />
      ) : null}
    </>
  );
};

export default PortalsPage;
