import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Communication.css";
import ScrollContainer from "react-indiana-drag-scroll";

const Communications = () => {

  const location = useLocation();
  useEffect(()=>{
    if (typeof window !== 'undefined') {
    window.scrollTo(0, 0) }
},[])
  return (
    <div>
      <h4 className="fs-5">Communications</h4>
      <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
        <Link
          to="broadcast"
          className={
            location.pathname === "/admin-dashboard/communications/broadcast" 
            || location.pathname=== '/admin-dashboard/communications' 
            || location.pathname === '/admin-dashboard/communications/broadcast/broadcast-message'
              ? "active-selector"
              : null
          }
        >
          Broadcast
        </Link>
        {/* <Link
          to="manage-sms"
          className={
            location.pathname === "/communications/manage-sms" 
              ? "active-selector"
              : null
          }
        >
          Manage SMS
        </Link>
        <Link
          to="buy-sms"
          className={
            location.pathname === "/communications/buy-sms"
              ? "active-selector"
              : null
          }
        >
          Buy SMS
        </Link>
        <Link
          to="sms-reports"
          className={
            location.pathname === "/communications/sms-reports"
              ? "active-selector"
              : null
          }
        >
          SMS Report
        </Link> */}
      </ScrollContainer>
      <Outlet />
    </div>
  );
};

export default Communications;
