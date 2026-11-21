import { ErrorType } from "@/src/types/common/common";
import { IBranch } from "@/src/types/branch";
import { BranchFormType } from "../Schema";

export type { RbacBranch } from "@/src/types/rbac/rbac";

export interface BranchFormProps {
  onSubmit: (data: BranchFormType) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface BranchFormModalProps extends BranchFormProps {
  isOpen: boolean;
}

export interface BranchViewModalProps {
  branchId?: string;
  onClose: () => void;
}

/** Form modal state: open + optional row (row = edit, none = create). */
export interface BranchFormState {
  open: boolean;
  item?: IBranch;
}
