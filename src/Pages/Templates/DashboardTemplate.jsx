import React, { useState } from "react";
import DashHome from "../../Components/DashboardComponents/Dashboard";
import Sidebar from "../../Components/DashboardComponents/Sidebar";
import './DashboardTemplate.css'
import { Outlet } from "react-router-dom";
import Nav from "../../Components/DashboardComponents/Nav";

const DashboardTemplate = () => {

  const [showSidebar, setShowSidebar] = useState(false);

  const handleShowNavbar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div>
    <Nav handleShowSidebar={handleShowNavbar} showSidebar={showSidebar} style={{fontFamily:'DM Sans'}}/>
      <div className="dashboard-template-container"  style={{fontFamily:'DM Sans'}}>
          <div className={showSidebar ? 'show-sidebar': 'layout'}>
            <Sidebar showSidebar={showSidebar} />
          </div>
        <div className="body-container" style={{fontFamily:'DM Sans', flexGrow:'1'}}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
