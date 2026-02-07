import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, Outlet, useLocation } from 'react-router-dom'

const ProductSetting = () => {
    const {pathname} = useLocation()
  return (
    <div className='card p-3 border-0 rounded-4'>
        <ScrollContainer vertical={false} className="header-links mb-2 scroller" 
        style={{overflow:'scroll'}}>
        <Link
        to=''
          style={{ cursor: "pointer" }}
          className={pathname === '/admin-dashboard/configurations/product-settings' 
            || pathname.includes('/add-new-saving') || pathname.includes('/view-savings') 
            || pathname.includes('/edit-savings')? "active-selector" : null}
        >
          Savings
        </Link>
        <Link
        to='loan'
          style={{ cursor: "pointer" }}
          className={pathname.includes("loan") ? "active-selector" : null}>
          Loan
        </Link>
        <Link
        to='investments'
          style={{ cursor: "pointer" }}
          className={pathname.includes("/investments") ? "active-selector" : null}
        >
          Investments
        </Link>
      </ScrollContainer>
      <Outlet/>

      </div>
  )
}

export default ProductSetting
