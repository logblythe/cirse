import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import ImportContent from "./_components/content";

const apiClient = new ApiClient();

export const metadata: Metadata = {
  title: "CIRSE | Session/Presentation Import",
  description: "Import sessions or presentations",
};

export default async function ImportPage({
  searchParams,
}: {
  searchParams: { portalId: string };
}) {
  const { portalId } = searchParams;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["portals", portalId],
    queryFn: () => apiClient.getPortalDetails(portalId!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImportContent portalId={portalId} />
    </HydrationBoundary>
  );
}
