import { ErrorType, ISelectOption } from "@/src/types/common/common";
import { IUser } from "@/src/types/user";
import { UserRoleFormType } from "../Schema";

export type UserRoleAction = "assign" | "remove";

export interface UserRolesProps {
  /** User whose roles are managed; undefined = closed. */
  user?: IUser;
  onClose: () => void;
  canAssign: boolean;
  canRemove: boolean;
}

export interface UserRoleFormProps {
  /** Omit to hide the Assign button. */
  onAssign?: (data: UserRoleFormType) => void;
  /** Omit to hide the Remove button. */
  onRemove?: (data: UserRoleFormType) => void;
  onCancel: () => void;
  roleOptions: ISelectOption[];
  isRolesLoading?: boolean;
  error?: ErrorType | null;
  /** Which action is in flight (disables both buttons). */
  pendingAction?: UserRoleAction | null;
}
