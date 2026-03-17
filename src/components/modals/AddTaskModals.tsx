"use client";

import React, { useState } from "react";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
};

export default function AddTaskModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTaskModalProps) {

  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    if (!name || !date) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, date }),
    });

    setName("");
    setDate("");

    await onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl">

        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Add Task
        </h2>

        <div className="space-y-3">

          <input
            type="text"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg dark:text-white"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:text-white"
          />

        </div>

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  );
}