import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import BeliHewanTable from "@/components/tables/BeliHewanTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Faunatic - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for Faunatic  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BeliHewanTransaction() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Transaksi" />
      <div className="space-y-6">
        <ComponentCard title="Transaksi Beli Hewan">
          <BeliHewanTable />
        </ComponentCard>
      </div>
    </div>
  );
}
