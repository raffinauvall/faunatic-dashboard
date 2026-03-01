import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AllTransactionsTable from "@/components/tables/AllTransactionTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Faunatic - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for Faunatic  Tailwind CSS Admin Dashboard Template",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Semua Transaksi" />
      <div className="space-y-6">
        <ComponentCard title="Transaksi">
          <AllTransactionsTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
