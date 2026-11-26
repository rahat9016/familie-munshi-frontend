import { ErrorType } from "@/src/types/common/common";
import { ProfileFormType } from "../Schema";

export interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProfileFormProps {
  onSubmit: (data: ProfileFormType) => void;
  onCancel: () => void;
  /** Read-only; shown for context, not editable here. */
  email?: string;
  isLoading?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface ProfileFormModalProps extends ProfileFormProps {
  isOpen: boolean;
}
