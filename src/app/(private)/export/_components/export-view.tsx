import ApiClient from "@/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { EXPORT_PURPOSE } from "@/type/purpose";
import { capitalizeInitial } from "@/utils/capitalize-initials";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PresentationFiltersForm } from "./filters/presentation-filters-form";
import { SessionFiltersForm } from "./filters/session-filters-form";

const apiClient = new ApiClient();

type Props = {
  onJobCreated: VoidFunction;
};

export const ExportView = ({ onJobCreated }: Props) => {
  const searchParams = useSearchParams();

  const portalId = searchParams.get("portalId");

  const activeTab = searchParams.get("tab") ?? "session";

  const purpose: EXPORT_PURPOSE =
    activeTab === "session" ? "EXPORT_SESSIONS" : "EXPORT_PRESENTATIONS";

  const queryClient = useQueryClient();

  const dataExtractionMutation = useMutation({
    mutationFn: ({ formData }: { formData: any }) =>
      apiClient.createDataExtractionJob(portalId!, purpose, formData),

    onSuccess: () => {
      toast({
        title: `${capitalizeInitial(activeTab)} export initiated successfully`,
        description: "You can view the status of the export in the jobs tab",
        action: (
          <ToastAction altText="Try again" onClick={onJobCreated}>
            View
          </ToastAction>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["jobs", portalId] });
    },
  });

  return (
    <div className="flex flex-col space-y-4">
      <Card className="w-full">
        <CardContent className="text-sm py-4 space-y-8 flex flex-col">
          <label className="text-lg">Filters</label>
          {activeTab === "session" ? (
            <SessionFiltersForm
              isLoading={dataExtractionMutation.isPending}
              onSubmit={(formData) => {
                dataExtractionMutation.mutate({ formData });
              }}
            />
          ) : (
            <PresentationFiltersForm
              isLoading={dataExtractionMutation.isPending}
              onSubmit={(formData) => {
                dataExtractionMutation.mutate({ formData });
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
