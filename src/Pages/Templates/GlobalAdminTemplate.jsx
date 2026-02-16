import React, { useState } from 'react'
import GlobalNav from '../../Components/GlobalAdminComponents/GlobalNav'
import GlobalSidebar from '../../Components/GlobalAdminComponents/GlobalSidebar';
import { Outlet } from 'react-router-dom';
import './GlobalAdminTemplate.css'
import { ToastContainer } from 'react-toastify';

const GlobalAdminTemplate = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleShowNavbar = () => {
      setShowSidebar(!showSidebar);
    };
    
  return (
    <div>
    <GlobalNav handleShowSidebar={handleShowNavbar} showSidebar={showSidebar} style={{fontFamily:'DM Sans'}}/>
      <div className="dashboard-template-container"  style={{fontFamily:'DM Sans'}}>
          <div className={showSidebar ? 'show-sidebar': 'layout'}>
            <GlobalSidebar showSidebar={showSidebar} />
          </div>
        <div className="body-container p-3" style={{fontFamily:'DM Sans', flexGrow:'1'}}>
          <Outlet/>
        </div>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default GlobalAdminTemplate
