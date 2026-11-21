// components/auth/SignupForm.tsx
"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import GoogleSignInButton from "@/src/components/shared/GoogleSignInButton/GoogleSignInButton";
import InputLabel from "@/src/components/shared/InputLabel";
import { Button } from "@/src/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SignupFormType } from "../Schema";
import { SignupFormProps } from "../types";

export default function SignupForm({
  onSubmit,
  error,
  isPending = false,
}: SignupFormProps) {
  const methods = useFormContext<SignupFormType>();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full max-w-100"
    >
      <h2 className="text-[32px] font-semibold mb-6 text-primary">Sign Up</h2>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <InputLabel label="First Name" required />
          <ControlledInputField
            name="firstName"
            type="text"
            placeholder="Enter first name"
          />
        </div>
        <div>
          <InputLabel label="Last Name" required />
          <ControlledInputField
            name="lastName"
            type="text"
            placeholder="Enter last name"
          />
        </div>
      </div>
      <div className="mb-6">
        <InputLabel label="Email" required />
        <ControlledInputField
          name="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-6">
        <InputLabel label="Password" required />
        <div className="relative">
          <ControlledInputField
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-10"
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-1 right-1 flex items-center text-black bg-transparent hover:bg-transparent shadow-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
      </div>
      <div>
        <InputLabel label="Confirm Password" required />
        <div className="relative">
          <ControlledInputField
            name="rePassword"
            type={showRePassword ? "text" : "password"}
            placeholder="Re-enter your password"
            className="pr-10"
          />
          <Button
            type="button"
            onClick={() => setShowRePassword(!showRePassword)}
            className="absolute inset-y-1 right-1 flex items-center text-black bg-transparent hover:bg-transparent shadow-none"
          >
            {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <ErrorMessage error={error} />
      </div>

      <Button
        disabled={isPending}
        type="submit"
        className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
      >
        {isPending ? "Loading..." : "Sign up"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          or
        </span>
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Sign Up — form is 400px wide to match Google's max button width */}
      <GoogleSignInButton label="Sign up with Google" />

      <p className="mt-6 text-left text-sm text-[#BDBDBD]">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary-light font-medium underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

