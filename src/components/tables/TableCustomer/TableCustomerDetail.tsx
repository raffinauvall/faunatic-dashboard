"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  status_order: string;
  payment_status: string;
  animal_request?: string;
  animals?: {
    name: string;
  };
}

export default function TableCustomerDetail({ id }: { id: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        const data = await res.json();

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border dark:text-white border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">

          <Table>

            {/* HEADER */}
            <TableHeader>
              <TableRow>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Date
                </TableCell>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Type
                </TableCell>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Animal
                </TableCell>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Amount
                </TableCell>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Order Status
                </TableCell>

                <TableCell isHeader className="px-4 py-3 text-start">
                  Payment
                </TableCell>

              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>

                  {/* DATE */}
                  <TableCell className="px-4 py-3">
                    {new Date(tx.transaction_date).toLocaleDateString("id-ID")}
                  </TableCell>

                  {/* TYPE */}
                  <TableCell className="px-4 py-3">
                    {tx.type}
                  </TableCell>

                  {/* ANIMAL */}
                  <TableCell className="px-4 py-3">
                    {tx.animals?.name || tx.animal_request || "-"}
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell className="px-4 py-3">
                    Rp {tx.amount?.toLocaleString()}
                  </TableCell>

                  {/* ORDER STATUS */}
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={
                        tx.status_order === "completed"
                          ? "success"
                          : tx.status_order === "sourcing"
                          ? "warning"
                          : "error"
                      }
                    >
                      {tx.status_order}
                    </Badge>
                  </TableCell>

                  {/* PAYMENT STATUS */}
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={
                        tx.payment_status === "paid"
                          ? "success"
                          : tx.payment_status === "dp"
                          ? "warning"
                          : "error"
                      }
                    >
                      {tx.payment_status}
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