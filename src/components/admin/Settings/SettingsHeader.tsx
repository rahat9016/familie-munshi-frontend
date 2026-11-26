"use client";

import TableTopBarHeader from "@/src/components/shared/TableTopBarHeader";
import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SETTINGS_BASE_PATH, SETTINGS_TABS } from "./SettingsTabs";

/** Page header card — same look as every other admin page (icon · title · breadcrumb). */
export default function SettingsHeader() {
  const pathname = usePathname();
  // Readable last breadcrumb segment for sub-tabs ("permissions" → "My permissions").
  const currentTab = SETTINGS_TABS.find(
    (t) => t.href !== SETTINGS_BASE_PATH && pathname.startsWith(t.href)
  );

  return (
    <div className="bg-white border border-light-dark rounded-lg px-5 py-4">
      <TableTopBarHeader
        title="Settings"
        icon={<Settings />}
        currentLabel={currentTab?.label}
      />
    </div>
  );
}
