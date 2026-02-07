import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { toast } from 'react-toastify'
import { BsArrowLeft } from 'react-icons/bs'
import { NumericFormat } from 'react-number-format'

const PaymentDetails = () => {
  const [details, setDetails]= useState({})

  const {credentials} = useContext(UserContext)
  const getPaymentDetails=()=>{
    axios('Admin/load-subscription-payment', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setDetails(resp.data.data))
  }

  useEffect(()=>{
    getPaymentDetails()
  },[])

    const submitSubscription=(e)=>{
      e.preventDefault()
      const payload={
  transactionID: details.transactionID,
  orgName: details.orgName,
  email: details.email,
  phone: details.phone,
  totalAmount: details.totalAmount,
      }
        axios.post('Admin/pay-fee', payload, {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          console.log(resp.data)
          const url = resp.data.data.authorization_url;
          const link = document.createElement("a");
          link.href = url;
          link.click();
        }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
      }

      const navigate= useNavigate()
  return (
    <div>
      <div className='p-3 d-flex align-items-center gap-2' 
      style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0'}}>
      <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> <span style={{fontSize:'14px', color:'#4D4D4D'}}> Payment Form </span>
      </div>
        <form onSubmit={submitSubscription} className='bg-white py-3  rounded-3'>
          <div className="admin-task-forms px-3">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="name">Name</label>
            <input name="orgName" value={details.orgName} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="email">Email</label>
            <input name="email" value={details.email} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="Phone">Phone</label>
            <input name="Phone" value={details.phone} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="amount">Amount</label>
            <NumericFormat fixedDecimalScale={true} decimalScale={2} thousandSeparator={true} name="amount" value={details?.amount}disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="convenienceFee">Convenience fee</label>
            <NumericFormat fixedDecimalScale={true} decimalScale={2} thousandSeparator={true} name="convenienceFee" value={details?.convenience_Amt}disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="retval">Grand total</label>
            <NumericFormat fixedDecimalScale={true} decimalScale={2} thousandSeparator={true} name="retval" value={details?.totalAmount}disabled/>
          </div>
          </div>
          <div
            style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
            className="d-flex justify-content-end gap-3 p-3 mt-5"
          >
            <button type="submit" className="border-0 btn-sm member">Proceed</button>
          </div>
        </form>
    </div>
  )
}

export default PaymentDetails
