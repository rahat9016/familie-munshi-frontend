import { ReactNode } from "react";
import SettingsHeader from "./SettingsHeader";
import SettingsTabs from "./SettingsTabs";

/** Shell for /admin/settings/*: header card + tab nav; each tab is its own route. */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-3">
      <SettingsHeader />
      <SettingsTabs />
      {children}
    </div>
  );
}
