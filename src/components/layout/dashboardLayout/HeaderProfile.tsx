"use client";

import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { ChevronDown, KeyRound, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import UserSkeleton from "./Skeleton/UserSkeleton";

export default function HeaderProfile() {
  const dispatch = useAppDispatch();
  const {
    userInformation: { firstName, lastName, email, role, profilePicture },
    loading,
  } = useAppSelector((state) => state.auth);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  if (loading) return <UserSkeleton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 md:gap-3 rounded-md px-1 py-1 hover:bg-gray-100 transition-colors"
        >
          <div className="hidden sm:block text-right">
            <h2 className="text-primary font-semibold font-inter text-sm truncate max-w-[10rem]">
              {firstName}
            </h2>
            <p className="text-[#8C8C8C] text-xs font-inter font-normal truncate max-w-[10rem]">
              {role}
            </p>
          </div>
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            {profilePicture ? (
              <AvatarImage src={profilePicture} alt="Profile" />
            ) : (
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Default Profile"
              />
            )}
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="hidden md:block w-4 h-4 text-secondary-dark" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold text-secondary-dark">
            {fullName || "My account"}
          </p>
          {email && <p className="truncate text-xs text-[#8C8C8C]">{email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/settings">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings/permissions">
            <KeyRound className="w-4 h-4" />
            My permissions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => dispatch(logoutUser())}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
