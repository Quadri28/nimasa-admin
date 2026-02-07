import React, { useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../AuthContext";

const FinancialRequest = () => {
  const { pathname } = useLocation();
    const data=[
  {menuName:'Deposit Request', menuId:'167', url:'/admin-dashboard/request/financial-request'},
  {menuName:'Loan Request', menuId:'171', url:'/admin-dashboard/request/financial-request/loan-request'},
  {menuName:'Loan Repayment Request', menuId:'214', url:'/admin-dashboard/request/financial-request/loan-repayment-request'},
  {menuName:'Withdrawal Request', menuId:'210', url:'/admin-dashboard/request/financial-request/withdrawal-request'},
  {menuName:'Shares Request', menuId:'237', url:'/admin-dashboard/request/financial-request/shares-request'},
]
const {credentials}= useContext(UserContext)
        const permissions=credentials?.logInfo?.userRolesPermission
  return (
    <>
    <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
                           {data.map(config => {
                              const hasPermission = permissions.some(p => p.menuId === config.menuId);
                             const isActive =
                 config.url === '/admin-dashboard/request/financial-request'
                   ? pathname === '/admin-dashboard/request/financial-request'
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

export default FinancialRequest;
