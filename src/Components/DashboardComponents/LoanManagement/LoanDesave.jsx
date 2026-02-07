import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { toast, ToastContainer } from 'react-toastify'

const LoanDesave = () => {
  const [accounts, setAccounts]= useState([])
  const [gl, setGl]= useState('')
  const [account, setAccount]= useState('')
  const [mode, setMode]= useState('')
  const [details, setDetails]= useState({})
  const [settlement, setSettlement]= useState({})
  const {credentials}= useContext(UserContext)
  const [due, setDue] = useState({})

const getAccounts=()=>{
  axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setAccounts(resp.data.data))
}

const getDetails=()=>{
  axios(`LoanApplication/loan-repayment-account-number-text-changed?AccountNumber=${account}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setDetails(resp.data.data))
}
useEffect(()=>{
  getAccounts()
},[])

useEffect(()=>{
getDetails()
},[account])
const getSettlementAccountDetails=()=>{
  axios(`LoanApplication/loan-de-save-account-to-repay-from-selected-changed?AccountToRepayFrom=${gl}`,
     {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setSettlement(resp.data.data.loanFundingSourceAccountNoDetails))
}
useEffect(()=>{
getSettlementAccountDetails()
}, [gl])

const getDues=()=>{
  axios(`LoanApplication/loan-de-save-liquidation-mode-selected-index-changed?AccountNumber=${account}&ValueDate=${new Date().toLocaleDateString('en-CA')}&LiquidationMode=${mode}&CurrentBalance=${details?.loanAccountDetails?.currentBalance}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }})
  .then(resp=>setDue(resp.data.data))
}

useEffect(()=>{
getDues()
}, [account, details?.loanAccountDetails?.currentBalance, mode,])

const postDesave=(e)=>{
  const payload={
  accountNumber: account,
  accountToRepayFrom: gl,
  valueDate: new Date(),
  liquidationMode: mode
  }
  e.preventDefault()
  axios.post('LoanApplication/loan-de-save',payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>toast(resp.data.data, {type:'success', autoClose:5000, pauseOnHover:true}))
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
    <div className="mb-4 mt-2">
      <span className="active-selector">Loan Liqudation</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <span style={{ fontWeight: "500", fontSize: "16px", color:'#333' }}>
         Loan Liqudation
          </span>
      </div>
        <form onSubmit={postDesave}>
        <div>
          <div className="px-3 admin-task-forms bg-white py-4">
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="account" style={{ fontWeight: "500" }}>
                Select Account Number<sup className="text-danger">*</sup>
              </label>
              <select name="account" required onChange={(e)=>setAccount(e.target.value)}>
                <option value="">Select</option>
                {
                  accounts.map((account, i)=>(
                    <option value={account.accountNumber} key={i}>
                    {`${account.acctName}  >> ${account.accountNumber} >> ${account.product}`}
                  </option>
                  ))
                }
                </select>
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="account" style={{ fontWeight: "500" }}>
                Select Repayment Account<sup className="text-danger">*</sup>
              </label>
              <select name="gl" required onChange={(e)=>setGl(e.target.value)}>
                <option value="">Select</option>
                {
                  details?.repaymentAccounts?.map((account, i)=>(
                    <option value={account.accountNo} key={i}>
                    {account.accountName}
                  </option>
                  ))
                }
                </select>
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="mode" style={{ fontWeight: "500" }}>
                Liquidation Mode<sup className="text-danger">*</sup>
              </label>
              <select required onChange={(e)=>setMode(e.target.value)} name="mode" >
                <option value="">Select</option>
                <option  Value="1" > Charge Unpaid Interest Till Current Month</option>
			          <option Value="2" > Charge All Scheduled Unpaid Interest </option>
			          <option Value="3" > No Interest Charged</option>
                </select>
            </div>
          </div>
    </div>
        <div className="px-3 mb-4">
          <div
                className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#EDF4FF", paddingTop: "10px", paddingInline:'15px', borderRadius:'10px 10px 0 0' }}>
                  <p>Loan Account Details</p>
                </div>
          <div className="accounting-form-container">
                <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Product:</span>
                  <p>{settlement?.settlementAccountProduct}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Number:</span>
                  <p>{settlement?.settlementAccountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Name:</span>
                  <p>{settlement?.settlementAccountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Balance:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(settlement?.settlementAccountBalance)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Type:</span>
                  <p>{details?.loanAccountDetails?.lonType}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{details?.loanAccountDetails?.branch}</p>
                </div>
                </div>
                <div className='d-flex flex-column gap-2 px-3'>
                <div className="d-flex gap-3 discourse">
                  <span>Account Name:</span>
                  <p>{details?.loanAccountDetails?.accountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Amount:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.loanAccountDetails?.loanAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Current Balance:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.loanAccountDetails?.currentBalance)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest Due:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(due?.interestDue)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Total Due:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(due?.totalDue)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan:</span>
                  <p>{details?.loanAccountDetails?.loanTerm}</p>
                </div>
                </div>
              </div>
              </div>
              </div>
      <div
        className="d-flex justify-content-end gap-3 py-4 px-2"
        style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
      >
        <button
          className="btn btn-md rounded-5 py-1 px-3"
          style={{ backgroundColor: "#F7F7F7" }}
          type="reset"
        >
          Discard
        </button>
        <button
          className="btn btn-md text-white rounded-5"
          style={{ backgroundColor: "var(--custom-color)" }}
          type="submit"
        >
          Proceed
        </button>
      </div>
    </form>
    </div>
    <ToastContainer/>
  </div>
  )
}

export default LoanDesave
