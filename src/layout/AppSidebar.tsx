"use client";
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "../icons/index";
import { Calendar, User } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Stock",
    icon: <GridIcon />,
    subItems: [{ name: "Hewan", path: "/hewan/all-hewan" }],
  },
  {
    name: "Transaction",
    icon: <GridIcon />,
    subItems: [
      { name: "All Transactions", path: "/transactions/all-transactions" },
      { name: "Deposit", path: "/transactions/deposit" },
      { name: "Beli Hewan", path: "/transactions/beli-hewan" },
      { name: "Jual Hewan", path: "/transactions/jual-hewan" },
      { name: "Add Transaction", path: "/transactions/transaction-form" },
    ],
  },
  {
    name: "Task",
    icon: <GridIcon />,
    path: "/task"
  },

  {
    name: "User", 
    icon: <User />,
    path: "/user"

  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } =
    useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number;
  } | null>(null);

  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  useEffect(() => {
    let matched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ index });
            matched = true;
          }
        });
      }
    });

    if (!matched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev && prev.index === index ? null : { index }
    );
  };

  /* =========================
     RENDER MENU
  ========================== */
  const renderMenuItems = () => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group ${
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span>{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">
                    {nav.name}
                  </span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto transition-transform duration-200 ${
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>

              {/* SUBMENU — FIXED */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSubmenu?.index === index
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="mt-2 ml-9 space-y-1">
                    {nav.subItems?.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${
                            pathname === subItem.path
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item ${
                  isActive(nav.path)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span>{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen px-5
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 z-50
        ${
          isExpanded || isHovered || isMobileOpen
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() =>
        !isExpanded && setIsHovered(true)
      }
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div className="py-8 flex">
        <Link href="/">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs uppercase text-gray-400 flex items-center">
            {(isExpanded || isHovered || isMobileOpen)
              ? "Menu"
              : <HorizontaLDots />}
          </h2>

          {renderMenuItems()}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;