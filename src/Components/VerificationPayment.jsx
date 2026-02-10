import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png'
import axios from './axios';
import { toast } from 'react-toastify';

const VerificationPayment = () => {
    const [error, setError]= useState('')
    const [loading, setLoading]= useState(false)
    const [details, setDetails]= useState({})
    const [info, setInfo]= useState({})
   const location = useLocation();
   
const queryParams = new URLSearchParams(location.search)
const amount =queryParams.get('Amount')
const transactionId =queryParams.get('TransactionId')

    const getPaymentInfo= ()=>{
        axios(`Admin/get-transaction-information-detail?TransactionId=${transactionId}`)
        .then(resp=>setInfo(resp.data.data))
    }
const getPaymentDetails= ()=>{
    axios('Admin/get-global-payment-charges')
    .then(resp=>setDetails(resp.data.data))
}

useEffect(()=>{
getPaymentInfo()
getPaymentDetails()
}, [])

const grandTotal = details?.convenience_Amt + Number(amount)


const makePayment = (e)=>{
    e.preventDefault()
    const payload={
        transactionId: transactionId,
        totalAmount: Number(amount)
    }
    setLoading(true)
    axios.post('Admin/cooperative-signup-registration-fee', payload, {})
    .then(resp=>{
        const url = resp.data.data.payStackResponse.authorization_url;
        const link = document.createElement("a");
        link.href = url;
        link.click();
        setLoading(false)
    }).catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
      setLoading(false)
    })
}
  return (
     <div
          style={{
            backgroundColor: "#f2f2f2",
            minHeight: "150vh",
            position: "relative",
            fontFamily:'General Sans'
          }}
        >
          
          <div className="cooperative-signup-form-container">
            <div className="text-center">
              <img src={Logo} alt="App Logo" width="30px" className="img-fluid" />
              {/* <strong style={{ fontSize: "18px", marginLeft: "5px" }}>
                UCP Cooperative portal
              </strong> */}
              <p className="great">
                Great to have you, authorize your payment 
              </p>
            </div>
            <div className="form-header-container px-4 d-flex justify-content-between">
              <h6>Payment Form</h6>
            </div>
            <form onSubmit={makePayment}>
            <div className="bg-white form" style={{padding:'15px 24px 24px'}}>
                {
                  error ? <p className="text-danger text-center">{error}</p> : null
                }
        <span>Transaction id: {transactionId}</span>
       <div className='inputs-container  mb-1'>
        <label htmlFor="name">Name</label>
           <input className='w-100' name='name' disabled  value={info?.orgName} readOnly/>
          </div>
          <div className='inputs-container  mb-1'>
        <label htmlFor="email">Email</label>
           <input className='w-100' name='email' disabled  value={info?.email} readOnly/>
          </div>
          <div className='inputs-container  mb-1'>
        <label htmlFor="phone">Phone</label>
           <input className='w-100' name='phone' disabled  value={info?.phone} readOnly/>
          </div>
          <div className='inputs-container'>
        <label htmlFor="amount">Amount</label>
     <input className='w-100' name='amount' disabled readOnly
      value={new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(amount)}/>
    </div>
    <div className='inputs-container'>
        <label htmlFor="convenienceFee">Convenience Fee</label>
     <input className='w-100' name='convenienceFee' disabled readOnly
     value={details?.convenience_Amt}/>
    </div>
    <div className='inputs-container'>
        <label htmlFor="grandTotal">Grand Total</label>
     <input className='w-100' name='grandTotal' disabled readOnly
      value={new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(grandTotal)}/>
    </div>
    <div className="d-flex mt-2">
    <button className='sign-cooperative member border-0 btn-md w-100' disabled={loading}>Pay</button>
    </div>
    </div>
    </form>
    </div>
    </div>
  )
}

export default VerificationPayment
