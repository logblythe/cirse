export type JobStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type Job =
  | {
      jobId: string;
      fileName: string;
      downloadable: boolean;
      createdAt: string;
      status: "CREATED" | "IN_PROGRESS" | "COMPLETED";
    }
  | {
      jobId: string;
      fileName: string;
      downloadable: boolean;
      createdAt: string;
      status: "FAILED";
      failedReason: string;
    };
