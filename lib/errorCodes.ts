// Error codes for API responses
export const ERROR_CODES = {
  // Auth errors
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_TOKEN: "INVALID_TOKEN",
  MISSING_CREDENTIALS: "MISSING_CREDENTIALS",

  // Form errors
  FORM_NOT_FOUND: "FORM_NOT_FOUND",
  FORM_NOT_OWNED: "FORM_NOT_OWNED",
  FORM_CREATE_FAILED: "FORM_CREATE_FAILED",
  FORM_UPDATE_FAILED: "FORM_UPDATE_FAILED",
  FORM_DELETE_FAILED: "FORM_DELETE_FAILED",

  // Field errors
  FIELD_CREATE_FAILED: "FIELD_CREATE_FAILED",
  FIELD_UPDATE_FAILED: "FIELD_UPDATE_FAILED",
  FIELD_DELETE_FAILED: "FIELD_DELETE_FAILED",
  FIELD_NOT_FOUND: "FIELD_NOT_FOUND",

  // Option errors
  OPTION_CREATE_FAILED: "OPTION_CREATE_FAILED",
  OPTION_UPDATE_FAILED: "OPTION_UPDATE_FAILED",
  OPTION_DELETE_FAILED: "OPTION_DELETE_FAILED",
  OPTION_NOT_FOUND: "OPTION_NOT_FOUND",

  // General errors
  INVALID_INPUT: "INVALID_INPUT",
  DATABASE_ERROR: "DATABASE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  INVALID_TOKEN: "Your session has expired. Please log in again",
  MISSING_CREDENTIALS: "Missing authentication credentials",

  FORM_NOT_FOUND: "Form not found",
  FORM_NOT_OWNED: "You do not have permission to modify this form",
  FORM_CREATE_FAILED: "Failed to create form",
  FORM_UPDATE_FAILED: "Failed to update form",
  FORM_DELETE_FAILED: "Failed to delete form",

  FIELD_CREATE_FAILED: "Failed to add field",
  FIELD_UPDATE_FAILED: "Failed to update field",
  FIELD_DELETE_FAILED: "Failed to delete field",
  FIELD_NOT_FOUND: "Field not found",

  OPTION_CREATE_FAILED: "Failed to add option",
  OPTION_UPDATE_FAILED: "Failed to update option",
  OPTION_DELETE_FAILED: "Failed to delete option",
  OPTION_NOT_FOUND: "Option not found",

  INVALID_INPUT: "Invalid input provided",
  DATABASE_ERROR: "Database error occurred",
  INTERNAL_ERROR: "Internal server error",
};
