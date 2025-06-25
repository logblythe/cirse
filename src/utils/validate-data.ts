import { ValidationRule } from "@/type/portal";
import { getTimeRegex } from "@/utils/get-time-regex";

/**
 * Validates imported data against provided validation rules and updates error state.
 * @param jsonData - Array of row data to validate
 * @param validationRules - Array of validation rules
 * @param setErrors - Function to update error state
 */
export function validateData(
  jsonData: any[],
  validationRules: ValidationRule[],
  setErrors: (errors: Record<number, string[]>) => void
) {
  const errors: Record<number, string[]> = {};
  const fileColumns = Object.keys(jsonData[0] || {});

  if (!validationRules) {
    return;
  }

  // Validate each row
  jsonData.forEach((row, rowIndex) => {
    validationRules.forEach((rule: any) => {
      const value = row[rule.columnName];

      // Initialize error array for this row
      if (!errors[rowIndex + 1]) errors[rowIndex + 1] = [];

      if (rule.required && (value === undefined || value === null)) {
        errors[rowIndex + 1].push(`Column "${rule.columnName}" is required`);
      }

      if (value) {
        switch (rule.dataType) {
          case "STRING":
          case "TEXT":
            validateString(value, rule, errors[rowIndex + 1]);
            validateDateFormat(value, rule, errors[rowIndex + 1]);
            break;
          case "NUMBER":
          case "AMOUNT":
            validateNumber(value, rule, errors[rowIndex + 1]);
            break;
          case "CHECKBOX":
            validateCheckbox(value, rule, errors[rowIndex + 1]);
            break;
          case "URL":
            validateURL(value, rule, errors[rowIndex + 1]);
            break;
          case "TAG":
            break;
          default:
            errors[rowIndex + 1].push(
              `Unknown data type "${rule.dataType}" for column "${rule.columnName}"`
            );
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
}

function validateString(value: any, rule: any, errorList: string[]) {
  if (value && typeof value !== "string") {
    errorList.push(`Column "${rule.columnName}" must be a STRING`);
  }
}

function validateNumber(value: any, rule: any, errorList: string[]) {
  if (value !== undefined) {
    if (typeof value === "string") {
      if (isNaN(Number(value)) && value.toLowerCase() !== "unlimited") {
        errorList.push(`Column "${rule.columnName}" must be a NUMBER`);
      }
    } else if (typeof value !== "number") {
      errorList.push(`Column "${rule.columnName}" must be a NUMBER`);
    }
  }
}

function validateCheckbox(value: any, rule: any, errorList: string[]) {
  if (!(typeof value === "boolean" || value === "true" || value === "false")) {
    errorList.push(`Column "${rule.columnName}" must be a BOOLEAN`);
  }
}

function validateURL(value: any, rule: any, errorList: string[]) {
  const urlPattern = /^(http|https):\/\/[^ "']+$/;
  if (value && !urlPattern.test(value)) {
    errorList.push(`Column "${rule.columnName}" must be a valid URL`);
  }
}

function validateDateFormat(value: any, rule: any, errorList: string[]) {
  if (!rule.dateFormat) {
    return;
  }
  const regex = getTimeRegex(rule.dateFormat);
  if (value && regex && !regex.test(value)) {
    errorList.push(
      `Column "${rule.columnName}" must match the format ${rule.dateFormat}`
    );
  }
}

function validateDateBoundary(value: any, rule: any, errorList: string[]) {
  if (!rule.dateFormat) {
    return;
  }
  const dateValue = new Date(value);
  if (isNaN(dateValue.getTime())) {
    errorList.push(`Column "${rule.columnName}" must be a valid DATE`);
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion

    if (rule.pastDate && dateValue >= today) {
      errorList.push(`Column "${rule.columnName}" must be a past date`);
    }
    if (rule.futureDate && dateValue <= today) {
      errorList.push(`Column "${rule.columnName}" must be a future date`);
    }
  }
}
