import React, { useContext } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../../AuthContext';

const Retirement = () => {
  const { pathname } = useLocation();
  const data=[
  {menuName:'Retirement Request', menuId:'202', url:'/admin-dashboard/request/retirement-requests'},
  {menuName:'Retirement Request Posting', menuId:'208', url:'/admin-dashboard/request/retirement-requests/retirement-request-posting'},
]
const {credentials}= useContext(UserContext)
        const permissions=credentials?.logInfo?.userRolesPermission
  return (
    <>
         <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
                        {data.map(config => {
                           const hasPermission = permissions.some(p => p.menuId === config.menuId);
                          const isActive =
                              pathname === config.url
                         
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
    </>)
}

export default Retirement
