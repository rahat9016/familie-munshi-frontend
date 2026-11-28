/** One field error from a 400 VALIDATION_FAILED response. */
export interface IApiFieldError {
  field: string;
  code?: string;
  message: string;
}

const isFieldError = (e: unknown): e is IApiFieldError =>
  typeof e === "object" &&
  e !== null &&
  typeof (e as IApiFieldError).message === "string";

/** Field errors (`errors: [{ field, code, message }]`) from a rejected request. */
export const getApiFieldErrors = (error: unknown): IApiFieldError[] => {
  const errors = (error as { errors?: unknown } | null | undefined)?.errors;
  return Array.isArray(errors) ? errors.filter(isFieldError) : [];
};

/**
 * Best user-facing message: field messages joined (e.g. "Description is
 * required") over the generic "Input validation failed…", else `message`.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong!"
): string => {
  const errors = (error as { errors?: unknown } | null | undefined)?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const messages = errors
      .map((e) => (isFieldError(e) ? e.message : String(e)))
      .filter(Boolean);
    if (messages.length) return messages.join(", ");
  }
  const message = (error as { message?: unknown } | null | undefined)?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
};
