import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './GlobalSidebar.css'
import { MdContactSupport, MdOutlineDashboard, MdSpaceDashboard } from 'react-icons/md'
import { RiSettings3Line } from 'react-icons/ri'
import { HiDocumentReport } from 'react-icons/hi'

const GlobalSidebar = ({showSidebar}) => {
const {pathname}= useLocation()

  return (
    <div
      className="bg-white global-sidebar-container p-3">
      <div className="mb-2">
        <span className="brand-name text-uppercase" style={{fontSize:'12px', fontWeight:'400'}}>
          Global admin dashboard
        </span>
      </div>
      <div className="global-sidebar-links-container">
        <div>
        <Link  to="/global-admin-dashboard" 
          className={ pathname === '/global-admin-dashboard' ? 'active': ''}
       > 
        <MdOutlineDashboard size={14}/> <span>General Overview </span>
        </Link>
        </div>
        <div>
        <Link to='set-up' 
          className={ pathname.includes('/set-up') ? 'active': ''}
          >
        <RiSettings3Line size={14}/> <span>Setup</span></Link>
        </div>
        <div>
        <Link to='admin-tasks' className={ pathname.includes('/admin-tasks') ? 'active': ''}>
        <MdSpaceDashboard size={14}/> <span>Admin Tasks</span></Link>
        </div>
        <div>
        <Link to='reports' className={ pathname.includes('/reports') ? 'active': ''}>
        <HiDocumentReport size={14}/><span>Reports</span></Link>
        </div>
        <div>
        <Link to='support' className={ pathname.includes('/support') ? 'active': ''}>
        <MdContactSupport size={14}/><span>Support</span></Link>
        </div>
      </div>
    </div>
  )
}

export default GlobalSidebar
