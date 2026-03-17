"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddTaskModal from "@/components/modals/AddTaskModals";
import React, { useEffect, useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

const localizer = momentLocalizer(moment);

type Task = {
  id: number;
  name: string;
  date: string;
  status: "todo" | "done";
};

export default function Page() {
  const [openModal, setOpenModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleDone = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );

    await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: task.id,
        status: newStatus,
      }),
    });
  };

  const groupedTasks = tasks.reduce((acc: any, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  const events = tasks.map((task) => ({
    title: `${task.name} (${task.status})`,
    start: new Date(task.date),
    end: new Date(task.date),
    allDay: true,
  }));

  return (
    <div>
      <PageBreadcrumb pageTitle="Team Tasks" />

      {/* HEADER */}
      <div className="flex justify-between mb-6">

        {/* VIEW SWITCH */}
        <div className="flex gap-2 dark:text-white">

          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 rounded-lg ${
              viewMode === "list"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            List
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-2 rounded-lg ${
              viewMode === "calendar"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Calendar
          </button>

        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg"
        >
          Add Task
        </button>

      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-6">

          {sortedDates.map((date) => (
            <div
              key={date}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5"
            >

              {/* DATE */}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {new Date(date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>

              {/* TASK LIST */}
              <div className="space-y-3">

                {groupedTasks[date].map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >

                    <div className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => toggleDone(task)}
                        className="w-4 h-4"
                      />

                      <p
                        className={`text-gray-800 dark:text-white ${
                          task.status === "done"
                            ? "line-through opacity-60"
                            : ""
                        }`}
                      >
                        {task.name}
                      </p>

                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-lg ${
                        task.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.status}
                    </span>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="bg-white dark:bg-gray-900 dark:text-white p-5 rounded-2xl border border-gray-200 dark:border-gray-800">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
          />

        </div>
      )}

      <AddTaskModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
}