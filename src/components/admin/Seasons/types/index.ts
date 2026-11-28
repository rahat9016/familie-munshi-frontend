import { ErrorType } from "@/src/types/common/common";
import { ISeason } from "@/src/types/season";
import { SeasonFormType } from "../Schema";

export interface SeasonFormProps {
  onSubmit: (data: SeasonFormType) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface SeasonFormModalProps extends SeasonFormProps {
  isOpen: boolean;
}

/** Form modal state: open + optional row (row = edit, none = create). */
export interface SeasonFormState {
  open: boolean;
  item?: ISeason;
}
