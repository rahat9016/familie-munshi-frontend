"use client";

import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { clearRolePermissions } from "@/src/lib/redux/features/permission/permissionSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfileMenuItems } from "@/src/hooks/useProfileMenuItems";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import ProfileDropdownSkeleton from "./Skeleton/ProfileDropdownSkeleton";

export function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const { userInformation, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  // Admin (PLATFORM / BRANCH) → admin menu only; customers → account menu.
  const { items: menuItems, isAdminPanelUser } = useProfileMenuItems();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearRolePermissions());
  };

  if (loading) {
    return <ProfileDropdownSkeleton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex flex-col items-center gap-0.5  text-gray-600 hover:text-primary transition-colors focus:outline-none cursor-pointer group"
          aria-label="Open profile menu"
        >
          {userInformation.profilePicture ? (
            <Image
              src={userInformation.profilePicture}
              alt={userInformation.firstName}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-primary/30"
            />
          ) : (
            <User
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          )}
          <span className="hidden text-xs lg:block">My Account</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-9999 w-64 shadow-xl rounded-xl bg-white border border-gray-100 p-0 overflow-hidden"
      >
        {/* User info header */}
        <DropdownMenuLabel className="px-4 py-3 bg-gray-50/80">
          <div className="flex items-center gap-3">
            {userInformation.profilePicture ? (
              <Image
                src={userInformation.profilePicture}
                alt={userInformation.firstName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userInformation.firstName} {userInformation.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInformation.email}
              </p>
              {isAdminPanelUser && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  Administration
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />

        {/* Menu Items */}
        <div className="py-1">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <item.icon size={16} className="shrink-0" />
              <span className="text-sm">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="m-0" />

        {/* Logout */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} className="shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
