import { ErrorType } from "@/src/types/common/common";
import { IMyProfile } from "@/src/types/user";
import { MyPermissionsResponse } from "@/src/utils/rbac";
import { ProfileFormType } from "../Schema";

export interface ProfileFormProps {
  onSubmit: (data: ProfileFormType) => void;
  onReset: () => void;
  error?: ErrorType | null;
  isPending?: boolean;
}

export interface ProfileSummaryCardProps {
  profile?: IMyProfile;
  access?: MyPermissionsResponse;
  isLoading?: boolean;
}
