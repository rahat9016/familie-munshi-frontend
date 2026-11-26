"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import {
  IMyProfile,
  USERS_ME_ENDPOINT,
  USERS_ME_QUERY_KEY,
} from "@/src/types/user";
import {
  MyPermissionsResponse,
  PERMISSIONS_ME_ENDPOINT,
  RBAC_QUERY_KEY,
} from "@/src/utils/rbac";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ProfileForm from "./Form/ProfileForm";
import ProfileSummaryCard from "./ProfileSummaryCard";
import { ProfileFormType, profileSchema } from "./Schema";
import {
  toFormValues,
  toProfileFormData,
  toUpdatePayload,
} from "./utils/profileFormData";

const STALE_TIME = 5 * 60 * 1000;

/** Settings → Profile: GET + PATCH (multipart) /users/me. */
export default function ProfilePage() {
  const methods = useForm<ProfileFormType>({
    resolver: yupResolver(profileSchema) as Resolver<ProfileFormType>,
    defaultValues: toFormValues(),
  });

  // Same keys as UserFetcher / useRbacPermissions → served from cache, and
  // refreshing users-me after save also updates the header avatar + name.
  const { data, isLoading } = useGet<IMyProfile>(
    USERS_ME_ENDPOINT,
    USERS_ME_QUERY_KEY,
    undefined,
    { staleTime: STALE_TIME }
  );
  const { data: accessRes } = useGet<MyPermissionsResponse>(
    PERMISSIONS_ME_ENDPOINT,
    RBAC_QUERY_KEY,
    undefined,
    { staleTime: STALE_TIME }
  );
  const profile = data?.data;

  const {
    mutateAsync: updateProfile,
    isPending,
    error,
    reset: resetUpdate,
  } = usePatch<IMyProfile>(undefined, [USERS_ME_QUERY_KEY]);

  // Sync form with the server copy (initial load + after each save).
  useEffect(() => {
    if (profile) methods.reset(toFormValues(profile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = (values: ProfileFormType) => {
    if (!profile) return;

    const payload = toUpdatePayload(profile, values);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      return;
    }

    updateProfile({ url: USERS_ME_ENDPOINT, data: toProfileFormData(payload) })
      .then(() => toast.success("Profile updated successfully"))
      // usePatch already toasts; 400 validation errors render in the form.
      .catch(() => undefined);
  };

  const onReset = () => {
    resetUpdate();
    methods.reset(toFormValues(profile));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start">
      <ProfileSummaryCard
        profile={profile}
        access={accessRes?.data}
        isLoading={isLoading}
      />

      <div className="xl:col-span-2 min-w-0">
        <FormProvider {...methods}>
          <ProfileForm
            onSubmit={onSubmit}
            onReset={onReset}
            error={error}
            isPending={isPending || (isLoading && !profile)}
          />
        </FormProvider>
      </div>
    </div>
  );
}
