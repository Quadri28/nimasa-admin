import React from 'react'
import './Trustees.css'
import cwg from '../assets/cwg.png'
import uba from '../assets/uba.png'
import memcos from '../assets/memcos.png'
import ncf from '../assets/ncf.png'
import ntdc from '../assets/ntdc.png'
import nltf from '../assets/nltf.png'

const Trustees = () => {
  return (
    <div className='text-center mt-2 px-4'>
      <p className='text-center trustee-para'>
        More than 10,000 users use <span style={{color:'#0452C8'}}>UCP.</span>
        </p>
        <div className='d-flex align-items-center justify-content-center gap-5 mt-5 flex-wrap trustee-image-wrapper'>
            <img src={ntdc} alt="trustee-image1" className='img-fluid'/>
            <img src={memcos} alt="trustee-image2" className='img-fluid'/>
            <img src={ncf} alt="trustee-image3" className='img-fluid'/>
            <img src={uba} alt="trustee-image4" className='img-fluid'/>
            <img src={nltf} alt="trustee-image5" className='img-fluid'/>
            <img src={cwg} alt="trustee-image6" className='img-fluid'/>
        </div>
    </div>
  )
}

export default Trustees
