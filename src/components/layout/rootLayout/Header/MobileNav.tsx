"use client";

import {
  logoutUser,
  openLoginModal,
} from "@/src/lib/redux/features/auth/authSlice";
import { selectCanAccessAdminPanel } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  Home,
  LayoutGrid,
  LogOut,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import MobileGenderSection from "./MobileGenderSection";
import { type Gender } from "./navLinks";
import MobileNavSkeleton from "./Skeleton/MobileNavSkeleton";
import { useGender } from "./useGender";

interface MobileNavProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileNav({ open, setOpen }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { userInformation } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!userInformation?.firstName;
  // PLATFORM / BRANCH users go to the admin panel, not the customer account.
  const isAdminPanelUser = useAppSelector(selectCanAccessAdminPanel);
  const accountHref = isAdminPanelUser ? "/admin" : "/account";
  const { gender, roots, rootsLoading } = useGender();

  // null = follow the active gender; "" = explicitly collapsed; else a gender.
  const [openGender, setOpenGender] = useState<Gender | null>(null);
  const shownGender = openGender === null ? gender : openGender;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const close = () => setOpen(false);

  return (
    <>
      {/* ═══════ MOBILE BOTTOM NAV ═══════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-14">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 min-w-15 py-1 ${
              pathname === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home size={22} strokeWidth={pathname === "/" ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-15 py-1 ${
              open ? "text-primary" : "text-gray-500"
            }`}
          >
            <LayoutGrid size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Category</span>
          </button>

          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              pathname === "/cart" ? "text-primary" : "text-gray-500"
            }`}
          >
            <ShoppingCart size={22} strokeWidth={pathname === "/cart" ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 min-w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold px-0.5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
          <Link
            href={accountHref}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              pathname?.startsWith(accountHref) ? "text-primary" : "text-gray-500"
            }`}
          >
            {isLoggedIn && userInformation.profilePicture ? (
              <Image
                src={userInformation.profilePicture}
                alt={userInformation.firstName}
                width={24}
                height={24}
                className={`w-6 h-6 rounded-full object-cover ${
                  pathname?.startsWith(accountHref) ? "ring-2 ring-primary" : "ring-1 ring-gray-200"
                }`}
              />
            ) : (
              <User size={22} strokeWidth={pathname?.startsWith(accountHref) ? 2.5 : 1.5} />
            )}
            <span className="text-[10px] font-medium">
              {isLoggedIn ? userInformation.firstName : "Account"}
            </span>
          </Link>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(openLoginModal())}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 text-gray-500"
              aria-label="Sign in"
            >
              <User size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* ═══════ Category Drawer ═══════ */}
      {open && <div className="fixed inset-0 bg-black/50 z-60" onClick={close} />}

      {open && (
        <button
          onClick={close}
          className="fixed z-80 top-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-200"
          style={{ left: "calc(min(320px, 85vw) + 8px)" }}
          aria-label="Close menu"
        >
          <X size={18} className="text-gray-600" />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 z-70 h-screen w-80 max-w-[85vw] bg-white transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 p-4 font-bold text-secondary">
          <LayoutGrid size={18} className="text-primary" /> Categories
        </div>

        {/* Nested accordion: root → parent category → category → segment */}
        <nav className="flex-1 overflow-y-auto p-2">
          {rootsLoading ? (
            <MobileNavSkeleton rows={3} />
          ) : (
            roots.map((root) => {
              const genderOpen = shownGender === root.name;
              return (
                <MobileGenderSection
                  key={root.id}
                  rootId={root.id}
                  name={root.name}
                  open={genderOpen}
                  onToggle={() => setOpenGender(genderOpen ? "" : root.name)}
                  onNavigate={close}
                />
              );
            })
          )}
        </nav>

        <div className="p-4 border-t">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userInformation.profilePicture ? (
                <Image
                  src={userInformation.profilePicture}
                  alt={userInformation.firstName}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {userInformation.firstName} {userInformation.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{userInformation.email}</p>
              </div>
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  close();
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                close();
                router.push("/auth/login");
              }}
              className="w-full bg-primary text-white text-center rounded-md py-2.5 font-medium text-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
}
