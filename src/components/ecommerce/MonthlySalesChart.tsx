"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter } from "next/navigation";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const router = useRouter();
  const [series, setSeries] = useState([
    {
      name: "Animals Sold",
      data: Array(12).fill(0),
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      const monthlySold = Array(12).fill(0);

      data
        .filter((tx: any) => tx.type === "jual_hewan")
        .forEach((tx: any) => {
          const month = new Date(tx.transaction_date).getMonth();
          monthlySold[month] += 1;
        });

      setSeries([
        {
          name: "Animals Sold",
          data: monthlySold,
        },
      ]);
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: "Animals Sold",
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val) => Math.floor(val).toString(),
      },
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    fill: { opacity: 1 },
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Animals Sold
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={() => {
              router.push("/transactions/jual-hewan");
              closeDropdown();
            }}>
              View More
            </DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">

          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />

        </div>
      </div>
    </div>
  );
}