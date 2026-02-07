import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'

const InvestmentStatus = () => {

  const [details, setDetails]= useState({})
  const[accounts, setAccounts]= useState([])
  const [account, setAccount]= useState('')
  const {credentials}= useContext(UserContext)

  const getDetails=()=>{
    axios(`Investment/investment-status?placementAccountNumber=${account}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setDetails(resp.data.data))
  }
  useEffect(()=>{
    getDetails()
  }, [account])
  const getAccounts=()=>{
    axios('Acounting/general-ledger-customer-enquiry?SearchOption=4', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setAccounts(resp.data.data)
    })
  }
  useEffect(()=>{
    getAccounts()
  }, [])

  return (
    <>
 <div className="p-3"
      style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}>
      <div
        className=" d-flex align-items-center gap-2"
        style={{ width: "fit-content" }}
      >
        <span style={{ fontSize: "16px" }}>Investment status </span>
      </div>
    </div>
    <div
      className="px-3 pt-2 pb-4 bg-white" style={{ borderInline: "1px solid #fafafa" }}>
      <div className="admin-task-forms my-4">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Select investment account</label>
            <select name='account' onChange={(e)=>setAccount(e.target.value)} required>
                <option value="">Select</option>
                {
                  accounts.map(account=>(
                    <option value={account.accountNumber} key={account.accountNumber}>
                      {`${account.accountNumber} >> ${account.acctName}`}</option>
                  ))
                }
            </select>
        </div>
      </div>
      <div
                className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#EDF4FF", paddingTop: "10px", paddingInline:'15px', borderRadius:'10px 10px 0 0' }}>
                  <p>Investment Account Details</p>
                </div>
          <div className="accounting-form-container ">
                <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Account Number:</span>
                  <p>{details?.accountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{details?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Code:</span>
                  <p>{details?.productCode}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Name:</span>
                  <p>{details?.productName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Name:</span>
                  <p>{details?.fullName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Investment Amount:</span>
                  <p>{details?.amount}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Balance:</span>
                  <p>{details?.currentBalance}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Term:</span>
                  <p>{details?.term}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Term Frequency:</span>
                  <p>{details?.freqName}</p>
                </div>
                </div>
                <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Start Date:</span>
                  <p>{new Date(details?.startDate).toLocaleDateString('en-US')}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Maturity Date:</span>
                  <p>{new Date(details?.matDate).toLocaleDateString('en-US')}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest Rate:</span>
                  <p>{details?.intrate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Purpose:</span>
                  <p>{details?.purpose}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account:</span>
                  <p>{details?.settlementAcct1}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Status:</span>
                  <p>{details?.statusDesc}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest:</span>
                  <p>{details?.intPayout}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Mature Amount:</span>
                  <p>{details?.matureAmount}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest:</span>
                  <p>{details?.taxAmount}</p>
                </div>
              </div>
              </div>
              </div>
      </div>
    </>
  )
}

export default InvestmentStatus
