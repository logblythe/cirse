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
import { cn } from "@/lib/utils";
import { JobStatus } from "@/type/job";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CircleCheck,
  CloudDownload,
  Loader2,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "../ui/use-toast";

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  portalId: string;
  title: string;
  description: string;
};

const apiClient = new ApiClient();

const STATUS_ICON_MAP: Record<JobStatus, React.ReactElement> = {
  CREATED: <Loader2 className="w-6 h-6 animate-spin text-blue-600" />,
  IN_PROGRESS: <Loader2 className="w-6 h-6 animate-spin text-blue-600" />,
  COMPLETED: <CircleCheck className="w-6 h-6  text-green-600" />,
  FAILED: <TriangleAlert className="w-6 h-6 text-red-500" />,
};

export default function JobStatusDialog(props: DialogProps) {
  const { open, onOpenChange, portalId, title, description } = props;

  const observerRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const jobsQuery = useInfiniteQuery({
    queryKey: ["jobs", portalId],
    queryFn: ({ pageParam }) => apiClient.getJobs(portalId!, pageParam),
    getNextPageParam: (response) => {
      const { currentPage, totalPages } = response;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: open,
  });

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && jobsQuery.hasNextPage) {
          jobsQuery.fetchNextPage();
        }
      },
      { threshold: 1, rootMargin: "100px" }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [observerRef.current, jobsQuery.hasNextPage]);

  const fileDownloadMutation = useMutation({
    mutationFn: ({ jobId }: { jobId: string }) =>
      apiClient.downloadExtractedFile(jobId),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-end">
          <Button
            onClick={() => {
              containerRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              jobsQuery.refetch();
            }}
            className="w-32"
            variant={"secondary"}
            disabled={jobsQuery.isRefetching}
          >
            <RefreshCcw
              className={cn("w-4 h-4 mr-4", {
                "animate-spin": jobsQuery.isRefetching,
              })}
            />
            <span>Refresh</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto" ref={containerRef}>
          {jobsQuery.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {jobsQuery.data?.pages.map((page) =>
                page.data.map((job) => (
                  <Card
                    key={job.jobId}
                    className="flex flex-row justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <div className="flex flex-row space-x-4 items-center w-full">
                      {STATUS_ICON_MAP[job.status]}
                      <div className="flex flex-col flex-1 space-y-1">
                        <p className="text-sm font-semibold">{job.fileName}</p>
                        <div className="flex flex-row space-x-2 items-center">
                          {job.status !== "FAILED" ? (
                            <p className="text-sm text-gray-500">
                              {job.status}
                            </p>
                          ) : (
                            <p className="text-xs text-red-500">
                              {job.failedReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {job.status === "COMPLETED" && job.downloadable ? (
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-gray-200"
                            disabled={
                              fileDownloadMutation.isPending &&
                              fileDownloadMutation.variables?.jobId ===
                                job.jobId
                            }
                            onClick={() => {
                              fileDownloadMutation.mutate({ jobId: job.jobId });
                            }}
                          >
                            {fileDownloadMutation.isPending &&
                            fileDownloadMutation.variables?.jobId ===
                              job.jobId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CloudDownload className="w-4 h-4" />
                            )}
                          </Button>
                        ) : null}
                        <p className="text-xs text-gray-500">
                          {format(job.createdAt, "MM/dd/yyyy")}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
              {jobsQuery.hasNextPage ? (
                <div ref={observerRef}>
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : null}
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
