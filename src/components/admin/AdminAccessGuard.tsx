"use client";

import AdminPanelSkeleton from "@/src/components/layout/dashboardLayout/Skeleton/AdminPanelSkeleton";
import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { selectCanAccessAdminPanel } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

/**
 * Gates the whole admin panel:
 *  - no access token            → /auth/login?redirect=<current path>
 *  - scope not PLATFORM/BRANCH  → storefront home
 * Permissions come from GET /permissions/me (cached in redux + react-query).
 */
export default function AdminAccessGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasToken, loaded, isLoading, isError } = useRbacPermissions();
  const canAccessAdmin = useAppSelector(selectCanAccessAdminPanel);

  const denied =
    hasToken && !isLoading && (isError || (loaded && !canAccessAdmin));

  useEffect(() => {
    if (!hasToken) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (denied) {
      router.replace("/");
    }
  }, [hasToken, denied, pathname, router]);

  if (!hasToken || !loaded || !canAccessAdmin) return <AdminPanelSkeleton />;

  return <>{children}</>;
}
