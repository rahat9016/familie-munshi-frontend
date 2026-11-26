"use client";

import { townHallSummary } from "@/src/data/dashboard/townHallData";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { motion } from "framer-motion";
import { CalendarDays, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

/** Morning / afternoon / evening — resolved after mount to keep SSR markup stable */
function useGreeting() {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return greeting;
}

function useToday() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return today;
}

export default function DashboardWelcome() {
  const {
    userInformation: { firstName, role },
  } = useAppSelector((state) => state.auth);
  const greeting = useGreeting();
  const today = useToday();
  const { year, month } = townHallSummary;

  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-lg border border-light-dark bg-linear-to-r from-primary to-amber-400 px-5 sm:px-7 py-5 sm:py-6 shadow-sm"
    >
      <div className="absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/15" />
      <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-white/80">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wide">
              {role || "Super Admin"} · Town Hall Board
            </span>
          </div>

          <h1 className="mt-2 text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-white tracking-tight truncate">
            {greeting}
            {firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/85">
            Welcome to your dashboard — company wide performance at a glance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {today && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white">
              <CalendarDays className="h-3.5 w-3.5" />
              {today}
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-primary shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Period {month}/{year}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
