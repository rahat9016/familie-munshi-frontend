import { IPermission } from "@/src/types/permission";

export interface PermissionViewModalProps {
  permissionId?: string;
  onClose: () => void;
}

export interface PermissionModuleFilterProps {
  /** "" = all modules */
  value: string;
  onChange: (value: string) => void;
  modules: string[];
  isLoading?: boolean;
}

export type { IPermission };
