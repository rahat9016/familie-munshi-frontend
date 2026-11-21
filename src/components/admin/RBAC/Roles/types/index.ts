import { ErrorType } from "@/src/types/common/common";
import { IRole } from "@/src/types/role";
import { RoleFormType } from "../Schema";

export interface RoleFormProps {
  onSubmit: (data: RoleFormType) => void;
  onCancel: () => void;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface RoleFormModalProps extends RoleFormProps {
  isOpen: boolean;
}

export interface RoleViewModalProps {
  roleId?: string;
  onClose: () => void;
}

/** Create-only for now — the API has no role update/delete yet. */
export interface RoleFormState {
  open: boolean;
}

export type { IRole };
