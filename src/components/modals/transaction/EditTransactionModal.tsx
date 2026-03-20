"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  users?: {
    id: string;
    name: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  transaction: Transaction | null;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction,
}: Props) {
  const [form, setForm] = useState({
    user_id: "",
    type: "",
    amount: 0,
    transaction_date: "",
  });

  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  // ✅ fetch users (sekali aja biar ga boros)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ set form saat edit
  useEffect(() => {
    if (transaction) {
      setForm({
        user_id: transaction.users?.id || "",
        type: transaction.type,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date.slice(0, 10),
      });
    }
  }, [transaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-6 w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>

        {/* USER DROPDOWN */}
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded 
                     bg-white text-black 
                     dark:bg-gray-800 dark:text-white dark:border-gray-700"
        >
          <option value="">Pilih User</option>

          {users.length === 0 ? (
            <option disabled>Loading...</option>
          ) : (
            users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))
          )}
        </select>

        {/* TYPE */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded 
                     bg-white text-black 
                     dark:bg-gray-800 dark:text-white dark:border-gray-700"
        >
          <option value="deposit">Deposit</option>
          <option value="jual_hewan">Jual Hewan</option>
          <option value="beli_hewan">Beli Hewan</option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded 
                     bg-white text-black 
                     dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        {/* DATE */}
        <input
          type="date"
          name="transaction_date"
          value={form.transaction_date}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded 
                     bg-white text-black 
                     dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        {/* ACTION */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}