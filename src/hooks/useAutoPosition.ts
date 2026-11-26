import { useEffect } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

/**
 * Position auto-increment for create forms: keeps `name` on the suggested
 * next position (and follows it when it changes, e.g. another parent picked
 * or the list refreshed) until the user types their own value.
 *
 * `resetField` makes the suggestion the field's default, so any manual edit
 * marks it dirty and stops further auto-updates ("Use N" in
 * ControlledPositionField resets it again).
 *
 * Call it AFTER the effect that resets the form on open, so it runs second.
 */
export function useAutoPosition<T extends FieldValues>(
  methods: UseFormReturn<T>,
  name: Path<T>,
  { active, suggested }: { active: boolean; suggested?: number }
) {
  useEffect(() => {
    if (!active || suggested === undefined) return;
    if (methods.getFieldState(name).isDirty) return;
    methods.resetField(name, {
      defaultValue: suggested as PathValue<T, Path<T>>,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, suggested]);
}
