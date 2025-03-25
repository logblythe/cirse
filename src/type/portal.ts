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

type SessionValidationConfig = {
  id: string;
  fileJobType: "IMPORT_SESSIONS";
  rules: ValidationRule[];
};

type PresentationValidationConfig = {
  id: string;
  fileJobType: "IMPORT_PRESENTATIONS";
  rules: ValidationRule[];
};

export type ExtractField = {
  alias: string;
  custom: boolean;
  enabled: boolean;
  name: string;
};

export type ExtractFilters = {
  name: string;
  values: string[];
};

export type Portal = {
  id: string;
  name: string;
  requiresOnlineUser: boolean;
  sessionFields: Field[];
  sessionValidationConfig: SessionValidationConfig;
  sessionExtractFields: ExtractField[];
  sessionExtractFilters: ExtractFilters[];
  presentationFields: Field[];
  presentationValidationConfig: PresentationValidationConfig;
  presentationExtractFields: ExtractField[];
  presentationExtractFilters: ExtractFilters[];
};
