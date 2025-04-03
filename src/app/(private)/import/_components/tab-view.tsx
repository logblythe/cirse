import ApiClient from "@/api-client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import {
  PRESENTATION_TEMPLATE_FILE_NAME,
  PRESENTATION_TEMPLATE_URL,
  SESSION_TEMPLATE_FILE_NAME,
  SESSION_TEMPLATE_URL,
} from "@/consts/urls";
import { Portal } from "@/type/portal";
import { capitalizeInitial } from "@/utils/capitalize-initials";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CircleX,
  DownloadCloud,
  FileSpreadsheet,
  Loader2,
  UploadIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import * as XLSX from "xlsx";

const apiClient = new ApiClient();

type RowData = {
  [key: string]: any;
};

type Props = {
  onJobCreated: VoidFunction;
};

export const UploadView = ({ onJobCreated }: Props) => {
  const [errors, setErrors] = React.useState<Record<number, string[]>>({});
  const [data, setData] = React.useState<any[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const searchParams = useSearchParams();

  const portalId = searchParams.get("portalId");

  const activeTab = searchParams.get("tab") ?? "session";

  const purpose =
    activeTab === "session" ? "IMPORT_SESSIONS" : "IMPORT_PRESENTATIONS";

  const queryClient = useQueryClient();

  const portalDetails = queryClient.getQueryData<Portal>(["portals", portalId]);

  const uploadMutation = useMutation({
    mutationFn: () =>
      apiClient.uploadAndCreateJob(portalId!, purpose, selectedFile!),
    onSuccess: () => {
      onRemoveFileClick();
      toast({
        title: `${capitalizeInitial(activeTab)} imported successfully`,
        description: "You can view the status of the import in the jobs tab",
        action: (
          <ToastAction altText="Try again" onClick={onJobCreated}>
            View
          </ToastAction>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["jobs", portalId] });
    },
    onError: ({ message }) => {
      const error = JSON.parse(message);
      const errorDetails: Record<string, string[]> = error.details;
      setErrors(errorDetails);
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      return;
    }
    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = e.target?.result;
      if (!buffer) return;

      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Read first sheet
      const sheet = workbook.Sheets[sheetName];

      const jsonData: RowData[] = XLSX.utils.sheet_to_json(sheet);
      const lowerCaseJsonData = jsonData.map((row) =>
        Object.keys(row).reduce((acc, key) => {
          acc[key.toLowerCase()] = row[key];
          return acc;
        }, {} as RowData)
      );
      setData(lowerCaseJsonData);
      validateData(lowerCaseJsonData);
    };
  };

  const validateData = (jsonData: any[]) => {
    const fileColumns = Object.keys(jsonData[0] || {});

    const validationRules =
      activeTab === "session"
        ? portalDetails?.sessionValidationConfig?.rules ?? []
        : portalDetails?.presentationValidationConfig?.rules ?? [];

    if (!validationRules) {
      return;
    }

    // Validate Columns
    validationRules.forEach((rule) => {
      if (!fileColumns.includes(rule.columnName)) {
        errors[0] = errors[0] || [];
        errors[0].push(`Missing required column: ${rule.columnName}`);
      }
    });

    // Validate each row
    jsonData.forEach((row, rowIndex) => {
      validationRules.forEach((rule) => {
        const value = row[rule.columnName];

        // Initialize error array for this row
        if (!errors[rowIndex + 1]) errors[rowIndex + 1] = [];

        if (rule.required && !value) {
          errors[rowIndex + 1].push(`Column "${rule.columnName}" is required`);
        }

        // Data Type Check
        if (rule.dataType === "STRING" && typeof value !== "string") {
          errors[rowIndex + 1].push(
            `Column "${rule.columnName}" must be a STRING`
          );
        }
        //Some fields with type NUMBER can have the value "unlimited" which is a string
        if (
          rule.dataType === "NUMBER" &&
          isNaN(value) &&
          value.toLowerCase() !== "unlimited"
        ) {
          errors[rowIndex + 1].push(
            `Column"${rule.columnName}" must be a NUMBER`
          );
        }

        // Date Validations
        if (rule.pastDate || rule.futureDate) {
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            errors[rowIndex + 1].push(
              `Column "${rule.columnName}" must be a valid DATE`
            );
          } else {
            const today = new Date();
            if (rule.pastDate && dateValue >= today) {
              errors[rowIndex + 1].push(
                `Column "${rule.columnName}" must be a past date`
              );
            }
            if (rule.futureDate && dateValue <= today) {
              errors[rowIndex + 1].push(
                `Column "${rule.columnName}" must be a future date`
              );
            }
          }
        }

        // Remove empty error arrays
        if (errors[rowIndex + 1]?.length === 0) {
          delete errors[rowIndex + 1];
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      setErrors({});
    }
  };

  const onRemoveFileClick = () => {
    setSelectedFile(null);
    setData([]);
    setErrors({});
  };

  const onFileUpload = () => {
    uploadMutation.mutate();
  };

  const downloadTemplate = () => {
    let url = "";
    let filename = "";
    if (activeTab === "session") {
      url = SESSION_TEMPLATE_URL;
      filename = SESSION_TEMPLATE_FILE_NAME;
    } else {
      url = PRESENTATION_TEMPLATE_URL;
      filename = PRESENTATION_TEMPLATE_FILE_NAME;
    }
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full h-full">
      <CardContent className="text-sm py-4 space-y-8 flex flex-col">
        {selectedFile ? (
          <div className="space-y-8">
            <div className="space-y-2 ">
              <p className="text-lg dark:text-white">Selected file</p>
              <div className="flex flex-row border border-gray-200 items-center shadow-sm py-2 px-4 rounded-md space-x-2 w-full md:w-1/3">
                <FileSpreadsheet className="w-12 h-12 text-green-500" />
                <div className="flex flex-col ">
                  <p className="font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {data.length} rows found
                  </p>
                </div>
                <div className="flex-grow justify-end flex">
                  <CircleX
                    className="w-6 h-6 text-red-500 cursor-pointer"
                    onClick={onRemoveFileClick}
                  />
                </div>
              </div>
            </div>
            {Object.keys(errors).length > 0 ? (
              <div className="space-y-2 bg-red-100  p-4 rounded-md">
                <h5 className="text-lg dark:text-white">Validation Errors</h5>
                <p className="dark:text-white text-secondary-foreground">
                  Following errors were encountered in the selected file. Please
                  fix them before uploading.
                </p>
                {Object.keys(errors).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-red-600 font-bold">
                      Validation Errors
                    </h3>
                    <table className="w-full border-collapse border border-red-400 my-2">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="border border-red-400 p-2">Row</th>
                          <th className="border border-red-400 p-2">Errors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(errors).map(([rowIndex, errorList]) => (
                          <tr key={rowIndex} className="border border-red-400">
                            <td className="border border-red-400 p-2 text-center">
                              {rowIndex}
                            </td>
                            <td className="border border-red-400 p-2">
                              {errorList.map((error, index) => (
                                <div key={index} className="text-red-600">
                                  ❌ {error}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 bg-green-50 p-4 rounded-md shadow-sm">
                <div className="space-y-2">
                  <h5 className="text-lg dark:text-white">
                    No Validation Errors
                  </h5>
                  <p className="dark:text-white text-secondary-foreground ">
                    The selected file is ready to upload. Click the upload
                    button to get started.
                  </p>
                </div>
                <Button className="w-full" onClick={onFileUpload}>
                  {uploadMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadIcon className="w-4 h-4 mr-2" />
                  )}
                  Upload
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <FileUpload onDrop={handleDrop} />
            <div className="flex flex-row justify-end ">
              <div className="flex flex-col items-end">
                <p className="text-gray-500">
                  Get started by downloading the template
                </p>
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="w-32"
                  onClick={downloadTemplate}
                >
                  <DownloadCloud className="w-4 h-4 text-primary" />
                  <span className="ml-2 font-normal text-xs">Download</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
