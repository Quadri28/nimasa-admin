import React from "react";
import { ToastContainer, toast } from "react-toastify";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, Outlet, useLocation } from "react-router-dom";

const ManageAssets = () => {
  const {pathname} = useLocation()

  return (
    <div className="card my-4 p-3 border-0 rounded-4">
      <div className="d-sm-flex justify-content-between mb-2">
          <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
          <Link
          to=''
            style={{ cursor: "pointer" }}
            className={pathname === "/admin-dashboard/configurations/manage-assets" || 
              pathname.includes('/configurations/manage-assets/view-asset-category') ||
              pathname.includes('/configurations/manage-assets/add-asset-category') 
              || pathname.includes('/configurations/manage-assets/edit-asset-category')? "active-selector" : ""}
          >
            Manage asset category
          </Link>
          <Link
          to='manage-asset-class'
            style={{ cursor: "pointer" }}
            className={pathname.includes("/manage-asset-class") ? "active-selector" : ""}
          >
            Manage asset class
          </Link>
          <Link 
          to='manage-asset-disposal'
            style={{ cursor: "pointer" }}
            className={pathname.includes("/manage-asset-disposal") ? "active-selector" : ""}
            
          >
            Manage Disposal Asset
          </Link>
        </ScrollContainer>
      </div>
      <Outlet/>
      <ToastContainer />
    </div>
  );
};

export default ManageAssets;
