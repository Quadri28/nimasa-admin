import React, { useContext, useEffect } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../AuthContext'

const Investments = () => {
  const {pathname}= useLocation()
  const navigate = useNavigate()

      const {credentials}= useContext(UserContext)
      const permissions=credentials?.logInfo?.userRolesPermission

  const investments =[
    {menuName:'Investments', menuId: '185', url:'/admin-dashboard/investments'},
    {menuName:'Investment status', menuId: '184', url:'/admin-dashboard/investments/investment-status'},
    {menuName:'Partial pay', menuId: '203', url:'/admin-dashboard/investments/partial-pay'},
    {menuName:'Liquidate investment', menuId: '183', url:'/admin-dashboard/investments/liquidate-investment'},
    {menuName:'Investment report', menuId: '186', url:'/admin-dashboard/investments/investment-report'},
  ]
  
  useEffect(() => {
    window.scrollTo(0, 0);
  
    const currentIsIndex = pathname === "/investments";
    const hasIndexPermission = permissions?.some(
      (p) => p.menuId === "185"
    );
  
    if (currentIsIndex && !hasIndexPermission) {
      // find the first available tab the user has permission to access
      const firstAllowed = investments.find((config) =>
        permissions?.some((p) => p.menuId === config.menuId)
      );
  
       if (firstAllowed && firstAllowed.url !== "/investments") {
        navigate(firstAllowed.url, { replace: true });
      }
    }
  }, [pathname, permissions, navigate]);
  return (
    <div className=''>
      <h4>Investment</h4>
    <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
        {investments.map(config => {
     const hasPermission = permissions.some(p => p.menuId === config.menuId);
    const isActive =
     config.url === '/admin-dashboard/investments'
       ? pathname === '/admin-dashboard/investments' || pathname === '/admin-dashboard/investments/add-investment'
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
      <Outlet/>
    </div>
  )
}

export default Investments
