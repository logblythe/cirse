type Job = {
  jobId: string;
  fileName: string;
  downloadable: boolean;
  status: "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
};
