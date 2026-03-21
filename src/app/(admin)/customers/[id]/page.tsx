import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableCustomerDetail from "@/components/tables/TableCustomer/TableCustomerDetail";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Faunatic | Customer Detail",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb pageTitle="Customer Detail" />

      <div className="space-y-6">
        <ComponentCard title="Customer Detail">
          <TableCustomerDetail id={id} />
        </ComponentCard>
      </div>
    </div>
  );
}