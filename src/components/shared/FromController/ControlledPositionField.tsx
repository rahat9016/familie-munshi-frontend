"use client";

import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import { useFormContext, useWatch } from "react-hook-form";

interface ControlledPositionFieldProps {
  name?: string;
  label?: string;
  /** Next free position (create). Omit in edit mode to hide the hint. */
  suggestedPosition?: number;
  isLoading?: boolean;
  /** Extra rule shown under the field, e.g. "Must be unique across brands." */
  helperText?: string;
  className?: string;
}

/**
 * Numeric position input for the auto-increment system (see
 * `useAutoPosition`): shows the next available position and a "Use N"
 * shortcut when the user typed something else.
 */
export default function ControlledPositionField({
  name = "position",
  label = "Position",
  suggestedPosition,
  isLoading = false,
  helperText,
  className,
}: ControlledPositionFieldProps) {
  const { control, resetField } = useFormContext();
  const value = useWatch({ control, name });
  const differs =
    suggestedPosition !== undefined && Number(value) !== suggestedPosition;
  const hasHint = isLoading || suggestedPosition !== undefined;

  return (
    <div className={className}>
      <InputLabel label={label} required />
      <ControlledInputField
        className="bg-light"
        type="number"
        name={name}
        placeholder="e.g. 1"
      />
      {(hasHint || helperText) && (
        <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs text-secondary-gary">
          {isLoading ? (
            <span>Finding next…</span>
          ) : (
            suggestedPosition !== undefined && (
              <>
                <span>
                  Next:{" "}
                  <span className="font-semibold text-secondary-dark">
                    {suggestedPosition}
                  </span>
                </span>
                {differs && (
                  <button
                    type="button"
                    // Clears dirty state so auto-increment takes over again.
                    onClick={() =>
                      resetField(name, { defaultValue: suggestedPosition })
                    }
                    className="font-medium text-primary hover:underline"
                  >
                    Use
                  </button>
                )}
              </>
            )
          )}
          {hasHint && helperText && <span aria-hidden>·</span>}
          {helperText && <span className="truncate">{helperText}</span>}
        </p>
      )}
    </div>
  );
}
