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

interface Customer {
    id: string;
    name: string;
    phone: string;
    transactions?: any[];
    total_order?: number;
    total_spend?: number;
    last_order?: string | null;
}

export default function CustomerTable() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch("/api/customers");
                const data = await res.json();

                // 🔥 MAPPING DATA
                const mapped = data.map((c: any) => {
                    const jual = c.transactions?.filter(
                        (t: any) => t.type === "jual_hewan"
                    ) || [];

                    const total_spend = jual.reduce(
                        (acc: number, t: any) => acc + (t.amount || 0),
                        0
                    );

                    const last_order = jual
                        .sort(
                            (a: any, b: any) =>
                                new Date(b.transaction_date).getTime() -
                                new Date(a.transaction_date).getTime()
                        )[0]?.transaction_date;

                    return {
                        ...c,
                        total_order: jual.length,
                        total_spend,
                        last_order,
                    };
                });

                setCustomers(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return <div className="p-4">Loading customers...</div>;
    }

    const handleDetail = (id: string) => {
        window.location.href = `/customers/${id}`;
    };

    return (
        <div className="overflow-hidden rounded-xl border dark:text-white border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                    <Table>

                        {/* HEADER */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Customer
                                </TableCell>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Phone
                                </TableCell>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Total Order
                                </TableCell>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Total Spend
                                </TableCell>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Last Order
                                </TableCell>

                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">
                                    Action
                                </TableCell>

                            </TableRow>
                        </TableHeader>

                        {/* BODY */}
                        <TableBody>
                            {customers.map((c) => (
                                <TableRow key={c.id} className="hover:bg-gray-500">

                                    {/* NAME */}
                                    <TableCell className="px-5 py-4 font-medium">
                                        {c.name}
                                    </TableCell>

                                    {/* PHONE */}
                                    <TableCell className="px-5 py-4">
                                        {c.phone || "-"}
                                    </TableCell>

                                    {/* TOTAL ORDER */}
                                    <TableCell className="px-5 py-4">
                                        {c.total_order}
                                    </TableCell>

                                    {/* TOTAL SPEND */}
                                    <TableCell className="px-5 py-4">
                                        Rp {c.total_spend?.toLocaleString()}
                                    </TableCell>

                                    {/* LAST ORDER */}
                                    <TableCell className="px-5 py-4">
                                        {c.last_order
                                            ? new Date(c.last_order).toLocaleDateString("id-ID")
                                            : "-"}
                                    </TableCell>

                                    {/* STATUS (simple insight) */}
                                    <TableCell className="px-5 py-4">
                                        <Badge
                                            size="sm"
                                            color={
                                                c.total_order ?? 0 > 5
                                                    ? "success"
                                                    : c.total_order ?? 0 > 0
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {c.total_order ?? 0 > 5
                                                ? "Loyal"
                                                : c.total_order ?? 0 > 0
                                                    ? "Active"
                                                    : "New"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4">
                                        <button
                                            onClick={() => handleDetail(c.id)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Detail
                                        </button>
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