import React from 'react'
import { Outlet } from 'react-router-dom'

const GlobalRoleConfigIndex = () => {
  return (
    <div className='card rounded-4 border-0 p-3'>
        <Outlet/>
    </div>
  )
}

export default GlobalRoleConfigIndex
