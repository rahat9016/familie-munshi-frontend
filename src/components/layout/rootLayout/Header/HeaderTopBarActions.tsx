"use client";

import { openLoginModal } from "@/src/lib/redux/features/auth/authSlice";
import { IUserInformation } from "@/src/lib/redux/features/auth/authTypes";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { Camera, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import LanguageDropdown from "./LanguageDropdown";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderTopBarActionsProps {
  cartCount: number;
  wishlistCount: number;
  trialRoomCount: number;
  userInformation: IUserInformation;
  authLoading: boolean;
}

export default function HeaderTopBarActions({
  cartCount,
  wishlistCount,
  trialRoomCount,
  userInformation,
  authLoading,
}: HeaderTopBarActionsProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-1 lg:gap-1 shrink-0">
      <LanguageDropdown />

      <Link
        href="/wishlist"
        className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-primary transition-colors group"
      >
        <Heart
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="hidden text-xs lg:block">Wishlist</span>
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href="/trial-room"
        className="relative flex flex-col items-center gap-0.5 px-1 py-1.5  text-gray-600 hover:text-primary transition-colors group"
      >
        <Camera
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="hidden text-xs lg:block">Trial Room</span>
        {trialRoomCount > 0 && (
          <span className="absolute -top-0.5 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
            {trialRoomCount}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        className="relative flex flex-col items-center gap-0.5 px-1 py-1.5  text-gray-600 hover:text-primary transition-colors group"
      >
        <ShoppingBag
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="hidden text-xs lg:block">My Bag</span>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>
{authLoading ? (
        <div className="flex flex-col items-center gap-1 px-2 py-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
          <div className="hidden lg:block w-12 h-2.5 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : userInformation?.firstName ? (
        <ProfileDropdown />
      ) : (
        <button
          type="button"
          onClick={() => dispatch(openLoginModal())}
          className="flex flex-col items-center gap-0.5 px-1 py-1.5 text-gray-600 hover:text-primary transition-colors cursor-pointer group"
          aria-label="Sign in"
        >
          <User
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="hidden text-xs lg:block">Sign In</span>
        </button>
      )}
    </div>
  );
}
