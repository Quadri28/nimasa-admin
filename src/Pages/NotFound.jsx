import React from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div style={{width:'100%', height:'100vh', display:'grid', textAlign:'center'}}>
    <div style={{placeSelf:'center', justifyContent:'center'}}>
      <p className='fs-3 fw-semibold'>The page you are looking for does not exist</p>
      <span onClick={()=>navigate(-1)} style={{cursor:'pointer'}}> <FaArrowLeft/> Go Back</span>
    </div>
    </div>
  )
}

export default NotFound
