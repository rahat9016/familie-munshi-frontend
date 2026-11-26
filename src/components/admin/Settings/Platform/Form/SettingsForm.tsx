"use client";

import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import ControlledSwitchField from "@/src/components/shared/FromController/ControlledSwitchField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Building2, Store } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  CURRENCY_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
} from "../data/mockSettingsData";
import { SettingsFormValues } from "../Schema/settingsSchema";
import SettingsSection from "./SettingsSection";

export default function SettingsForm({
  onSubmit,
  onReset,
  isPending = false,
}: {
  onSubmit: (data: SettingsFormValues) => void;
  onReset: () => void;
  isPending?: boolean;
}) {
  const { handleSubmit } = useFormContext<SettingsFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <SettingsSection
        title="General"
        description="Identity and contact details shown across the storefront and emails."
        icon={Building2}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputLabel label="Site Name" required />
              <ControlledInputField
                className="bg-light"
                name="siteName"
                placeholder="Tecgen Store"
              />
            </div>
            <div>
              <InputLabel label="Legal Name" />
              <ControlledInputField
                className="bg-light"
                name="legalName"
                placeholder="Tecgen Soft Ltd."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputLabel label="Support Email" required />
              <ControlledInputField
                className="bg-light"
                name="supportEmail"
                type="email"
                placeholder="support@tecgen.com"
              />
            </div>
            <div>
              <InputLabel label="Support Phone" />
              <ControlledInputField
                className="bg-light"
                name="supportPhone"
                placeholder="+8801…"
              />
            </div>
          </div>

          <div>
            <InputLabel label="Logo URL" />
            <ControlledInputField
              className="bg-light"
              name="logoUrl"
              placeholder="/images/logo.png"
            />
          </div>

          <div>
            <InputLabel label="Description" />
            <ControlledTextareaField
              className="h-24"
              name="description"
              placeholder="Short description used for SEO and email footers"
            />
          </div>

          <ControlledSwitchField
            name="maintenanceMode"
            label="Maintenance Mode"
            description="Storefront shows a maintenance notice. Admin stays reachable."
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Store"
        description="Defaults applied to orders, pricing and shipping."
        icon={Store}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <InputLabel label="Currency" required />
              <ControlledSelectField
                name="currency"
                options={CURRENCY_OPTIONS}
                placeholder="Select currency"
              />
            </div>
            <div>
              <InputLabel label="Timezone" required />
              <ControlledSelectField
                name="timezone"
                options={TIMEZONE_OPTIONS}
                placeholder="Select timezone"
              />
            </div>
            <div>
              <InputLabel label="Language" required />
              <ControlledSelectField
                name="language"
                options={LANGUAGE_OPTIONS}
                placeholder="Select language"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <InputLabel label="Weight Unit" />
              <ControlledSelectField
                name="weightUnit"
                options={WEIGHT_UNIT_OPTIONS}
                placeholder="Select unit"
              />
            </div>
            <div>
              <InputLabel label="Order Prefix" />
              <ControlledInputField
                className="bg-light"
                name="orderPrefix"
                placeholder="ORD"
              />
            </div>
            <div>
              <InputLabel label="Tax Rate (%)" />
              <ControlledInputField
                className="bg-light"
                name="taxRate"
                type="number"
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputLabel label="Free Shipping Threshold" />
              <ControlledInputField
                className="bg-light"
                name="freeShippingThreshold"
                type="number"
                placeholder="3000"
              />
            </div>
          </div>

          <div>
            <InputLabel label="Store Address" />
            <ControlledTextareaField
              className="h-24"
              name="storeAddress"
              placeholder="Street, city, postcode, country"
            />
          </div>
        </div>
      </SettingsSection>

      <div className="flex items-center justify-end gap-4 pb-2">
        <Button
          type="button"
          onClick={onReset}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Reset
        </Button>
        <SubmitButton isLoading={isPending} label="Save Changes" />
      </div>
    </form>
  );
}
