"use client";
import AuthBackButton from "../shared/AuthBackButton";
import { useAuth } from "@/src/hooks/useAuth";
import { isAdminRole } from "@/src/utils/UserRoleEnum";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import LoginForm from "./Form/LoginForm";
import LoginBanner from "./LoginBanner";
import { LoginFormType, loginSchema } from "./Schema";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methods = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: login,
    isPending,
    error,
  } = useAuth((_data, { isAdminPanelUser }) => {
    // Only honour same-origin relative redirects; admin routes only for
    // PLATFORM / BRANCH scoped users.
    const redirect = searchParams.get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : null;
    const redirectAllowed =
      safeRedirect && (isAdminPanelUser || !safeRedirect.startsWith("/admin"));

    if (redirectAllowed) {
      router.push(safeRedirect);
    } else if (isAdminPanelUser) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  });

  const onSubmit = (data: LoginFormType) => {
    login(data)
      .then(() => methods.reset())
      .catch(() => {
        // error surfaced via toast + `error` prop
      });
  };

  const handleGoogleSuccess = (role: string) => {
    if (isAdminRole(role)) {
      router.push("/admin");
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative flex items-center justify-center px-6 py-16">
        <AuthBackButton className="absolute top-4 left-4 md:top-6 md:left-6" />
        <FormProvider {...methods}>
          <LoginForm
            onSubmit={onSubmit}
            onGoogleSuccess={handleGoogleSuccess}
            error={error}
            isPending={isPending}
          />
        </FormProvider>
      </div>
      <LoginBanner />
    </div>
  );
}
