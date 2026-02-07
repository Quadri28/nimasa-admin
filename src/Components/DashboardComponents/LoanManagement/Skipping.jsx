import React,{useState, useEffect, useContext, useMemo} from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import UnpaginatedTable from '../Reports/UnpaginatedTable'
import { toast, ToastContainer } from 'react-toastify'

const Skipping = () => {
  const [accounts, setAccounts]= useState([])
  const [id, setId]= useState('')
  const [account, setAccount]= useState('')
  const [data, setData]= useState([])
  const [details, setDetails]= useState({})
  const {credentials}= useContext(UserContext)

const getAccounts=()=>{
  axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setAccounts(resp.data.data))
}

const getDetails=()=>{
  axios(`LoanApplication/loan-skipping-account-number-text-changed?AccountNumber=${account}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    if (resp.data.data.loanScheduleDetails) {
      setData(resp.data.data.loanScheduleDetails)
    }
    setDetails(resp.data.data)
  })
}
useEffect(()=>{
  getAccounts()
},[])

useEffect(()=>{
getDetails()
},[account, id])

const postSkipping=(id)=>{
  const payload={
    uniqueIds: [
      id
    ]
  }
  axios.post('LoanApplication/loan-skipping', payload, {
    headers:{
      Authorization: `Bearer ${credentials.token}`
    }
  }).then(resp=>{
    // getDetails()
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
const column = [
  { Header: "Principal", accessor: "principalRepayment", Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {}).format(value)}</span>
  }) },
  { Header: "Interest", accessor: "interestRepayment", Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {}).format(value)} </span>}) },
  { Header: "Instalment Priority", accessor: "payOrder" },
  { Header: "Date Due", accessor: "dueDate" },
  { Header: "Action", accessor: "action", Cell:(({cell})=>{
    const id = cell.row.original.uniqueID
      return <button onClick={()=>{
        setId(id)
        postSkipping(id)}} className='border-0 btn-md member'
           style={{fontSize:'14px'}}> Skip</button>
  }) },
];


const columns = useMemo(() => column, []);
  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
    <div className="mb-4 mt-2">
      <span className="active-selector">Loan Skipping</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <span style={{ fontWeight: "500", fontSize: "16px", color:'#333' }}>
            Loan Skipping
          </span>
      </div>
        <div>
          <div className="p-3 admin-task-forms  bg-white">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="account" style={{ fontWeight: "500" }}>
                Select Account Number<sup className="text-danger">*</sup>
              </label>
              <select name={account} required onChange={(e)=>setAccount(e.target.value)}>
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
                  <span>Settlement Account Number:</span>
                  <p>{details?.loanAccountDetails?.settlementAccountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Name:</span>
                  <p>{details?.loanAccountDetails?.settlementAccountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Type:</span>
                  <p>{details?.loanAccountDetails?.lonType}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{details?.loanAccountDetails?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Name:</span>
                  <p>{details?.loanAccountDetails?.accountName}</p>
                </div>
                </div>
                <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Loan Amount:</span>
                  <p>{new Intl.NumberFormat('en-US', {}).format(details?.loanAccountDetails?.loanAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Current Balance:</span>
                  <p>{new Intl.NumberFormat('en-US', {}).format(details?.loanAccountDetails?.currentBalance)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Term:</span>
                  <p>{details?.loanAccountDetails?.loanTerm} Month(s)</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Rate:</span>
                  <p>{details?.loanAccountDetails?.loanRate}</p>
                </div>
                </div>
              </div>
              </div>
              </div>
    </div>
    <div className="px-3 mb-3">
       <UnpaginatedTable data={data} columns={columns} filename='LoanSkipping'/> 
       </div>
    <ToastContainer/>
  </div>
  )
}

export default Skipping
