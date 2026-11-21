import AdminAccessGuard from "@/src/components/admin/AdminAccessGuard";
import AdminRouteGuard from "@/src/components/admin/AdminRouteGuard";
import DashboardHeader from "@/src/components/layout/dashboardLayout/DashboardHeader";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAccessGuard>
      <div className="flex w-full h-screen overflow-hidden">
        <div className="flex-1 min-w-0 w-full flex flex-col overflow-hidden">
          <div className="w-full overflow-y-auto flex-1 min-h-0 scrollbar-hide bg-light">
            <div className="w-full bg-white">
              <DashboardHeader />
            </div>
            <div className="p-3 sm:p-4 w-full ">
              <AdminRouteGuard>{children}</AdminRouteGuard>
            </div>
          </div>
        </div>
      </div>
    </AdminAccessGuard>
  );
}
