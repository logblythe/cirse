"use client";

import ApiClient from "@/api-client/";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "@/type/portal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const FieldSelectionDialog = dynamic(() => import("./field-selection-dialog"), {
  ssr: false,
});

const apiClient = new ApiClient();

const ImportContent = ({ portalId }: { portalId: string }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isSessionFieldsOpen, setIsSessionFieldOpen] = React.useState(false);

  const [isPresentationFieldsOpen, setIsPresentationFieldOpen] =
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
    },
  });

  const handleUpdateFields = () => {
    const activeTab = searchParams.get("tab") ?? "session";
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
          <Button onClick={handleUpdateFields}>Update Fields</Button>
        </div>
        <Tabs
          value={searchParams.get("tab") ?? "session"}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", value);
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        >
          <TabsList>
            <TabsTrigger value="session">Session</TabsTrigger>
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
          </TabsList>
          <TabsContent value="session">
            <Card className="w-full h-full">
              <CardContent className="text-sm py-4 space-y-8 flex flex-col"></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="presentation">
            <Card className="w-full">
              <CardContent className="text-sm py-4 space-y-8 flex flex-col"></CardContent>
            </Card>
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
    </>
  );
};

export default ImportContent;
