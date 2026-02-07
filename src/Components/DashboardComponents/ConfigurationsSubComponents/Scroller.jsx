
import React, { useContext, useEffect } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../AuthContext';

const Scroller = () => {
const {pathname}= useLocation()
const {credentials} = useContext(UserContext)
const navigate= useNavigate()

  const tasks=[
    {menuName:'Manage GL account', menuId: '18', url:'/admin-dashboard/admin-tasks'},
    {menuName:'Manage users', menuId: '8', url:'/admin-dashboard/admin-tasks/manage-users'},
    {menuName:'Manage roles', menuId: '19', url:'/admin-dashboard/admin-tasks/manage-roles'},
    {menuName:'Outstanding subscription', menuId: '218', url:'/admin-dashboard/admin-tasks/outstanding-subscription'},
    {menuName:'Map statutory report', menuId: '206', url:'/admin-dashboard/admin-tasks/map-statutory'},
    {menuName:'Financial year closure', menuId: '228', url:'/admin-dashboard/admin-tasks/financial-year-closure'},
  ]
    const permissions=credentials?.logInfo?.userRolesPermission

      useEffect(() => {
      window.scrollTo(0, 0);
    
      const currentIsIndex = pathname === "/admin-tasks";
      const hasIndexPermission = permissions?.some(
        (p) => p.menuId === "18"
      );
    
      if (currentIsIndex && !hasIndexPermission) {
        // find the first available tab the user has permission to access
        const firstAllowed = tasks.find((config) =>
          permissions?.some((p) => p.menuId === config.menuId)
        );
    
         if (firstAllowed && firstAllowed.url !== "/admin-tasks") {
          navigate(firstAllowed.url, { replace: true });
        }
      }
    }, [pathname, permissions, navigate]);
  return (
    <div>
       <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
    {tasks.map(config => {
  const hasPermission = permissions.some(p => p.menuId === config.menuId);
 const isActive =
  config.url === "/admin-dashboard/admin-tasks"
    ? pathname === "/admin-dashboard/admin-tasks" 
    || pathname.startsWith("/admin-dashboard/admin-tasks/edit-gl-account")
    || pathname.startsWith("/admin-dashboard/admin-tasks/add-gl-account")
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
})
}
    
        {/* <Link to='settlement-account'  className={pathname.includes("/admin-tasks/settlement-account") ? "active-selector" : null}
         >Settlement account</Link> */}
      </ScrollContainer>
    </div>
  )
}

export default Scroller
