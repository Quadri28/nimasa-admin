import React,{useContext, useEffect} from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../../AuthContext'

const Accounting = () => {
    const {pathname} = useLocation()
    const navigate = useNavigate()

     const links =[
        {menuName:'Bulk upload', menuId: '15', url:'/admin-dashboard/accounting'},
        {menuName:'Deposit', menuId: '26', url:'/admin-dashboard/accounting/deposit'},
        {menuName:'Withdrawal', menuId: '27', url:'/admin-dashboard/accounting/withdrawal'},
        {menuName:'Deduction upload', menuId: '178', url:'/admin-dashboard/accounting/deduction-upload'},
        {menuName:'Transfer', menuId: '24', url:'/admin-dashboard/accounting/transfer'},
      ]
    
          const {credentials}= useContext(UserContext)
          const permissions=credentials?.logInfo?.userRolesPermission
  useEffect(() => {
   window.scrollTo(0, 0);
 
   const currentIsIndex = pathname === "/accounting";
   const hasIndexPermission = permissions?.some(
     (p) => p.menuId === "15"
   );
 
   if (currentIsIndex && !hasIndexPermission) {
     // find the first available tab the user has permission to access
     const firstAllowed = links.find((config) =>
       permissions?.some((p) => p.menuId === config.menuId)
     );
 
      if (firstAllowed && firstAllowed.url !== "/accounting") {
       navigate(firstAllowed.url, { replace: true });
     }
   }
 }, [pathname, permissions, navigate]);
 
  return (
    <div>
      <h4 className='fs-5'>Accounting</h4>
      <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
       {links.map(config => {
         const hasPermission = permissions.some(p => p.menuId === config.menuId);
        const isActive =
         config.url === '/admin-dashboard/accounting'
           ? pathname === '/admin-dashboard/accounting'
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
    </div>
  )
}

export default Accounting
