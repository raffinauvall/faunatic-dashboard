"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  created_at: string;
  users?: {
    name: string;
  };
  animals?: {
    name: string;
  } | null;
}

export default function AllTransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
           <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
  <TableRow>
    <TableCell
      isHeader
      className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
    >
      User
    </TableCell>

    <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      Type
    </TableCell>

    <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      Amount
    </TableCell>

    <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      Date
    </TableCell>

    <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      Status
    </TableCell>
  </TableRow>
</TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
  {transactions.map((tx) => (
    <TableRow key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
      
      {/* USER */}
      <TableCell className="py-3 px-4 text-gray-800 dark:text-white">
        {tx.users?.name || "Unknown"}
      </TableCell>

      {/* TYPE */}
      <TableCell className="py-3 px-4 capitalize">
        <Badge
          size="sm"
          color={
            tx.type === "deposit"
              ? "success"
              : tx.type === "jual_hewan"
              ? "info"
              : tx.type === "beli_hewan"
              ? "warning"
              : "error"
          }
        >
          {tx.type}
        </Badge>
      </TableCell>

      {/* AMOUNT */}
      <TableCell className="py-3 px-4 text-gray-800 dark:text-white">
        Rp {tx.amount?.toLocaleString()}
      </TableCell>

      {/* DATE */}
      <TableCell className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(tx.created_at).toLocaleString()}
      </TableCell>

      {/* STATUS */}
      <TableCell className="py-3 px-4">
        <Badge size="sm" color="success">
          Success
        </Badge>
      </TableCell>

    </TableRow>
  ))}
</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}