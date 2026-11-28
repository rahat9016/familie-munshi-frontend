import StyleTabHeader from "@/src/components/admin/Styles/components/StyleTabHeader";
import { ReactNode } from "react";

export default function StylesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <StyleTabHeader />
      {children}
    </div>
  );
}
