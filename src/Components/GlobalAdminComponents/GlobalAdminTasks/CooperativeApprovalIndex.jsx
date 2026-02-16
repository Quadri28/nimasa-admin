import React from 'react'
import { Outlet } from 'react-router-dom'

const CooperativeApprovalIndex = () => {
  return (
    <div className='bg-white p-3 rounded-3'>
      <Outlet/>
    </div>
  )
}

export default CooperativeApprovalIndex
