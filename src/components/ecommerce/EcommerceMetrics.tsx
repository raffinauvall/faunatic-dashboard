"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine } from "@/icons";
import { Panda } from "lucide-react";

export const EcommerceMetrics = () => {
  const [animalsCount, setAnimalsCount] = useState(0);
  const [jualCount, setJualCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const animalsRes = await fetch("/api/animals");
      const animalsData = await animalsRes.json();
      setAnimalsCount(animalsData.length);

      const txRes = await fetch("/api/transactions");
      const txData = await txRes.json();

      const jualOnly = txData.filter(
        (tx: any) => tx.type === "jual_hewan"
      );

      setJualCount(jualOnly.length);

      const total = jualOnly.reduce(
        (acc: number, tx: any) => acc + (tx.amount || 0),
        0
      );

      setTotalProfit(total);
    };

    fetchData();
  }, []);

  return (
  <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
    
    {/* CARD 1 */}
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <Panda className="text-gray-800 size-6 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Animals
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {animalsCount}
          </h4>
        </div>
      </div>
    </div>

    {/* CARD 2 */}
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <BoxIconLine className="text-gray-800 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Jual Hewan
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {jualCount}
          </h4>
        </div>

        <Badge color="success">
          <ArrowUpIcon />
          Active
        </Badge>
      </div>
    </div>

    {/* CARD 3 */}
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <BoxIconLine className="text-gray-800 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Penjualan
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            Rp {totalProfit.toLocaleString()}
          </h4>
        </div>

        <Badge color="success">
          <ArrowUpIcon />
          Revenue
        </Badge>
      </div>
    </div>

  </div>
);
};