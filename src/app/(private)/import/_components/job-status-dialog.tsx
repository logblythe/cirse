"use client";

import ApiClient from "@/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobStatus } from "@/type/job";
import { useQuery } from "@tanstack/react-query";
import {
  CircleCheck,
  CircleX,
  CloudDownload,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import React from "react";

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  portalId: string;
};

const apiClient = new ApiClient();

const STATUS_ICON_MAP: Record<JobStatus, React.ReactElement> = {
  CREATED: <Loader2 className="w-6 h-6 animate-spin text-blue-600" />,
  IN_PROGRESS: <Loader2 className="w-6 h-6 animate-spin text-blue-600" />,
  COMPLETED: <CircleCheck className="w-6 h-6  text-green-600" />,
  FAILED: <CircleX className="w-6 h-6 text-red-500" />,
};

export default function JobStatusDialog(props: DialogProps) {
  const { open, onOpenChange, portalId } = props;

  const jobsQuery = useQuery({
    queryKey: ["jobs", portalId],
    queryFn: () => apiClient.getJobs(portalId!),
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-2/3 flex flex-col"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <DialogTitle>Imported files</DialogTitle>
          <DialogDescription>
            Imported files are processed in the background. You can check the
            status of your imports here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-end">
          <Button
            onClick={() => {
              jobsQuery.refetch();
            }}
            className="w-32"
            variant={"secondary"}
          >
            <RefreshCcw className="w-4 h-4 mr-4" />
            <span>Refresh</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {jobsQuery.isLoading || jobsQuery.isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {jobsQuery.data?.data.map((job) => {
                const status = job.status;
                return (
                  <Card
                    key={job.jobId}
                    className="flex flex-row justify-between items-center p-4 bg-gray-100 rounded-lg"
                  >
                    <div className="flex flex-row space-x-4 items-center w-full">
                      {STATUS_ICON_MAP[status]}
                      <div className="flex flex-col flex-1 space-y-1">
                        <p className="text-sm font-semibold">{job.fileName}</p>
                        <p className="text-sm text-gray-500">{job.status}</p>
                      </div>
                      {job.downloadable ? (
                        <Button variant="outline" size="icon">
                          <CloudDownload className="w-4 h-4" />
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onOpenChange();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
