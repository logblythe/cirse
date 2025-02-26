"use client";

import ApiClient from "@/api-client/";
import { Field } from "@/type/portal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FieldsUpdateCard } from "./session-fields";

const apiClient = new ApiClient();

const ImportContent = () => {
  const searchParams = useSearchParams();

  const portalId = searchParams.get("portalId");

  const portalDetailsQuery = useQuery({
    queryKey: ["portals", portalId],
    queryFn: () => apiClient.getPortalDetails(portalId!),
    enabled: Boolean(portalId),
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

  return (
    <>
      <div className="container mx-auto py-10 space-y-2">
        <div className="flex flex-row  justify-between items-end">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Session/Presentation Import{" "}
          </h3>
          {portalDetailsQuery.isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin ml-4" />
          ) : null}
        </div>
        {portalDetailsQuery.isLoading ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <FieldsUpdateCard
              scope="Session"
              isPending={updateSessionFieldsMutation.isPending}
              fields={portalDetails?.sessionFields ?? []}
              onUpdateFields={(fields) => {
                updateSessionFieldsMutation.mutate({ fields });
              }}
            />
            <FieldsUpdateCard
              scope="Presentation"
              isPending={updatePresentationFieldsMutation.isPending}
              fields={portalDetails?.presentationFields ?? []}
              onUpdateFields={(fields) => {
                updatePresentationFieldsMutation.mutate({ fields });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ImportContent;
