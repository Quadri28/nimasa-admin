import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from '../Components/axios'
import { toast } from 'react-toastify'
import { BsArrowLeft } from 'react-icons/bs'
import { NumericFormat } from 'react-number-format'

const SubscriptionRenewal = () => {
  const [details, setDetails]= useState({})

const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId");
  const userId = searchParams.get("userId");

  const getPaymentDetails=()=>{
    axios(`Admin/load-subscription-payment/${nodeId}`, {headers:{
    
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
        axios.post(`Admin/pay-fee/${nodeId}/${userId}`, payload, {headers:{
          
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
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center',
     alignItems:'center', minHeight:'100vh', width:'100vw', overflowY:'auto', paddingBlock:'2rem'}}>
        <form onSubmit={submitSubscription} className='bg-white  rounded-4'
         style={{width:'50%', border:'solid .5px #f5f5f5'}}>
      <div className='p-3 d-flex align-items-center justify-content-center gap-2 ' 
      style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0', }}>
      <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> 
        <span style={{fontSize:'14px', color:'#4D4D4D'}}> Payment Form </span>
      </div>
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
            <NumericFormat thousandSeparator={true} decimalScale={2} 
             name="amount" value={details?.amount} fixedDecimalScale={true} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="convenienceFee">Convenience fee</label>
            <NumericFormat thousandSeparator={true} decimalScale={2} 
             name="convenienceFee" value={details?.convenience_Amt} fixedDecimalScale={true} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="retval">Grand total</label>
            <NumericFormat thousandSeparator={true} decimalScale={2} 
             name="retval" value={details?.totalAmount} disabled fixedDecimalScale={true}/>
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

export default SubscriptionRenewal
