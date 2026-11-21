"use client";

import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import { isAdminRole } from "@/src/utils/UserRoleEnum";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface GoogleSignInButtonProps {
  label?: string; // Kept for compatibility, though GoogleLogin has its own text
  onSuccess?: (role: string) => void;
}

export default function GoogleSignInButton({
  onSuccess,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  // Google renders the button in an iframe with a fixed pixel width
  // (allowed range 200–400), so size it to the parent's content box.
  const [buttonWidth, setButtonWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setButtonWidth(Math.max(200, Math.min(400, Math.floor(el.clientWidth))));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { mutateAsync: authenticateWithBackend, isPending } = useGoogleAuth(
    (role: string) => {
      if (onSuccess) {
        onSuccess(role);
        return;
      }

      router.push(isAdminRole(role) ? "/admin" : "/");
    }
  );

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      {buttonWidth > 0 && (
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              try {
                await authenticateWithBackend({
                  token: credentialResponse.credential,
                });
              } catch (error) {
                console.error("Backend Google Auth Error:", error);
              }
            }
          }}
          onError={() => {
            toast.error("Google login failed. Please try again.");
          }}
          useOneTap
          theme="outline"
          size="large"
          width={String(buttonWidth)}
        />
      )}
    </div>
  );
}
