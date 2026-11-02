import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../Components/NavBar'
import Footer from '../../Components/Footer'

const LandingPageTemplate = () => {
  return (
    <>
    <NavBar style={{fontFamily:'General Sans'}}/>
    <div>
      <Outlet/>
    </div>
    <Footer/>
    </>
  )
}

export default LandingPageTemplate
