import SettingsLayout from "@/src/components/admin/Settings/Settings";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
