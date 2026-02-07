import React from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, Outlet, useLocation } from "react-router-dom";

const AccountManagementRequest = () => {
  const { pathname } = useLocation();
   const data=[
  {menuName:'Registration Request', menuId:'162', url:'/admin-dashboard/request/account-management'},
  {menuName:'Saving Account Request', menuId:'', url:'/admin-dashboard/request/account-management/saving-account-request'},
  {menuName:'Reschedule Saving Request', menuId:'', url:'/admin-dashboard/request/account-management/reschedule-saving-request'},
]
  return (
    <>
       <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
        <Link
          to=""
          className={
            pathname === "/admin-dashboard/request/account-management"
              ? "active-selector"
              : null
          }
        >
          Registration Request
        </Link>
        <Link
          to="saving-account-request"
          className={
            pathname.includes("/admin-dashboard/request/account-management/saving-account-request") ? "active-selector" : null
          }
        >
          Saving Account Request
        </Link>
        <Link
          to="reschedule-saving-request"
          className={
            pathname.includes("/request/account-management/reschedule-saving-request") ? "active-selector" : null
          }
        >
          Reschedule Saving Request
        </Link>
      </ScrollContainer>
      <Outlet />
    </>
  );
};

export default AccountManagementRequest;
