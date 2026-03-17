"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddUserModal from "@/components/modals/AddUserModals";
import { BalanceKPI } from "@/components/users/BalanceKpi";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  balance: number;
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);

  // fetch users
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <PageBreadcrumb pageTitle="Semua User" />

      <div className="flex justify-end mb-3">
        <button
          className="border border-black dark:border-gray-800 p-2 rounded-xl dark:text-white"
          onClick={() => setOpenModal(true)}
        >
          Add User +
        </button>
      </div>

      {/* kirim data user ke komponen */}
      <BalanceKPI users={users} />

      <AddUserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchUsers}
      />
    </>
  );
}