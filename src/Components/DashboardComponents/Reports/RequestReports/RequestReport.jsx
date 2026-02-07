import React, { useContext } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserContext } from '../../../AuthContext'

const RequestReport = () => {
    const {pathname} = useLocation()
        const {credentials}= useContext(UserContext)
                    const permissions=credentials?.logInfo?.userRolesPermission
    const components=[
      {menuName:'App Deposit', menuId:'176', url:'/admin-dashboard/report/request-reports'},
      {menuName:'App Item Request', menuId:'177', url:'/admin-dashboard/report/request-reports/app-item-request'},
      {menuName:'App Registration', menuId:'173', url:'/admin-dashboard/report/request-reports/app-registration'},
      {menuName:'App Reschedule', menuId:'174', url:'/admin-dashboard/report/request-reports/app-reschedule'},
      {menuName:'App Withdrawal', menuId:'211', url:'/admin-dashboard/report/request-reports/app-withdrawal'},
      {menuName:'App Loan Request', menuId:'175', url:'/admin-dashboard/report/request-reports/app-loan-request'},
      {menuName:'App Loan Repayment Request', menuId:'175', url:'/admin-dashboard/report/request-reports/app-loan-repayment-request'},
    ]
  return (
    <>
    <h5 className="fs-6">Request Reports</h5>
        <ScrollContainer vertical={false} className="header-links mb-2 scroller" style={{overflow:'scroll'}}>
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
      <Outlet/>
    </>
  )
}

export default RequestReport
