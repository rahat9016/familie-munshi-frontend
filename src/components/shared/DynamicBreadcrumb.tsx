"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

interface DynamicBreadcrumbProps {
  /** Overrides the label of the last segment — detail routes carry an internal
   *  id in the URL that means nothing to the reader. */
  currentLabel?: string;
}

export default function DynamicBreadcrumb({
  currentLabel,
}: DynamicBreadcrumbProps = {}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isAdminRoute = segments[0] === "admin";

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs md:text-sm text-secondary-gary">
        {!isAdminRoute && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          const showSeparator = !isAdminRoute || index !== 0;
          const isAdminSegment = segment === "admin";

          const label =
            isLast && currentLabel ? currentLabel : decodeURIComponent(segment);

          const className = `capitalize ${
            isAdminSegment ? "text-primary font-semibold" : ""
          }`;

          return (
            <BreadcrumbItem key={href}>
              {showSeparator && <BreadcrumbSeparator />}

              {isLast ? (
                <BreadcrumbPage className={className}>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href} className={className}>
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
