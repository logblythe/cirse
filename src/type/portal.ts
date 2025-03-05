export type Field = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
};

export interface ValidationRule {
  columnName: string;
  dataType: "STRING" | "NUMBER";
  required: boolean;
  pastDate: boolean;
  futureDate: boolean;
}

export type Portal = {
  id: string;
  name: string;
  requiresOnlineUser: boolean;
  sessionFields: Field[];
  presentationFields: Field[];
  sessionValidationConfig: {
    id: string;
    fileJobType: "IMPORT_SESSIONS";
    rules: ValidationRule[];
  };
  presentationValidationConfig: {
    id: string;
    fileJobType: "IMPORT_PRESENTATIONS";
    rules: ValidationRule[];
  };
};
