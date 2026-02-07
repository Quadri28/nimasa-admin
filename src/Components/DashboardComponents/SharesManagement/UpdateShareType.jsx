import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'

const UpdateShareType = () => {
  const [input, setInput]= useState({})
  const [ledgers, setLedgers]= useState([])
  const{id}= useParams()
const {credentials}= useContext(UserContext)

const fetchLedgerAccounts = () => {
      axios("Acounting/general-ledger-customer-enquiry?SearchOption=1", {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }).then((resp) => setLedgers(resp.data.data));
    };
useEffect(()=>{
fetchLedgerAccounts()
},[])
  const getSingleType=()=>{
    axios(`ShareManagement/share-type?id=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setInput(resp.data.data))
  }
  useEffect(()=>{
getSingleType()
  }, [id])
    const handleTypeChange=(e)=>{
      const { name, value, type, checked } = e.target;
        setInput({...input, [name]: type === 'checkbox' ? checked :value})
      }

      const updateShare=(e)=>{
        e.preventDefault()
        const payload={
          id: id,
          maximumSharedUnit: Number(input.maximumSharedUnit),
            shareCode:input.shareCode,
            shareProductName:input.shareProductName,
            sharePrice:input.sharePrice,
            shareDescription:input.shareDescription,
            noOfShares: input.noOfShares,
            shareTypeGL: input.shareTypeGL,
            lockShareWithdrawal: input.lockShareWithdrawal
        }
        e.preventDefault()
        axios.post(`ShareManagement/update-share-type?id=${id}`, payload, {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
          setTimeout(() => {
            navigate(-1)
          }, 5000);
        }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
      }
      const navigate= useNavigate()
  return (
    <>
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
      <div className="mb-4">
        <span className="active-selector">Shares Type</span>
      </div>
      <div style={{ border: "solid .2px #E6E6E6", borderRadius: "15px 15px 0 0" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <p style={{ fontWeight: "500", fontSize: "16px" }}>
            <BsArrowLeft onClick={() => navigate(-1)} style={{cursor:'pointer'}}/> Update Share Type
          </p>
        </div>
       <form onSubmit={updateShare} className='p-3'>
        <div className="admin-task-forms">
        <div className="d-flex flex-column gap-1 ">
              <label htmlFor="sharesCode" style={{ fontWeight: "500" }}>
                Shares Code<sup className="text-danger">*</sup>
              </label>
              <input name="shareCode" onChange={handleTypeChange} disabled value={input?.shareCode}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="shareProductName" style={{ fontWeight: "500" }}>
                Share Product Name
              </label>
              <input name="shareProductName" onChange={handleTypeChange} value={input?.shareProductName}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="noOfShares" style={{ fontWeight: "500" }}>
                Number of Share
              </label>
              <input name="noOfShares" onChange={handleTypeChange} value={input?.noOfShares}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="sharePrice" style={{ fontWeight: "500" }}>
                Share Product Price
              </label>
              <input name="sharePrice" onChange={handleTypeChange} value={input?.sharePrice}/>
            </div>
            <div>
              <label htmlFor="shareTypeGL">share GL Account</label>
              <select name="shareTypeGL" as='select' onChange={handleTypeChange} value={input?.shareTypeGL}>
              <option value="">Select Account</option>
              {ledgers.map((enquiry) => (
                    <option
                      value={enquiry.accountNumber}
                      key={enquiry.accountNumber}
                    >
                      {enquiry.acctName} {`>> ${enquiry.product}`}
                    </option>
                  ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="maximumSharedUnit" style={{ fontWeight: "500" }}>
                Max. Unit Allowed
              </label>
              <input name="maximumSharedUnit" value={input?.maximumSharedUnit} onChange={handleTypeChange}/>
            </div>
            </div>
            <div className="d-flex align-items-center gap-1 px-2 ">
              <label htmlFor="lockShareWithdrawal" style={{ fontWeight: "500" }}>
                Lock Share Withdrawal
              </label>
              <input name="lockShareWithdrawal" type='checkbox' checked={input?.lockShareWithdrawal}
               onChange={handleTypeChange}/>
            </div>
            <div className="admin-task-forms px-2">
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="description" style={{ fontWeight: "500" }}>
                Description
              </label>
              <textarea name="shareDescription"  value={input?.shareDescription} onChange={handleTypeChange}/>
            </div>
        </div>
        <div className="d-flex mt-3 justify-content-end">
        <button className="btn btn-md px-4 rounded-4 text-white" style={{backgroundColor:'var(--custom-color)'}} type="submit">Update</button>
        </div>
        </form>
        </div>
        </div>
        <ToastContainer/>
    </>
  )
}

export default UpdateShareType
