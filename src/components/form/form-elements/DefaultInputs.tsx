"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import TextAreaInput from "./TextAreaInput";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon, TimeIcon } from "../../../icons";
import TextArea from "../input/TextArea";

type FormDataType = {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  date?: string;
  time: string;
};

export default function DefaultInputs() {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "todo",
    date: "",
    time: "",
  });

  const categoryOptions = [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const statusOptions = [
    { value: "todo", label: "Todo" },
    { value: "progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const handleChange = (key: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("TASK DATA:", formData);
  };

  return (
    <ComponentCard title="Create New Task">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Task Title */}
          <div>
            <Label>Task Title</Label>
            <Input
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <TextArea
              placeholder="Write task description..."
              value={formData.description}
              onChange={(e: any) =>
                handleChange("description", e.target.value)
              }
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <div className="relative">
              <Select
                options={categoryOptions}
                placeholder="Select category"
                onChange={(value: string) =>
                  handleChange("category", value)
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Priority */}
          <div>
            <Label>Priority</Label>
            <div className="relative">
              <Select
                options={priorityOptions}
                placeholder="Select priority"
                onChange={(value: string) =>
                  handleChange("priority", value)
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="relative">
              <Select
                options={statusOptions}
                placeholder="Select status"
                onChange={(value: string) =>
                  handleChange("status", value)
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <DatePicker
              id="due-date"
              label="Due Date"
              placeholder="Select due date"
              onChange={(dates, currentDateString) => {
                handleChange("date", currentDateString);
              }}
            />
          </div>

          {/* Due Time */}
          <div>
            <Label>Due Time</Label>
            <div className="relative">
              <Input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  handleChange("time", e.target.value)
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <TimeIcon />
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Create Task
          </button>

        </div>

      </div>
    </ComponentCard>
  );
}