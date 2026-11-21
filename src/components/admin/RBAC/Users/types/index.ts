import { ErrorType, ISelectOption } from "@/src/types/common/common";
import { IUser } from "@/src/types/user";
import { UserFormType } from "../Schema";

export interface UserFormProps {
  onSubmit: (data: UserFormType) => void;
  onCancel: () => void;
  roleOptions: ISelectOption[];
  isRolesLoading?: boolean;
  /** "Assign to branch" toggle is on → show branch dropdown. */
  assignBranch?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface UserFormModalProps extends UserFormProps {
  isOpen: boolean;
}

export interface UserViewModalProps {
  userId?: string;
  onClose: () => void;
}

/** Create-only for now — the API has no user update/delete yet. */
export interface UserFormState {
  open: boolean;
}

export type { IUser };
