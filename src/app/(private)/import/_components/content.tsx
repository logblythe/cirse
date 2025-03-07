"use client";

import ApiClient from "@/api-client/";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Field } from "@/type/portal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Cog, History, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import JobStatusDialog from "./job-status-dialog";
import { UploadView } from "./tab-view";

const FieldSelectionDialog = dynamic(() => import("./field-selection-dialog"), {
  ssr: false,
});

const apiClient = new ApiClient();

const ImportContent = ({ portalId }: { portalId: string }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "session";

  const [isSessionFieldsOpen, setIsSessionFieldOpen] = React.useState(false);

  const [isPresentationFieldsOpen, setIsPresentationFieldOpen] =
    React.useState(false);

  const [isJobStatusDialogOpen, setIsJobStatusDialogOpen] =
    React.useState(false);

  const portalDetailsQuery = useQuery({
    queryKey: ["portals", portalId],
    queryFn: () => apiClient.getPortalDetails(portalId!),
  });

  const portalDetails = portalDetailsQuery.data;

  const updateSessionFieldsMutation = useMutation({
    mutationFn: (payload: { fields: Field[] }) =>
      apiClient.updateCustomFields(portalId!, "SESSION_IMPORT", payload.fields),
    onSettled: () => {
      portalDetailsQuery.refetch();
      toast({
        title: `Session custom field updated successfully`,
      });
      setIsSessionFieldOpen(false);
    },
  });

  const updatePresentationFieldsMutation = useMutation({
    mutationFn: (payload: { fields: Field[] }) =>
      apiClient.updateCustomFields(
        portalId!,
        "PRESENTATION_IMPORT",
        payload.fields
      ),
    onSettled: () => {
      portalDetailsQuery.refetch();
      toast({
        title: `Presentation custom field updated successfully`,
      });
      setIsPresentationFieldOpen(false);
    },
  });

  const showCustomFieldsModal = () => {
    switch (activeTab) {
      case "session":
        setIsSessionFieldOpen(true);
        break;
      case "presentation":
        setIsPresentationFieldOpen(true);
        break;
      default:
        setIsPresentationFieldOpen(false);
        setIsSessionFieldOpen(false);
        break;
    }
  };

  const handleTabValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleJobCreated = () => {
    setIsJobStatusDialogOpen(true);
  };

  return (
    <>
      <div className="container mx-auto py-10 space-y-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Import Portal{" "}
            </h3>
            {portalDetailsQuery.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-4" />
            ) : null}
          </div>
          <div className="flex flex-row items-center space-x-4">
            <Cog
              className="w-6 h-6 cursor-pointer"
              onClick={showCustomFieldsModal}
            />
            <History
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsJobStatusDialogOpen(true)}
            />
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabValueChange}>
          <TabsList>
            <TabsTrigger value="session">Session</TabsTrigger>
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
          </TabsList>
          <TabsContent value="session">
            <UploadView onJobCreated={handleJobCreated} />
          </TabsContent>
          <TabsContent value="presentation">
            <UploadView onJobCreated={handleJobCreated} />
          </TabsContent>
        </Tabs>
      </div>
      <FieldSelectionDialog
        open={isSessionFieldsOpen}
        onOpenChange={() => setIsSessionFieldOpen(false)}
        scope="Session"
        isPending={updateSessionFieldsMutation.isPending}
        fields={portalDetails?.sessionFields ?? []}
        onMutate={(fields) => {
          updateSessionFieldsMutation.mutate({ fields });
        }}
      />
      <FieldSelectionDialog
        open={isPresentationFieldsOpen}
        onOpenChange={() => setIsPresentationFieldOpen(false)}
        scope="Presentation"
        isPending={updatePresentationFieldsMutation.isPending}
        fields={portalDetails?.presentationFields ?? []}
        onMutate={(fields) => {
          updatePresentationFieldsMutation.mutate({ fields });
        }}
      />
      <JobStatusDialog
        open={isJobStatusDialogOpen}
        onOpenChange={() => setIsJobStatusDialogOpen(false)}
        portalId={portalId}
      />
    </>
  );
};

export default ImportContent;
