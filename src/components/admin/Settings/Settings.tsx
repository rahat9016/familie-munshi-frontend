import { ReactNode } from "react";
import SettingsTabs from "./SettingsTabs";

/** Shell for /admin/settings/*: heading + tab nav; each tab is its own route. */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-3">
      <div>
        <h1 className="text-xl font-semibold text-secondary">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your profile and see what you have access to.
        </p>
      </div>
      <SettingsTabs />
      {children}
    </div>
  );
}
