import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { use } from 'react'

const ViewRequest = () => {
    const {id}= useParams()
    const [request, setRequest]=useState([])
    const {credentials} = useContext(UserContext)
    const [format, setFormat]= useState('default')
    const [formatInput, setFormatInput]= useState({})
    const [amountPaying, setAmountPaying]= useState(request?.amount)
    const [loading, setLoading]= useState(false)


const handleChange=(e)=>{
  const name = e.target.name;
  const value = e.target.value;
  setFormatInput({...formatInput, [name]:value})
}

const navigate = useNavigate()
const getRequest=()=>{
    axios(`Admin/cooperative-registration-authorization-by-uniqueId?uniqueId=${id}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setRequest(resp.data.data))
}
useEffect(()=>{
getRequest()
}, [])
const getAmountPaying=()=>{
  if (format === 'default') {
    setAmountPaying(request?.amount)
    setFormatInput({
      discount:0,
      partial: 0
    })
  }else if (format === 'discount') {
    setAmountPaying( request?.amount - (formatInput.discount/100 * request?.amount))
   
  }else if (format === 'partial') {
    setAmountPaying(formatInput.partial)
  }
}

useEffect(()=>{
getAmountPaying()
}, [formatInput, format])

const approveRequest=(e)=>{
  e.preventDefault()
  setLoading(true)
  const payload={
  email: request.email,
  discount: format === 'discount' ? formatInput.discount: 0,
  amountDue: request.amount,
  amountPaying: amountPaying,
  partialAmount: format=== 'partial' ? formatInput.partial : 0,
  outstandingBalance: format === 'partial' ? request?.amount - amountPaying : 0,
  discountFlag: format === 'discount' ? 1 : 0,
  partialPayFlag: format === 'partial' ? 1 : 0,
  phone: request.phone,
  cooperativeName: request.org_name
  }
  axios.post('Admin/cooperative-registration-approval', payload, {
    headers:{
      Authorization: `Bearer ${credentials.token}`
    }
  }).then(resp=>{
  setLoading(false)
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
      navigate(-1)
    }, 5000);
  })
  .catch(error=>{
    toast(error.response.data.message, {type:'error', autoClose:false})
  setLoading(false)
  })
}
  return (
    <div>
        <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Cooperative approval</h4>
    <div className="rounded-4 mt-3" style={{border:'solid 1px #f7f4f7'}}>
        <div
      className="py-3 px-4 form-header "
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> View cooperative request
      </div>
      </div>
    <form onSubmit={approveRequest}>
    <div className="admin-task-forms p-3">
    <div className="d-flex justify-content-between">
        <label>Cooperative ID:</label>
        <span>{request?.coopId}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Cooperative Email:</label>
        <span>{request?.email}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Name of Cooperative:</label>
        <span>{request?.org_name}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Cooperative Number:</label>
        <span>{request?.phone}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Cooperative Contact Person:</label>
        <span>{request?.contact_person}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Cooperative Address:</label>
        <span>{request?.org_Address}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Designation:</label>
        <span>{request?.designation}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>No of Members:</label>
        <span>{request?.memberStrength}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>State:</label>
        <span>{request?.stateCode}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Amount to be paid:</label>
        <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.amount)}</span>
    </div>
    <div className="d-flex justify-content-between">
        <label>Total amount payable</label>
        <span>{amountPaying?.toLocaleString('en-US')}</span>
    </div>
    <div>
    <label>Select payment format:</label>
    <div className="d-flex justify-content-between" style={{fontSize:'14px', color:'#4d4d4d'}}>
       <div className='d-flex gap-1 align-items-center'> 
        <input type='radio' value='default'  name='format' onChange={(e)=>setFormat(e.target.value)}/>Default</div>
       <div className='d-flex gap-1 align-items-center'>
        <input type='radio' value='discount' name='format' onChange={(e)=>setFormat(e.target.value)}/>Discount</div>
       <div className='d-flex gap-1 align-items-center'>
        <input type='radio' value='partial' name='format' onChange={(e)=>setFormat(e.target.value)}/>Partial
        </div>
    </div>
    </div>
    <div>
      {
      format === 'discount' &&
    <div className='d-flex flex-column'>
      <label htmlFor="format">Discount (%)</label>
      <input type="text" name='discount'  className='w-100' onChange={handleChange}/>
    </div> }
    { format === 'partial' &&
    <div className='d-flex flex-column'>
      <label htmlFor="format">Apply partial payment?</label>
      <input type="text" name='partial'  className='w-100' onChange={handleChange}/>
     {format === 'partial' && <span>Outstanding amount: {request?.amount - amountPaying}</span>}
    </div>
    }
    </div>
    </div>
    <div
          className="d-sm-flex justify-content-end gap-3 mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA", fontSize:'14px', borderRadius:'0 0 15px 15px' }}
        >
          <button className="btn-sm border-0 px-3 rounded-4" type="reset">
            Decline request
          </button>
          <button
            className='btn btn-sm pub-btn'
            type="submit"
          >
            Approve request
          </button>
        </div>
    </form>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default ViewRequest
