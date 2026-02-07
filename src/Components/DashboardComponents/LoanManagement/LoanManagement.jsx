import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import './LoanManagement.css'
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../../AuthContext";


const LoanManagement = () => {
    const {pathname} = useLocation()
  const navigate = useNavigate()
    const modules = [
   {menuName:'Loan Application', menuId: '69', url:'/admin-dashboard/loan-management'},
    {menuName:'View Loan Application', menuId: '93', url:'/admin-dashboard/loan-management/view-loan-application'},
    {menuName:'Bulk Loan Creation', menuId: '234', url:'/admin-dashboard/loan-management/bulk-loan'},
    {menuName:'Disbursement', menuId: '31', url:'/admin-dashboard/loan-management/disbursement'},
    {menuName:'Status', menuId: '52', url:'/admin-dashboard/loan-management/status'},
    {menuName:'Liqudate Loan', menuId: '199', url:'/admin-dashboard/loan-management/loan-desave'},
    {menuName:'Loan Top up', menuId: '230', url:'/admin-dashboard/loan-management/top-up'},
    {menuName:'Repayment', menuId: '226', url:'/admin-dashboard/loan-management/repayment'},
    {menuName:'Skipping', menuId: '200', url:'/admin-dashboard/loan-management/skipping'},
    {menuName:'Partial Liqudation', menuId: '212', url:'/admin-dashboard/loan-management/partial-desave'},
    {menuName:'Loan Restructure', menuId: '57', url:'/admin-dashboard/loan-management/restructure'},
  ]

  const {credentials}= useContext(UserContext)
  const permissions=credentials?.logInfo?.userRolesPermission

   useEffect(() => {
    window.scrollTo(0, 0);
  
    const currentIsIndex = pathname === "/loan-management";
    const hasIndexPermission = permissions?.some(
      (p) => p.menuId === "69"
    );
  
    if (currentIsIndex && !hasIndexPermission) {
      // find the first available tab the user has permission to access
      const firstAllowed = modules.find((config) =>
        permissions?.some((p) => p.menuId === config.menuId)
      );
  
       if (firstAllowed && firstAllowed.url !== "/loan-management") {
        navigate(firstAllowed.url, { replace: true });
      }
    }
  }, [pathname, permissions, navigate]);
  
  return (
    <div>
      <h4 style={{fontWeight:'500', fontSize:'18px'}}>Loan Management</h4>
      <div className="my-3">
       <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
       {modules.map(config => {
                 const hasPermission = permissions.some(p => p.menuId === config.menuId);
                const isActive =
                 config.url === '/admin-dashboard/loan-management'
                   ? pathname === '/admin-dashboard/loan-management'
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
      </div>
      {
        <Outlet/>
      }
    </div>
  );
};

export default LoanManagement;
