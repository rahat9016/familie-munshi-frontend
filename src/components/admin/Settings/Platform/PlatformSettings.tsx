"use client";

import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SettingsForm from "./Form/SettingsForm";
import { SettingsFormValues, settingsSchema } from "./Schema";
import { mockAdminSettings } from "./data/mockSettingsData";
import { AdminSettings } from "./types";

const toFormValues = (settings: AdminSettings): SettingsFormValues => ({
  siteName: settings.siteName,
  legalName: settings.legalName,
  supportEmail: settings.supportEmail,
  supportPhone: settings.supportPhone,
  logoUrl: settings.logoUrl,
  description: settings.description,
  maintenanceMode: settings.maintenanceMode,
  currency: settings.currency,
  timezone: settings.timezone,
  language: settings.language,
  weightUnit: settings.weightUnit,
  orderPrefix: settings.orderPrefix,
  taxRate: settings.taxRate,
  freeShippingThreshold: settings.freeShippingThreshold,
  storeAddress: settings.storeAddress,
});

/** Platform-wide store configuration (mock data — no backend yet). */
export default function PlatformSettingsPage() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const [settings, setSettings] = useState<AdminSettings>(mockAdminSettings);

  const methods = useForm<SettingsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(settingsSchema) as any,
    defaultValues: toFormValues(mockAdminSettings),
  });

  const handleSubmit = (values: SettingsFormValues) => {
    const updated: AdminSettings = {
      ...settings,
      ...values,
      updatedAt: new Date().toISOString(),
    };
    setSettings(updated);
    methods.reset(toFormValues(updated));
    toast.success("Settings saved!");
  };

  const handleReset = () => {
    methods.reset(toFormValues(settings));
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-light-dark bg-white py-16 text-center">
        <ShieldAlert className="mb-3 h-8 w-8 text-red-400" />
        <h2 className="text-base font-semibold text-secondary-dark">
          Super admin only
        </h2>
        <p className="mt-1 text-sm text-secondary-gary">
          Platform settings can only be changed by a super admin.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Platform-wide configuration. Changes apply to every branch.
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated{" "}
          {new Date(settings.updatedAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <FormProvider {...methods}>
        <SettingsForm onSubmit={handleSubmit} onReset={handleReset} />
      </FormProvider>
    </div>
  );
}
