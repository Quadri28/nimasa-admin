import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const GlobalReports = () => {
  const { pathname } = useLocation();
  return (
    <>
      <h4 style={{ fontSize: "18px" }}>Reports</h4>
      <div className="d-flex gap-4 mt-4 header-links">
        <Link
          to=""
          className={
            pathname === "/global-admin-dashboard/reports"
              ? "active-navigator"
              : ""
          }
        >
          Tenant Reports
        </Link>
        <Link
          to="user-details"
          className={
            pathname === "/global-admin-dashboard/reports/user-details"
              ? "active-navigator"
              : ""
          }
        >
          User details report
        </Link>
        <Link
          to="login-status"
          className={
            pathname === "/global-admin-dashboard/reports/login-status"
              ? "active-navigator"
              : ""
          }
        >
          Login status
        </Link>
      </div>
      <div className="card p-3 rounded-4 border-0 mt-3">
        <Outlet />
      </div>
    </>
  );
};

export default GlobalReports;
