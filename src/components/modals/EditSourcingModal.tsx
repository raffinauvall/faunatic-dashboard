"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  animal_request: string;
  status_order: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  data: Transaction | null;
};

export default function EditSourcingModal({
  isOpen,
  onClose,
  onSuccess,
  data,
}: Props) {
  const [animalRequest, setAnimalRequest] = useState("");
  const [statusOrder, setStatusOrder] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setAnimalRequest(data.animal_request || "");
      setStatusOrder(data.status_order || "");
    }
  }, [data]);


  useEffect(() => {
    if (!isOpen) {
      setAnimalRequest("");
      setStatusOrder("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!animalRequest || !data) return;

    try {
      setLoading(true);

      await fetch(`/api/transactions/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({
          animal_request: animalRequest,
          status_order: statusOrder,
        }),
      });

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Update gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!data) return;

    const confirmed = confirm("Are you sure you want to delete this sourcing request?");
    if (!confirmed) return;

    try {
      setLoading(true);

      await fetch(`/api/transactions/${data.id}`, {
        method: "DELETE",
      });

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Delete gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl p-6 shadow-2xl">

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Edit Sourcing
        </h2>

        {/* INPUT */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Animal request"
            value={animalRequest}
            onChange={(e) => setAnimalRequest(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <select
            value={statusOrder}
            onChange={(e) => setStatusOrder(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select Status</option>
            <option value="sourcing">Sourcing</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ACTION */}
        <div className="flex justify-between gap-2 mt-5">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 dark:text-white rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}