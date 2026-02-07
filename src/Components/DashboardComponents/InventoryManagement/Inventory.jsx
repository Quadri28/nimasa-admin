import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Inventory.css";
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../../AuthContext";

const Inventory = () => {
  const { pathname } = useLocation();
  const navigate= useNavigate()

  const inventories = [
    {menuName:'Item Category', menuId: '165', url:'/admin-dashboard/inventory-management'},
    {menuName:'Manage Vendor', menuId: '220', url:'/admin-dashboard/inventory-management/vendor'},
    {menuName:'Register Item', menuId: '201', url:'/admin-dashboard/inventory-management/register-item'},
  ]
    const {credentials}= useContext(UserContext)
    const permissions=credentials?.logInfo?.userRolesPermission
    useEffect(() => {
    window.scrollTo(0, 0);
  
    const currentIsIndex = pathname === "/inventory-management";
    const hasIndexPermission = permissions?.some(
      (p) => p.menuId === "165"
    );
  
    if (currentIsIndex && !hasIndexPermission) {
      // find the first available tab the user has permission to access
      const firstAllowed = inventories.find((config) =>
        permissions?.some((p) => p.menuId === config.menuId)
      );
  
       if (firstAllowed && firstAllowed.url !== "/inventory-management") {
        navigate(firstAllowed.url, { replace: true });
      }
    }
  }, [pathname, permissions, navigate]);

  return (
    <>
      <h4 className="fs-5"> Inventory Management</h4>
      <ScrollContainer
        vertical={false}
        className="header-links mb-3 scroller"
        style={{ overflow: "scroll" }}
      >
        {inventories.map(config => {
          const hasPermission = permissions.some(p => p.menuId === config.menuId);
         const isActive =
          config.url === '/admin-dashboard/inventory-management'
            ? pathname === '/admin-dashboard/inventory-management'
            : pathname.startsWith(config.url);
        
          return hasPermission ? (
            <Link
              to={config.url}
              key={config.menuId}
              className={isActive ? "active-selector" : ""}
            >
              {config.menuName}
            </Link>
          ) : null;
        })}
      </ScrollContainer>
      <Outlet />
    </>
  );
};

export default Inventory;
