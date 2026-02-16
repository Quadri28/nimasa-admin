import React from 'react'
import GlobalTaskScroller from './GlobalTaskScroller'
import { Outlet } from 'react-router-dom'

const GlobalAdminTasks = () => {
  return (
    <div>
      <h3 className="title-head">Admin Tasks</h3>
      <GlobalTaskScroller/>
      <div style={{overflow:'hidden'}} className="mt-4 bg-white rounded-3">
      <Outlet />
      </div>
    </div>
  )
}

export default GlobalAdminTasks
