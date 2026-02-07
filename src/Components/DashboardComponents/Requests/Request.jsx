import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import './Requests.css'
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../../AuthContext";

const Request = () => {
  const {pathname} = useLocation();
const navigate = useNavigate()
  const data=[
    {menuName:'Service Request', menuId: '168', url:'/admin-dashboard/request'},
    {menuName:'Account Management', menuId: '162', url:'/admin-dashboard/request/account-management'},
    {menuName:'Financial Request', menuId: '171', url:'/admin-dashboard/request/financial-request'},
    {menuName:'Retirement request', menuId: '202', url:'/admin-dashboard/request/retirement-requests'},
  ]
    const {credentials}= useContext(UserContext)
        const permissions=credentials?.logInfo?.userRolesPermission
  
useEffect(() => {
  window.scrollTo(0, 0);

  const currentIsIndex = pathname === "/request";
  const hasIndexPermission = permissions?.some(
    (p) => p.menuId === "168"
  );

  if (currentIsIndex && !hasIndexPermission) {
    // find the first available tab the user has permission to access
    const firstAllowed = data.find((config) =>
      permissions?.some((p) => p.menuId === config.menuId)
    );

     if (firstAllowed && firstAllowed.url !== "/request") {
      navigate(firstAllowed.url, { replace: true });
    }
  }
}, [pathname, permissions, navigate]);

  return (
    <div>
      <h2 className="fs-5">Request</h2>
    <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
            {data.map(config => {
               const hasPermission = permissions.some(p => p.menuId === config.menuId);
              const isActive =
               config.url === '/admin-dashboard/request'
                 ? pathname === '/admin-dashboard/request' || pathname === '/admin-dashboard/request/sms-request'
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
    <div className="card mt-3 p-3 rounded-4 border-0">
      {<Outlet />}
      </div>
    </div>
  );
};

export default Request;
