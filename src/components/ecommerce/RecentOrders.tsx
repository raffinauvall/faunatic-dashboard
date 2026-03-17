"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  type: "beli_hewan" | "jual_hewan";
  amount: number;
  animals?: {
    name: string;
  };
};

export default function RecentOrders() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      const filtered = data.filter(
        (t: Transaction) =>
          t.type === "beli_hewan" || t.type === "jual_hewan"
      );

      setTransactions(filtered.slice(0, 5)); // ambil 5 terbaru
    };

    fetchTransactions();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Animal Transactions
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>

          {/* HEADER */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>

              <TableCell
                isHeader
                className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Animal
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Transaction
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>

            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">

            {transactions.map((tx) => (
              <TableRow key={tx.id}>

                {/* ANIMAL */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">

             

                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {tx.animals?.name ?? "Animal"}
                    </p>

                  </div>
                </TableCell>

                {/* TYPE */}
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {tx.type === "beli_hewan" ? "Buy Animal" : "Sell Animal"}
                </TableCell>

                {/* AMOUNT */}
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  Rp {tx.amount?.toLocaleString()}
                </TableCell>

                {/* STATUS */}
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      tx.type === "jual_hewan"
                        ? "success"
                        : "warning"
                    }
                  >
                    {tx.type === "jual_hewan" ? "Sold" : "Purchased"}
                  </Badge>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>
    </div>
  );
}