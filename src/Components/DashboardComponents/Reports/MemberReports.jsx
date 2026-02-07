import React, { useContext } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserContext } from '../../AuthContext'

const MemberReports = () => {
      
      const components=[
        {menuName:'Member Details Report', menuId: '195', url:'/admin-dashboard/report/member-report'},
        {menuName:'Member Growth', menuId: '191', url:'/admin-dashboard/report/member-report/member-growth'},
        {menuName:'Member Balance by Date', menuId: '194', url:'/admin-dashboard/report/member-report/member-balance-by-date'},
        {menuName:'Member Ledger', menuId: '197', url:'/admin-dashboard/report/member-report/member-ledger'},
        {menuName:'General Member Balance', menuId: '227', url:'/admin-dashboard/report/member-report/general-member-balance'},
        {menuName:'Member Request', menuId: '209', url:'/admin-dashboard/report/member-report/member-request'},
        {menuName:'New Member', menuId: '189', url:'/admin-dashboard/report/member-report/new-member'},
        {menuName:'Member Contribution History', menuId: '189', url:'/admin-dashboard/report/member-report/contribution-history'},
    ]
    const {pathname} = useLocation()
        const {credentials}= useContext(UserContext)
        const permissions=credentials?.logInfo?.userRolesPermission
  return (
    <div>
    <ScrollContainer vertical={false} className="header-links mb-3 scroller" style={{overflow:'scroll'}}>
          {components.map(config => {
               const hasPermission = permissions.some(p => p.menuId === config.menuId);
                 const isActive =
                  pathname.startsWith(config.url)
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
     {
     <Outlet/>
     }
    </div>
  )
}

export default MemberReports
