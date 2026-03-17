"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon } from "@/icons";
import { Panda, User } from "lucide-react";

type User = {
  id: number;
  name: string;
  balance: number;
};

type Props = {
  users: User[];
};

export const BalanceKPI = ({ users }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full flex-wrap">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex-1 min-w-[220px] rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <User className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.name}
              </span>

              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                Rp {user.balance?.toLocaleString("id-ID")}
              </h4>
            </div>

            <Badge color="success">
              <ArrowUpIcon />
              Balance
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};