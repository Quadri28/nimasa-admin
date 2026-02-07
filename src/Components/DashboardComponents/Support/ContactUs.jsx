import React from 'react'
import { MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import './Support.css'
import { LuPhoneCall } from 'react-icons/lu'
import { FaRegEnvelope } from 'react-icons/fa'
import { BsEnvelopeOpen } from 'react-icons/bs'

const ContactUs = () => {

  return (
    <>
      <h4 className='fs-6'>Contact us</h4>
      <div className="rounded-4 mt-3" style={{border:'solid 1px #f7f4f7'}}>
     <div className="p-3 form-header"
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}>
      <div className='subtitle'>
       Contact us
        </div>
      </div>

      <div className="contact-container py-4 px-3 bg-white rounded-4">
        <div className='contact-card'>
          <p><MdLocationOn  size={30} className='icon'/></p>
        <h4>Visit us</h4>
        <p>Visit our office HQ in Lekki</p>
        <Link to='https://www.google.com/maps/place/CWG/@6.4427531,3.4639227,17z/data=!3m1!4b1!4m6!3m5!1s0x103bf4544f096fc9:0x8dd0bf00f318203e!8m2!3d6.4427531!4d3.4639227!16s%2Fg%2F11c5rvd60z?hl=en&entry=ttu&g_ep=EgoyMDI1MDMzMC4wIKXMDSoASAFQAw%3D%3D' target='_blank'>view on Google map</Link>
      </div>
      <div className="contact-card">
      <p><LuPhoneCall size={30} className='icon'/></p>
        <h4>Give us a call</h4>
        <p>Call us @ +2348188789836</p>
         <a href='tel:+2348188789836'> Call us now </a>
      </div>
      <div className="contact-card">
      <p><BsEnvelopeOpen size={30} className='icon'/></p>
        <h4>Send us a mail</h4>
        <p>Send us a mail on <span style={{fontSize:'13px'}}>ucp.support@cwg-plc.com</span> </p>
        <a href='mailto:ucp.support@cwg-plc.com'>Email us now</a>
      </div>
      </div>
      </div>
    </>
  )
}

export default ContactUs
