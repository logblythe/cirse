export type JobStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type Job = {
  jobId: string;
  fileName: string;
  downloadable: boolean;
  status: JobStatus;
};
