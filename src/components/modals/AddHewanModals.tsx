"use client";

import { useState } from "react";

interface User {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  users: User[];
  onSuccess: () => void;
}

export default function AddHewanModal({ open, onClose, users, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [status, setStatus] = useState("ready");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          owner_id: ownerId,
          buy_price: Number(buyPrice),
          sell_price: Number(sellPrice),
          status,
        }),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed dark:text-white inset-0 flex items-center justify-center bg-black/50 z-50">

      <div className="bg-white dark:bg-gray-900 rounded-xl w-[400px] p-6">

        <h2 className="text-lg font-bold mb-4 dark:text-white">
          Add Animal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            placeholder="Animal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
            required
          />

          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
            required
          >
            <option value="">Select Owner</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}

          </select>

          <input
            type="number"
            placeholder="Buy Price"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
          />

          <input
            type="number"
            placeholder="Sell Price"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
          >
            <option value="ready">Ready</option>
            <option value="sold">Sold</option>
          </select>

          <div className="flex justify-end gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}