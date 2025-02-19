"use client";

import ApiClient from "@/api-client/";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { columns } from "../../user-management/columns";
import CreatePortalUserDialog from "./create-portal-user-dialog";

const apiClient = new ApiClient();

const LeadRetrievalContent = () => {
  const searchParams = useSearchParams();

  const portalId = searchParams.get("portalId");

  const [isOpen, setIsOpen] = useState(false);

  const portalDetailsQuery = useQuery({
    queryKey: ["portals", portalId],
    queryFn: () => apiClient.getPortalDetails(portalId!),
    enabled: Boolean(portalId),
  });

  const portalDetails = portalDetailsQuery.data;

  const usersQuery = useQuery({
    queryKey: ["users", portalId],
    queryFn: () =>
      apiClient.getUsers({ page: 1, size: 10, portalId: portalId ?? "" }),
    enabled: Boolean(portalDetails?.requiresOnlineUser),
  });

  const users = usersQuery.data?.data ?? [];

  return (
    <>
      <div className="container mx-auto py-10 space-y-2">
        <div className="flex flex-row  justify-between items-end">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Lead Retrieval API
          </h3>
          <Button
            onClick={(e) => {
              setIsOpen(!isOpen);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Portal User
          </Button>
        </div>
        <Card className="w-full">
          <CardContent className="text-sm py-4 space-y-2">
            <div className="flex flex-row space-x-2 items-center">
              <label className="font-semibold">Auth URL:</label>
              <p>
                https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/auth/login
              </p>
              <CopyToClipboard text="https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/auth/login" />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <label className="font-semibold">QR code URL:</label>
              <p>
                https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/events/scan-contact?code=
              </p>
              <CopyToClipboard
                text={
                  "https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/events/scan-contact?code="
                }
              />
            </div>
          </CardContent>
        </Card>
        {portalDetails?.requiresOnlineUser ? (
          <div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight pt-4">
              Portal Users
            </h3>
            <DataTable columns={columns} data={users} />
          </div>
        ) : null}
      </div>
      {portalId ? (
        <CreatePortalUserDialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          portalId={portalId}
        />
      ) : null}
    </>
  );
};

export default LeadRetrievalContent;
