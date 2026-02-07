import React, { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import './Report.css'
import ScrollContainer from 'react-indiana-drag-scroll'
import { UserContext } from '../../AuthContext'

const components =[
    {menuName:'Transaction Reports', menuId: '10', url:'/admin-dashboard/report'},
    {menuName:'Loan Reports', menuId: '192', url:'/admin-dashboard/report/loan-report'},
    {menuName:'Member Reports', menuId: '195', url:'/admin-dashboard/report/member-report'},
    {menuName:'User Reports', menuId: '187', url:'/admin-dashboard/report/user-reports'},
    {menuName:'Financial Reports', menuId: '193', url:'/admin-dashboard/report/financial-reports'},
    {menuName:'Statutory Reports', menuId: '207', url:'/admin-dashboard/report/statutory-reports'},
    {menuName:'Request Reports', menuId: '176', url:'/admin-dashboard/report/request-reports'},
    {menuName:'Deduction Upload Reports', menuId: '178', url:'/admin-dashboard/report/deduction-upload-reports'},
]

const Report = () => {
  
   const {pathname} = useLocation()
  const {credentials}= useContext(UserContext)
  const navigate = useNavigate()
      const permissions=credentials?.logInfo?.userRolesPermission
  useEffect(() => {
   window.scrollTo(0, 0);
 
   const currentIsIndex = pathname === "/report";
   const hasIndexPermission = permissions?.some(
     (p) => p.menuId === "10"
   );
 
   if (currentIsIndex && !hasIndexPermission) {
     // find the first available tab the user has permission to access
     const firstAllowed = components.find((config) =>
       permissions?.some((p) => p.menuId === config.menuId)
     );
 
      if (firstAllowed && firstAllowed.url !== "/report") {
       navigate(firstAllowed.url, { replace: true });
     }
   }
 }, [pathname, permissions, navigate]);

  return (
    <>
    <h4 className='mb-4 fs-5'>Report</h4>
    <div className=''>
     <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
             {components.map(config => {
              const hasPermission = permissions.some(p => p.menuId === config.menuId);
             const isActive =
              config.url === '/admin-dashboard/report'
                ? pathname === '/admin-dashboard/report'
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
     <div className='card py-4 mt-3 px-3 border-0 rounded-4'>
     <Outlet/>
     </div>
    </>
  )
}

export default Report
