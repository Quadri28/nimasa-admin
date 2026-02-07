import React, {useContext, useEffect } from "react";
import "./MemberManagement.css";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../../AuthContext";

const MemberManagement = () => {
  const { pathname } = useLocation();
  const navigate= useNavigate()
    const data =[
    {menuName:'Members', menuId: '35', url:'/admin-dashboard/member-management'},
    {menuName:'Member Deductions', menuId: '170', url:'/admin-dashboard/member-management/member-deduction'},
    {menuName:'Member Account', menuId: '36', url:'/admin-dashboard/member-management/member-account'},
  ]

      const {credentials}= useContext(UserContext)
      const permissions=credentials?.logInfo?.userRolesPermission
 useEffect(() => {
  window.scrollTo(0, 0);

  const currentIsIndex = pathname === "/member-management";
  const hasIndexPermission = permissions?.some(
    (p) => p.menuId === "35"
  );

  if (currentIsIndex && !hasIndexPermission) {
    // find the first available tab the user has permission to access
    const firstAllowed = data.find((config) =>
      permissions?.some((p) => p.menuId === config.menuId)
    );

     if (firstAllowed && firstAllowed.url !== "/member-management") {
      navigate(firstAllowed.url, { replace: true });
    }
  }
}, [pathname, permissions, navigate]);

  return (
    <div>
      <h4 className="mb-4 fs-5">Member Management</h4>
      <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
       {data.map(config => {
                 const hasPermission = permissions.some(p => p.menuId === config.menuId);
                 const isActive =
                 config.url === '/admin-dashboard/member-management'
                   ? pathname === '/admin-dashboard/member-management'
                    || pathname.startsWith('/admin-dashboard/member-management/edit-member')
                    || pathname.startsWith('/admin-dashboard/member-management/signatory')
                    || pathname.startsWith('/admin-dashboard/member-management/add-member')
                    || pathname.startsWith('/admin-dashboard/member-management/bulk-login-access')
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
      <div className="bg-white border-0 p-3 my-3 rounded-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberManagement;
