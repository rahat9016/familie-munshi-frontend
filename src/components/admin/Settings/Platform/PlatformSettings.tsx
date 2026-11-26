"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SettingsForm from "./Form/SettingsForm";
import { SettingsFormValues, settingsSchema } from "./Schema/settingsSchema";
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

export default function SettingsPanel() {
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

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-secondary">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Platform-wide configuration. Changes apply to every branch.
          </p>
        </div>
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
