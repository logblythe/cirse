import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import UserList from "./user-list";

const apiClient = new ApiClient();

export const metadata: Metadata = {
  title: "CIRSE | User Management",
  description: "View all events",
};

export default async function EventsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", "admin"],
    queryFn: () => apiClient.getUsers({ page: 1, size: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList />
    </HydrationBoundary>
  );
}
