import React, { useEffect } from 'react'
import Hero from '../Components/Hero'
import Trustees from '../Components/Trustees'
import Potential from '../Components/Potential'
import Articles from '../Components/Articles'

const Home = () => {
  useEffect(()=>{
    if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
    }
  }, [])
  return (
    <div style={{fontFamily:'General Sans'}}>
    <Hero/>
    <Trustees/>
    <Potential/>
    <Articles/>
    </div>
  )
}

export default Home
