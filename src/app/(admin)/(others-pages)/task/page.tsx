"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";

type Task = {
  id: number;
  title: string;
  status: "todo" | "progress" | "done";
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Design Landing Page", status: "todo" },
    { id: 2, title: "Fix Authentication Bug", status: "progress" },
    { id: 3, title: "Deploy to VPS", status: "done" },
  ]);

  const moveTask = (id: number, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const renderColumn = (
    title: string,
    status: Task["status"],
    color: string
  ) => (
    <div className="w-full md:w-1/3">
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <h2 className={`text-lg font-semibold mb-4 ${color}`}>
          {title}
        </h2>

        <div className="space-y-3">
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800 dark:text-white">
                  {task.title}
                </p>

                <div className="flex gap-2 mt-3 text-sm">
                  {status !== "todo" && (
                    <button
                      onClick={() => moveTask(task.id, "todo")}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80"
                    >
                      Todo
                    </button>
                  )}
                  {status !== "progress" && (
                    <button
                      onClick={() => moveTask(task.id, "progress")}
                      className="px-2 py-1 rounded bg-blue-500 text-white hover:opacity-80"
                    >
                      Progress
                    </button>
                  )}
                  {status !== "done" && (
                    <button
                      onClick={() => moveTask(task.id, "done")}
                      className="px-2 py-1 rounded bg-green-500 text-white hover:opacity-80"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Kanban Board" />

      <div className="flex flex-col md:flex-row gap-6">
        {renderColumn("Todo", "todo", "text-gray-700 dark:text-gray-300")}
        {renderColumn("In Progress", "progress", "text-blue-500")}
        {renderColumn("Done", "done", "text-green-500")}
      </div>
    </div>
  );
}