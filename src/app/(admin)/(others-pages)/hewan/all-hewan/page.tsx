import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HewanTable from "@/components/tables/TableHewan/TableHewan";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Faunatic.id | Stok Hewan",
  description:
    "This is Next.js Basic Table  page for Faunatic  Tailwind CSS Admin Dashboard Template",
};

export default function AllTransactionPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Semua Hewan" />
      <div className="space-y-6">
        <ComponentCard title="Hewan">
          <HewanTable/>
        </ComponentCard>
      </div>
    </div>
  );
}
