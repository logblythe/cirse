import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import ImportContent from "./_components/content";

const questionsClient = new ApiClient();

export const metadata: Metadata = {
  title: "CIRSE | Session/Presentation Import",
  description: "Import sessions or presentations",
};

export default async function ImportPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["events"],
    queryFn: () => questionsClient.getEvents(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImportContent />
    </HydrationBoundary>
  );
}
