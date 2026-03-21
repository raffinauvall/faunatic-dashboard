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
import AddHewanModal from "@/components/modals/AddHewanModals";

interface Hewan {
  id: number;
  name: string;
  status: string;
  buy_date?: string;
  sell_date?: string;
  users?: {
    name: string;
  };
  buy_price: number;
  sell_price: number;
  profit: number;
}

export default function HewanTable() {
  const [animals, setAnimals] = useState<Hewan[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [openModals, setOpenModals] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await fetch("/api/animals");
        const data = await res.json();

        const withData = data.map((a: any) => {
          const buyTx = a.transactions
            ?.filter((t: any) => t.type === "beli_hewan")
            ?.sort(
              (a: any, b: any) =>
                new Date(b.transaction_date).getTime() -
                new Date(a.transaction_date).getTime()
            )[0];

          const sellTx = a.transactions
            ?.filter((t: any) => t.type === "jual_hewan")
            ?.sort(
              (a: any, b: any) =>
                new Date(b.transaction_date).getTime() -
                new Date(a.transaction_date).getTime()
            )[0];

          return {
            ...a,
            profit: (a.sell_price || 0) - (a.buy_price || 0),
            buy_date: buyTx?.transaction_date || null,
            sell_date: sellTx?.transaction_date || null,
          };
        });

        setAnimals(withData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const owners = [
    ...new Set(
      animals.map((a) => a.users?.name).filter(Boolean)
    ),
  ];

  const filteredAnimals =
    ownerFilter === "all"
      ? animals
      : animals.filter((a) => a.users?.name === ownerFilter);

  const sortAnimals = (data: Hewan[]) => {
    return [...data].sort((a, b) =>
      (a.users?.name || "").localeCompare(b.users?.name || "")
    );
  };


  const readyAnimals = sortAnimals(
    filteredAnimals.filter((a) => a.status === "ready")
  );

  const soldAnimals = sortAnimals(
    filteredAnimals.filter((a) => a.status === "sold")
  );

  const totalProfit = soldAnimals.reduce(
    (acc, a) => acc + (a.profit || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">
        Loading animals...
      </div>
    );
  }

  const TableUI = (data: Hewan[]) => (
    <div className="overflow-hidden dark:text-white rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 mb-8">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">

          <Table>
            <TableHeader className="border-b text-start border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800">
              <TableRow>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Animal
                </TableCell>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Buy Price
                </TableCell>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Buy Date
                </TableCell>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Sell Price
                </TableCell>
                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Sell Date
                </TableCell>
                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Profit
                </TableCell>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Status
                </TableCell>

                <TableCell isHeader className="px-5 text-start py-3 text-xs font-semibold uppercase">
                  Owner
                </TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.map((animal) => (
                <TableRow key={animal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                  <TableCell className="py-3 px-4 font-medium">
                    {animal.name}
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    Rp {(animal.buy_price || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {animal.buy_date
                      ? new Date(animal.buy_date).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    Rp {(animal.sell_price || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {animal.sell_date
                      ? new Date(animal.sell_date).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell
                    className={`py-3 px-4 font-semibold ${animal.profit >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    Rp {(animal.profit || 0).toLocaleString()}
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <Badge
                      size="sm"
                      color={animal.status === "sold" ? "success" : "warning"}
                    >
                      {animal.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    {animal.users?.name || "Unknown"}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

        </div>
      </div>
    </div>
  );

  // ======================
  // RENDER
  // ======================
  return (
    <div>

      {/* FILTER */}
      <div className="flex justify-between">
        <div className="mb-4">
          <select
            className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
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

        <button
          onClick={() => setOpenModals(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Animal
        </button>
      </div>

      {/* READY */}
      <h2 className="text-lg font-bold mb-3 dark:text-white">
        Ready Animals
      </h2>
      {TableUI(readyAnimals)}

      {/* SOLD */}
      <h2 className="text-lg font-bold mb-3 dark:text-white">
        Sold Animals
      </h2>
      {TableUI(soldAnimals)}

      {/* PROFIT */}
      <div className="text-right text-lg font-bold text-green-600">
        Total Profit: Rp {totalProfit.toLocaleString()}
      </div>

      <AddHewanModal
        open={openModals}
        onClose={() => setOpenModals(false)}
        users={users}
        onSuccess={() => location.reload()}
      />
    </div>
  );
}