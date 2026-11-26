"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import {
  IMyProfile,
  USERS_ME_ENDPOINT,
  USERS_ME_QUERY_KEY,
} from "@/src/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ProfileFormModal from "./ProfileFormModal";
import { ProfileFormType, profileSchema } from "./Schema";
import { ProfileSettingsProps } from "./types";
import { toFormValues, toUpdatePayload } from "./utils/profileFormData";

/** Self-service profile edit: GET + PATCH /users/me. */
export default function ProfileSettingsPage({
  isOpen,
  onClose,
}: ProfileSettingsProps) {
  const methods = useForm<ProfileFormType>({
    resolver: yupResolver(profileSchema) as Resolver<ProfileFormType>,
    defaultValues: toFormValues(),
  });

  // Same key as UserFetcher → cached; refreshing it updates the header too.
  const { data, isLoading } = useGet<IMyProfile>(
    USERS_ME_ENDPOINT,
    USERS_ME_QUERY_KEY,
    undefined,
    { enabled: isOpen, staleTime: 5 * 60 * 1000 }
  );
  const profile = data?.data;

  const {
    mutateAsync: updateProfile,
    isPending,
    error,
    reset: resetUpdate,
  } = usePatch<IMyProfile>(undefined, [USERS_ME_QUERY_KEY]);

  useEffect(() => {
    if (isOpen && profile) {
      methods.reset(toFormValues(profile));
      resetUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, profile]);

  const onSubmit = (values: ProfileFormType) => {
    if (!profile) return;

    const payload = toUpdatePayload(profile, values);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    updateProfile({ url: USERS_ME_ENDPOINT, data: { ...payload } })
      .then(() => {
        toast.success("Profile updated successfully");
        onClose();
      })
      // usePatch already toasts; 400 validation errors render in the form.
      .catch(() => undefined);
  };

  return (
    <FormProvider {...methods}>
      <ProfileFormModal
        isOpen={isOpen}
        onSubmit={onSubmit}
        onCancel={onClose}
        email={profile?.email}
        isLoading={isLoading && !profile}
        error={error}
        isPending={isPending}
      />
    </FormProvider>
  );
}
