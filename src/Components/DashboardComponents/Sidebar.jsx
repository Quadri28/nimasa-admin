import React, { useContext, useState } from "react";
import "./Style.css";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineSupport, HiSupport } from "react-icons/hi";
import { RiDashboardFill, RiDashboardLine } from "react-icons/ri";
import {
  MdDns,
  MdForum,
  MdGroups,
  MdHowToVote,
  MdInventory2,
  MdOutlineDns,
  MdOutlineForum,
  MdOutlineGroups,
  MdOutlineHowToVote,
  MdOutlineInventory2,
  MdOutlineSavings,
  MdOutlineSpaceDashboard,
  MdPieChart,
  MdPieChartOutline,
  MdSavings,
  MdSpaceDashboard,
} from "react-icons/md";
import {
  HiBellAlert,
  HiInboxStack,
  HiOutlineInboxStack,
} from "react-icons/hi2";
import "./Sidebar.css";
import { AiFillSetting, AiOutlineSetting } from "react-icons/ai";
import { PiChartLineUpFill, PiChartLineUpLight } from "react-icons/pi";
import { BsDatabase, BsDatabaseFill } from "react-icons/bs";
import { UserContext } from "../AuthContext";

function Sidebar() {
  const { pathname } = useLocation();
  const { credentials } = useContext(UserContext);

  const menus = [
    {
      menuName: "Configurations",
      menuId: "1",
      category: "",
      url: "/admin-dashboard/configurations",
      icon1: <AiFillSetting />,
      icon2: <AiOutlineSetting />,
    },
    {
      menuName: "Admin Tasks",
      menuId: "2",
      category: "",
      url: "/admin-dashboard/admin-tasks",
      icon1: <MdSpaceDashboard />,
      icon2: <MdOutlineSpaceDashboard />,
    },
    {
      menuName: "Communications",
      menuId: "245",
      category: "",
      url: "/admin-dashboard/communications",
      icon1: <AiFillSetting />,
      icon2: <AiOutlineSetting />,
    },
    {
      menuName: "Member Management",
      menuId: "3",
      category: "Operations",
      url: "/admin-dashboard/member-management",
      icon1: <MdGroups />,
      icon2: <MdOutlineGroups />,
    },
    {
      menuName: "Accounting",
      menuId: "4",
      category: "Operations",
      url: "/admin-dashboard/accounting",
      icon1: <MdDns />,
      icon2: <MdOutlineDns />,
    },
    {
      menuName: "Elections",
      menuId: "400",
      category: "Operations",
      url: "/admin-dashboard/elections",
      icon1: <MdHowToVote />,
      icon2: <MdOutlineHowToVote />,
    },
    {
      menuName: "Reports",
      menuId: "7",
      category: "Operations",
      url: "/admin-dashboard/report",
      icon1: <MdPieChart />,
      icon2: <MdPieChartOutline />,
    },
    {
      menuName: "Request",
      menuId: "161",
      category: "Operations",
      url: "/admin-dashboard/request",
      icon1: <HiInboxStack />,
      icon2: <HiOutlineInboxStack />,
    },
    {
      menuName: "Inventory Management",
      category: "Assets Management And Inventory",
      menuId: "163",
      url: "/admin-dashboard/inventory-management",
      icon1: <MdInventory2 />,
      icon2: <MdOutlineInventory2 />,
    },
    {
      menuName: "Loan Management",
      category: "Assets Management And Inventory",
      menuId: "6",
      url: "/admin-dashboard/loan-management",
      icon1: <MdSavings />,
      icon2: <MdOutlineSavings />,
    },
    {
      menuName: "Investment",
      category: "Assets Management And Inventory",
      menuId: "181",
      url: "/admin-dashboard/investments",
      icon1: <PiChartLineUpFill />,
      icon2: <PiChartLineUpLight />,
    },
    {
      menuName: "Shares Management",
      category: "Assets Management And Inventory",
      menuId: "236",
      url: "/admin-dashboard/shares-management",
      icon1: <BsDatabaseFill />,
      icon2: <BsDatabase />,
    },
    {
      menuName: "Supports",
      category: "Support",
      menuId: "250",
      url: "/admin-dashboard/support",
      icon1: <HiSupport />,
      icon2: <HiOutlineSupport />,
    },
  ];
  const sideMenuPermissions = credentials?.logInfo?.sideMenuPermissions;


  const groupedMenus = menus.reduce((acc, item) => {
    const hasPermission = sideMenuPermissions?.some(
      (p) => p.menuId === item.menuId
    );
    if (!hasPermission) return acc;

    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white sidebar p-3">
      <div className="mb-2">
        <span
          className="brand-name text-uppercase"
          style={{ fontSize: "12px" }}
        >
          System settings and management
        </span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush gap-2">
        <Link
          to="/admin-dashboard"
          className={
            pathname === "/admin-dashboard" ? `py-2 ${"active-sidebar-link"}` : "py-2"
          }
        >
          {pathname === "/admin-dasboard" ? <RiDashboardFill /> : <RiDashboardLine />}
          <span>General Overview</span>
        </Link>
        {Object.entries(groupedMenus).map(([category, items]) => (
          <React.Fragment key={category}>
            <span className="text-uppercase brand-name">{category}</span>
            {items.map((menu) => {
              const isActive =
                pathname === menu.url || pathname.startsWith(menu.url + "/");
              return (
                <Link
                  to={menu.url}
                  key={menu.menuId}
                  className={`py-2 ${isActive ? "active-sidebar-link" : ""}`}
                >
                  {isActive ? menu.icon1 : menu.icon2}
                  <span>{menu.menuName}</span>
                </Link>
              );
            })}
          </React.Fragment>
        ))}
        <Link
          to="notifications"
          className="active-sidebar-link py-2 px-3 mt-4"
          style={{ backgroundColor: "#0452C8" }}
        >
          <HiBellAlert size={18} /> Notifications
        </Link>
      </div>
    </div>
  );
}
export default Sidebar;
