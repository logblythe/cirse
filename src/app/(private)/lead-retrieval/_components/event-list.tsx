"use client";

import ApiClient from "@/api-client/";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CreatePortalUserDialog from "./create-portal-user-dialog";

const apiClient = new ApiClient();

const LeadRetrieval = () => {
  const searchParams = useSearchParams();
  const portalId = searchParams.get("portalId");

  const [isOpen, setIsOpen] = useState(false);

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
              <label className="font-semibold">Url a:</label>
              <p>
                https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/auth/login
              </p>
              <CopyToClipboard text="https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/auth/login" />
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <label className="font-semibold">Url b:</label>
              <p>
                https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/events/scan-contact?code=2,cd7026d4-b85c-44c4-a7fe-a0e87dda5039
              </p>
              <CopyToClipboard
                text={
                  "https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1/events/scan-contact?code=2,cd7026d4-b85c-44c4-a7fe-a0e87dda5039"
                }
              />
            </div>
          </CardContent>
        </Card>
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

export default LeadRetrieval;
