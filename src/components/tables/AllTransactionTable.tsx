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
import { Pencil, Trash2 } from "lucide-react";
import EditTransactionModal from "../modals/transaction/EditTransactionModal";
import { Transaction } from "@/lib/types/entity/transaction";


export default function AllTransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");


  const [form, setForm] = useState({
    owner: "",
    type: "",
    amount: 0,
    transaction_date: ""
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus transaksi ini?")) return;

    try {
      await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error(err)
    }
  };

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsEditOpen(true);
  };
  const handleUpdate = async (form: any) => {
    if (!selectedTx) return;

    try {
      const res = await fetch(`/api/transactions/${selectedTx.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // 🔥 HANDLE ERROR DULU
      if (!res.ok) {
        const text = await res.text();
        console.error("API Error:", text);
        return;
      }

      let updated = null;

      try {
        updated = await res.json();
      } catch (err) {
        console.error("Response bukan JSON");
        return;
      }

      setTransactions((prev) =>
        prev.map((tx) => (tx.id === selectedTx.id ? updated : tx))
      );

      setIsEditOpen(false);
      setSelectedTx(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


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

  const owners = Array.from(
    new Set(transactions.map((tx) => tx.users?.name).filter(Boolean))
  )

  const types = Array.from(
    new Set(transactions.map((tx) => tx.type).filter(Boolean))
  ).sort();


  const filteredTransactions = transactions.filter((tx) => {
    const matchOwner = ownerFilter
      ? tx.users?.name === ownerFilter
      : true;

    const matchType = typeFilter
      ? tx.type === typeFilter
      : true;

    return matchOwner && matchType;
  });


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="p-4 flex gap-3 dark:text-white">
            {/* OWNER */}
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="border px-3 py-2 rounded dark:bg-gray-800"
            >
              <option value="">All Owner</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            {/* TYPE */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border px-3 py-2 rounded dark:bg-gray-800"
            >
              <option value="">All Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
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
                <TableCell isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredTransactions.map((tx) => (
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
                    {new Date(tx.transaction_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="py-3 px-4">
                    <Badge
                      size="sm"
                      color={
                        tx.status_order === "sourcing"
                          ? "warning"
                          : tx.status_order === "completed"
                            ? "success"
                            : "error"
                      }
                    >
                      {tx.status_order}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(tx)}

                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <EditTransactionModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleUpdate}
            transaction={selectedTx}
          />
        </div>
      </div>
    </div>
  );
}