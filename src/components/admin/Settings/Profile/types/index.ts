import { ErrorType } from "@/src/types/common/common";
import { IMyProfile } from "@/src/types/user";
import { MyPermissionsResponse } from "@/src/utils/rbac";
import { ProfileFormType } from "../Schema";

export interface ProfileFormProps {
  onSubmit: (data: ProfileFormType) => void;
  onReset: () => void;
  /** Read-only; email cannot be changed here. */
  email?: string;
  /** Avatar fallback, e.g. "RU". */
  initials: string;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface ProfilePictureFieldProps {
  initials: string;
}

export interface ProfileSummaryCardProps {
  profile?: IMyProfile;
  access?: MyPermissionsResponse;
  isLoading?: boolean;
}
