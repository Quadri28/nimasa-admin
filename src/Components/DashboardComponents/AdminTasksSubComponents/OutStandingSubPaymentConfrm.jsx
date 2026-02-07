import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/Logo.png'
import {MdOutlinePrint} from 'react-icons/md'

const OutStandingSubPaymentConfrm = () => {

const [referenceDetail, setReferenceDetail]= useState({})
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const reference = searchParams.get('reference');

const getReferenceDetails=async()=>{
  await axios(`Admin/pay-fee/${reference}`)
  .then(resp=>setReferenceDetail(resp.data.data))
}
useEffect(()=>{
getReferenceDetails()
},[])


  return (
    <div className='p-3'>
      <img src={logo} alt="logo" />
    <div className='d-flex justify-content-between flex-wrap gap-3 mt-3'>
      <div>
      <p style={{color:'#666'}}>From</p>
      <div className="d-flex flex-column gap-2">
        <strong>{referenceDetail?.orgName}</strong>
        <span>{referenceDetail?.organisationAddress}</span>
        <div className='d-flex flex-column gap-1'>
          <strong>Transaction number</strong>
          <span>{referenceDetail?.transactionId}</span>
        </div>
        </div>
      </div>
        <div className="d-flex flex-column gap-2 align-self-end align-items-end">
          <p style={{color:'#666'}}>To</p>
          <strong>Unified Cooperative Platform</strong>
          <span>E: ucpsupport@cwg-plc.com</span>
          <span>P: 08038913480</span>
          <p>{new Date().toLocaleString()}</p>
        </div>
    </div>
    <div className="table-responsive mt-3">
              <div style={{backgroundColor:'#000', borderRadius:'7px', color:'#fff'}}
               className='d-flex justify-content-between align-items-center'>
                  <span style={{textAlign:'left', padding:'10px', fontWeight:'500'}}>Transaction ID</span>
                  <span style={{textAlign:'left', fontWeight:'500'}}>Description</span>
                  <span style={{textAlign:'right', padding:'10px',fontWeight:'500'}}>Amount</span>
              </div>
              <div style={{backgroundColor:'#f2f2f2', borderRadius:'7px'}}
               className='d-flex justify-content-between align-items-center mt-2'>
                 <span style={{textAlign:'left', padding:'10px', fontWeight:'500'}}>#{referenceDetail?.transactionId}</span>
                  <span style={{textAlign:'left', fontWeight:'500'}}>Subscription payment</span>
                  <span style={{textAlign:'right', padding:'10px',fontWeight:'500'}}>
                    N{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(referenceDetail?.amountPaying)}</span>
              </div>
              <div style={{backgroundColor:'#f2f2f2', borderRadius:'7px'}}
               className='d-flex justify-content-end align-items-center mt-3 p-2'>
                <table>
                  <tr className='d-flex justify-content-between'>
                  <td>Subtotal: </td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(referenceDetail?.paymentAmt)}</td>
                  </tr>
                <tr className='d-flex gap-5'>
                  <td>Convenience fee: </td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(referenceDetail?.feeAmt)}</td>
                </tr>
                <tr className='d-flex justify-content-between'>
                  <td>Total paid: </td>
                  <td>N{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(referenceDetail?.totalPaymentAmt)}</td>
                </tr>
               </table>
            </div>
            <div style={{backgroundColor:'#000', borderRadius:'7px', color:'#fff'}}
               className='d-flex justify-content-end mt-3 p-2 align-items-center'>
                <div className="d-flex gap-5">
                  <span>Total</span>
                  <span>N{referenceDetail?.totalPaymentAmt}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
              <div style={{backgroundColor:'#f2f2f2', padding:'7px', borderRadius:'7px'}}>
              Thank you for using the online payment. Please <Link to='/admin-tasks/outstanding-subscription' style={{textDecoration:'none'}}>click here</Link>  to return to the homepage
              </div>
              <button className='btn btn-primary rounded-3 btn-sm' onClick={()=>window.print()}>
               <MdOutlinePrint/> Print receipt</button>
            </div>
      </div>
    </div>
  )
}

export default OutStandingSubPaymentConfrm
