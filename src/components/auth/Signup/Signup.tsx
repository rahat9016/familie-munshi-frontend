"use client";
import { usePost } from "@/src/hooks/usePost";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SignupForm from "./Form/SignupForm";
import { SignupFormType, signupSchema } from "./Schema";
import SignupBanner from "./SignupBanner";

export default function SignupPage() {
  const router = useRouter();
  const methods = useForm<SignupFormType>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
    },
    mode: "onChange",
  });

  const {
    mutateAsync: signup,
    error,
    reset,
    isPending,
  } = usePost("/auth/signup");

  const onSubmit = (data: SignupFormType) => {
    signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }).then(() => {
      methods.reset();
      reset();
      router.push("/auth/login");
      toast.success("User registered successfully");
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <SignupBanner />
      <div className="flex items-center justify-center px-6">
        <FormProvider {...methods}>
          <SignupForm onSubmit={onSubmit} error={error} isPending={isPending} />
        </FormProvider>
      </div>
    </div>
  );
}
