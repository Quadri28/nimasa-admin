import React, { useContext } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../AuthContext'

const LoanReports = () => {

    const components=[
    {menuName:'Loan Report', menuId: '10', url:'/admin-dashboard/report/loan-report'},
    {menuName:'Loan Member Balance', menuId: '10', url:'/admin-dashboard/report/loan-report/loan-member-balance'},
    {menuName:'Loan Repayment Paid', menuId: '192', url:'/admin-dashboard/report/loan-report/loan-repayment-paid'},
    {menuName:'Loan Disbursed', menuId: '195', url:'/admin-dashboard/report/loan-report/disbursed-loan'},
    {menuName:'Loan Repayment Due', menuId: '187', url:'/admin-dashboard/report/loan-report/loan-repayment-due'},
    {menuName:'Loan Skipping', menuId: '193', url:'/admin-dashboard/report/loan-report/loan-skipping'},
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
     {
     <Outlet/>
     }
    </div>
  )
}

export default LoanReports
