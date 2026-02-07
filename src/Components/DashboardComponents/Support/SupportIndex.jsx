import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './Support.css'

const SupportIndex = () => {
    const {pathname} = useLocation()
    return (
      <>
      <ScrollContainer className="header-links mb-3 scroller">
        <Link to='' className={ pathname === '/admin-dashboard/support' ? 'active-selector' : 'inactive'}>
              Contact us</Link>
        <Link to='faqs' className={ pathname.includes('/support/faqs') ?
           'active-selector' : 'inactive'}>Frequently asked questions</Link>
        <Link to='email-support'  className={pathname.includes('/support/email-support') ?
           'active-selector' : 'inactive'}>Email support</Link>
      </ScrollContainer>
      <div style={{marginTop:'1.5rem'}} className='card rounded-4 border-0 p-3'>
        <Outlet/>
        </div>
      </>
  )
}

export default SupportIndex
