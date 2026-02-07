import React from 'react'
import { Outlet } from 'react-router-dom'

const CandidateIndex = () => {
  return (
    <div className='card p-3 border-0 rounded-4'>
    <div className='d-sm-flex justify-content-between align-items-center mt-3' style={{width:'fit-content'}}>
        <p className="active-selector"> Candidates </p>
    </div>
      <Outlet/>
    </div>
  )
}

export default CandidateIndex
