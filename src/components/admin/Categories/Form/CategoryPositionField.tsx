import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import { useFormContext, useWatch } from "react-hook-form";
import { CategoryFormType } from "../Schema";
import { CategoryPositionFieldProps } from "../types";

/** Position input with the suggested next position (create only). */
export default function CategoryPositionField({
  suggestedPosition,
  isLoading = false,
}: CategoryPositionFieldProps) {
  const { control, resetField } = useFormContext<CategoryFormType>();
  const position = useWatch({ control, name: "position" });
  const differsFromSuggestion =
    suggestedPosition !== undefined && Number(position) !== suggestedPosition;

  return (
    <div>
      <InputLabel label="Position" required />
      <ControlledInputField
        className="bg-light"
        type="number"
        name="position"
        placeholder="e.g. 1"
      />
      {isLoading ? (
        <p className="mt-1 text-xs text-secondary-gary">
          Finding next position…
        </p>
      ) : (
        suggestedPosition !== undefined && (
          <p className="mt-1 flex items-center gap-2 text-xs text-secondary-gary">
            Next available position: {suggestedPosition}
            {differsFromSuggestion && (
              <button
                type="button"
                // Resets dirty state so later parent changes auto-update again.
                onClick={() =>
                  resetField("position", { defaultValue: suggestedPosition })
                }
                className="font-medium text-primary hover:underline"
              >
                Use {suggestedPosition}
              </button>
            )}
          </p>
        )
      )}
    </div>
  );
}
