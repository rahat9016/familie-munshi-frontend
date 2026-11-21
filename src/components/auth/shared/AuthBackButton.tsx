"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Back link for the auth pages. Returns to the previous page when the user
 * arrived from within this site; otherwise (direct visit, external link)
 * goes to the storefront home.
 */
export default function AuthBackButton({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    const cameFromThisSite =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin) &&
      window.history.length > 1;

    if (cameFromThisSite) router.back();
    else router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className={`inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer ${className}`}
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
