import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Supports = () => {
  return (
    <div>
       <h4 style={{ fontSize: "18px" }}>Support</h4>
       <div className="rounded-4 card border-0 p-3 mt-4" style={{border:'solid 1px #f7f4f7'}}>
        <Outlet/>
        </div>
    </div>
  )
}

export default Supports
