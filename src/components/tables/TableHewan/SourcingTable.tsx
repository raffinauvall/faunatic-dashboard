"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { Pencil } from "lucide-react";
import EditSourcingModal from "@/components/modals/EditSourcingModal";

interface Transaction {
  id: number;
  animal_request: string;
  status_order: string;
  users?: {
    name: string;
  };
}

export default function SourcingTable() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transactions");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const owners = [
    ...new Set(data.map((d) => d.users?.name).filter(Boolean)),
  ];

  const filtered =
    ownerFilter === "all"
      ? data
      : data.filter((d) => d.users?.name === ownerFilter);

  const sourcingData = filtered
    .filter((d) => d.status_order === "sourcing")
    .sort((a, b) =>
      (a.users?.name || "").localeCompare(b.users?.name || "")
    );

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const handleEdit = (item: Transaction) => {
    setSelected(item);
    setOpenModal(true);
  }

  return (
    <div>
      {/* FILTER OWNER */}
      <div className="mb-4 dark:text-white">
        <select
          className=" border-gray-800 px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
        >
          <option value="all">All Owners</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border-gray-900 bg-white dark:bg-gray-900 dark:text-white   ">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">

            <Table>
              <TableHeader className="p-3">
                <TableRow className="dark:bg-gray-800 dark:text-dark-600">
                  <TableCell isHeader className="text-start ps-4 pt-3 pb-3 text-xs font-semibold uppercase">Animal Request</TableCell>
                  <TableCell isHeader className="text-start ps-4 pt-3 pb-3 text-xs font-semibold uppercase">Status</TableCell>
                  <TableCell isHeader className="text-start ps-4 pt-3 pb-3 text-xs font-semibold uppercase">Owner</TableCell>
                  <TableCell isHeader className="text-start ps-4 pt-3 pb-3 text-xs font-semibold uppercase">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sourcingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="ps-4 pt-3 pb-3">{item.animal_request}</TableCell>

                    <TableCell className="ps-4 pt-3 pb-3">
                      <Badge size="sm" color="warning">
                        {item.status_order}
                      </Badge>
                    </TableCell>

                    <TableCell className="ps-4 pt-3 pb-3">
                      {item.users?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="ps-4 pt-3 pb-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-700 rounded"
                      >
                        <Pencil size={16}/>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      <EditSourcingModal 
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      onSuccess={fetchData}
      data={selected}
      />
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {sourcingData.length === 0 && (
        <div className="text-center mt-6 text-gray-500">
          Tidak ada request sourcing
        </div>
      )}


    </div>
  );
}