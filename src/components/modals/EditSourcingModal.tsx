"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  animal_request: string;
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setAnimalRequest(data.animal_request || "");
    }
  }, [data]);


  useEffect(() => {
    if (!isOpen) {
      setAnimalRequest("");
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
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-5">
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
  );
}