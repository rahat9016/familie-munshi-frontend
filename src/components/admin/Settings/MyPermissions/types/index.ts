import {
  ApiBranchPermissions,
  ApiModulePermissions,
  MyPermissionsResponse,
} from "@/src/utils/rbac";

export interface ModulePermissionListProps {
  modules: ApiModulePermissions[];
  emptyMessage?: string;
}

export interface AccessSummaryProps {
  access?: MyPermissionsResponse;
  isSuperAdmin: boolean;
  isLoading?: boolean;
}

export interface BranchAccessListProps {
  branches: ApiBranchPermissions[];
}
