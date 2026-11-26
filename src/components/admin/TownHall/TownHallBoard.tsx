"use client";

import { DataTable, type ColumnDef } from "@/src/components/ui/data-table";
import {
  townHallQuarters,
  townHallSummary,
} from "@/src/data/dashboard/townHallData";
import type { TownHallQuarterRow } from "@/src/types/dashboard/townHall";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Wallet } from "lucide-react";
import { BoardCard, Pill, count, money } from "./boardUtils";

const columns: ColumnDef<TownHallQuarterRow>[] = [
  {
    header: "Seasonal",
    accessorKey: "quarter",
    cell: (value) => (
      <span className="font-semibold text-primary">{value as string}</span>
    ),
  },
  {
    header: "Total Sales",
    accessorKey: "totalSales",
    align: "right",
    cell: (value) => (
      <span className="font-semibold text-secondary-dark">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Total Order Number",
    accessorKey: "totalOrderNumber",
    align: "right",
    cell: (value) => count(value as number),
  },
  {
    header: "Total Customer",
    accessorKey: "totalCustomer",
    align: "right",
    cell: (value) => count(value as number),
  },
  {
    header: "Location Zone",
    accessorKey: "locationZone",
    cell: (value) => <Pill>{value as string}</Pill>,
  },
  {
    header: "Completed Payment",
    accessorKey: "completedPayment",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-emerald-600">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Pending Payment",
    accessorKey: "pendingPayment",
    align: "right",
    cell: (value) => (
      <span className="font-medium text-amber-600">
        {money(value as number)}
      </span>
    ),
  },
  {
    header: "Tax Amount",
    accessorKey: "taxAmount",
    align: "right",
    cell: (value) => money(value as number),
  },
];

export default function TownHallBoard() {
  const { netRevenue, netProfit, year, month } = townHallSummary;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
      <BoardCard
        title="Town Hall Board"
        subtitle="Quarterly sales, payments and tax overview"
        icon={Building2}
        gradient="from-primary to-amber-400"
        className="xl:col-span-3 min-w-0"
      >
        <DataTable<TownHallQuarterRow>
          variant="plain"
          columns={columns}
          data={townHallQuarters}
        />
      </BoardCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
        <SummaryCard
          label="Net Revenue"
          value={netRevenue}
          meta={`Year ${year}`}
          icon={TrendingUp}
          gradient="from-primary to-amber-400"
        />
        <SummaryCard
          label="Net Profit"
          value={netProfit}
          meta={`Month ${month}`}
          icon={Wallet}
          gradient="from-emerald-500 to-teal-400"
        />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  meta,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  meta: string;
  icon: typeof TrendingUp;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden bg-white rounded-lg border border-light-dark shadow-sm p-4 sm:p-5 flex flex-col justify-between"
    >
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-linear-to-br ${gradient} opacity-10`}
      />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <p className="text-xs sm:text-sm font-medium text-secondary-foreground">
          {label}
        </p>
        <div
          className={`w-9 h-9 rounded-md bg-linear-to-br ${gradient} flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="relative z-10 mt-4">
        <h3 className="text-xl sm:text-2xl font-bold text-secondary-dark tracking-tight">
          {money(value)}
        </h3>
        <span className="inline-flex mt-2 items-center rounded-full bg-light border border-light-dark px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
          {meta}
        </span>
      </div>
    </motion.div>
  );
}
