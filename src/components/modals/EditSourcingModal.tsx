"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

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

      const res = await fetch(`/api/transactions/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal_request: animalRequest,
        }),
      });

      if (res.ok) {
        await onSuccess();
        onClose();
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] p-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white/90">
        Edit Sourcing
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Update the animal request for this sourcing transaction.
      </p>

      {/* INPUT */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Animal Request
        </label>
        <input
          type="text"
          placeholder="e.g. Sapi Limosin 500kg"
          value={animalRequest}
          onChange={(e) => setAnimalRequest(e.target.value)}
          className="w-full h-11 px-4 py-2.5 border rounded-lg bg-transparent border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>

      {/* ACTION */}
      <div className="flex items-center justify-end gap-3 mt-8">
        <Button variant="outline" onClick={onClose} size="sm">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading} size="sm">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
}
