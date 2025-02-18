"use client";

import ApiClient from "@/api-client";
import { DataTable } from "@/components/data-table";
import { useEventStore } from "@/store/event-store";
import { Portal } from "@/type/portal";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

const apiClient = new ApiClient();

const LeadRetrievalPage = () => {
  const router = useRouter();
  const { selectedEventId } = useEventStore();

  const eventPortalQuery = useQuery({
    queryKey: ["events", selectedEventId, "portals"],
    queryFn: () => apiClient.getEventPortals(selectedEventId!),
    enabled: Boolean(selectedEventId),
  });

  const portals = eventPortalQuery.data;

  const handleRowClick = (portal: Portal) => {
    router.push(`/lead-retrieval?portalId=${portal.id}`);
  };

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          <div>All Portals</div>
        </h3>
      </div>
      {portals ? (
        <DataTable
          columns={columns}
          data={portals}
          onRowClick={handleRowClick}
        />
      ) : null}
    </div>
  );
};

export default LeadRetrievalPage;
