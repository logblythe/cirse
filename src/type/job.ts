export type JobStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type Job =
  | {
      jobId: string;
      fileName: string;
      downloadable: boolean;
      status: "CREATED" | "IN_PROGRESS" | "COMPLETED";
    }
  | {
      jobId: string;
      fileName: string;
      downloadable: boolean;
      status: "FAILED";
      failedReason: string;
    };
