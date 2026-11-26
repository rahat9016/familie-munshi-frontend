"use client";

import BrandLogo from "../rootLayout/Header/BrandLogo";
// import HeaderActionIcons from "./HeaderActionIcons";
import HeaderNav from "./HeaderNav";
import HeaderProfile from "./HeaderProfile";
import HeaderSearchBar from "./HeaderSearchBar";

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-skeleton">
      <div className="h-16 flex items-center px-3 md:px-6 gap-3 md:gap-6">
        <BrandLogo
          size="sm"
          href="/admin"
          className="shrink-0"
          wordmarkClassName="hidden sm:flex"
        />

        <div className="flex flex-1 min-w-0 justify-center">
          <HeaderSearchBar />
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* <HeaderActionIcons /> */}
          <HeaderProfile />
        </div>
      </div>

      <HeaderNav />
    </header>
  );
}
