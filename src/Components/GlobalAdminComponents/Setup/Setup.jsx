import React from "react";
import "./Setup.css";
import { Link, Outlet, useLocation } from "react-router-dom";

const Setup = () => {
  const { pathname } = useLocation();
  return (
    <>
      <h3 className="title-head">Setup and configuration</h3>
      <div className="d-flex gap-4 align-items-center mt-4 selector-container">
        <Link
          to=""
          className={
            pathname === "/global-admin-dashboard/set-up"
              ? "active-navigator"
              : "in-active-navigator"
          }
        >
          Manage cooperative
        </Link>
        <Link
          to="manage-bank-account"
          className={
            pathname.includes('/manage-bank-account')
              ? "active-navigator"
              : "in-active-navigator"
          }
        >
          Manage bank account
        </Link>
      </div>
      <Outlet/>
    </>
  );
};

export default Setup;
