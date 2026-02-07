import React, { useContext, useEffect } from "react";
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom";
import "./SharesManagement.css";
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../../AuthContext";

const SharesManagement = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate()

  const shares =[
    {menuName:'Configuration', menuId: '17', url:'/admin-dashboard/shares-management'},
    {menuName:'Manage shares', menuId: '231', url:'/admin-dashboard/shares-management/shares-register'},
    {menuName:'Shares report', menuId: '239', url:'/admin-dashboard/shares-management/shares-report'},
  ]

      const {credentials}= useContext(UserContext)
      const permissions=credentials?.logInfo?.userRolesPermission;

  useEffect(() => {
    window.scrollTo(0, 0);
  
    const currentIsIndex = pathname === "/shares-management";
    const hasIndexPermission = permissions?.some(
      (p) => p.menuId === "17"
    );
  
    if (currentIsIndex && !hasIndexPermission) {
      // find the first available tab the user has permission to access
      const firstAllowed = configurations.find((config) =>
        permissions?.some((p) => p.menuId === config.menuId)
      );
  
       if (firstAllowed && firstAllowed.url !== "/shares-management") {
        navigate(firstAllowed.url, { replace: true });
      }
    }
  }, [pathname, permissions, navigate]);
  
  return (
    <>
      <h4 className="fs-5 mb-4">Shares Management</h4>
      
      <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
         {shares.map(config => {
          const hasPermission = permissions.some(p => p.menuId === config.menuId);
         const isActive =
          config.url === '/admin-dashboard/shares-management'
            ? pathname === '/admin-dashboard/shares-management' || pathname.startsWith('/admin-dashboard/shares-management/update-share') 
            || pathname.startsWith('/admin-dashboard/shares-management/add-new-type')
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
      {<Outlet />}
    </>
  );
};

export default SharesManagement;
