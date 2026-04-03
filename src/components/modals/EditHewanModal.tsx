"use client";

import React, { useEffect, useState } from "react";

interface Hewan {
    id: number;
    name: string;
    status: string;
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void | Promise<void>;
    data: Hewan | null;
};

export default function EditHewanModal({
    isOpen,
    onClose,
    onSuccess,
    data,
}: Props) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setStatus(data.status || "");
        }
    }, [data]);

    useEffect(() => {
        if (!isOpen) {
            setStatus("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!status || !data) return;

        try {
            setLoading(true);

            await fetch(`/api/animals/${data.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    status: status,
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
                    Edit Animal Status
                </h2>

                {/* INPUT */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Animal: {data?.name}
                        </label>
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value="">Select Status</option>
                        <option value="ready">Ready</option>
                        <option value="sold">Sold</option>
                        <option value="dead">Dead</option>
                    </select>
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
