import { ErrorType } from "@/src/types/common/common";
import { IPermissionTreeGroup } from "@/src/types/permission";
import { IRole } from "@/src/types/role";
import { RolePermissionsFormType } from "../Schema";

export interface RolePermissionsProps {
  /** Role to assign permissions to; undefined = closed. */
  role?: IRole;
  onClose: () => void;
}

export interface RolePermissionsFormProps {
  onSubmit: (data: RolePermissionsFormType) => void;
  onCancel: () => void;
  groups: IPermissionTreeGroup[];
  isGroupsLoading?: boolean;
  error?: ErrorType | null;
  isPending?: boolean;
}
