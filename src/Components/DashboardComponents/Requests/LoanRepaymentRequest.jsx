import React, { useContext, useEffect, useMemo, useState } from 'react'
import UnpaginatedTable from '../Reports/UnpaginatedTable'
import { FaUsersViewfinder } from 'react-icons/fa6'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import useScreenSize from '../../ScreenSizeHook'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'

const LoanRepaymentRequest = () => {
  const [reports, setReports]= useState([])
  const [accounts, setAccounts]= useState([])
  const [account, setAccount]= useState('')
  const [isReject, setIsReject] = useState(false)
  const [reason, setReason]= useState(null)
  const [id, setId] = useState('')
  const {credentials} = useContext(UserContext)
  const [request, setRequest]= useState({})
  const [isOpen, setIsOpen] = useState(false);

  const getReports =()=>{
    axios('RequestVerification/loan-repayment-requests', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.loanRepayments) {
      setReports(resp.data.data.loanRepayments)
      }
    })
  }
  const getAccounts=()=>{
    axios('RequestVerification/gl-account-select', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setAccounts(resp.data.data.glAccounts))
  }
  useEffect(()=>{
    getReports()
    getAccounts()
  },[])
  const getRequest=()=>{
    axios(`RequestVerification/loan-repayment-request?id=${id}`, {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>setRequest(resp.data.data))
  }
  useEffect(()=>{
    getRequest()
  },[id])
  const column=[
    {Header: 'Member ID', accessor:'memberId'},
    {Header: 'Full Name', accessor:'employeeName'},
    {Header: 'Amount', accessor:'amount', Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    {Header: 'Transaction Date', accessor:'datePaid', Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    })},
    {Header: 'Status', accessor:'status', Cell:(({value})=>{
      if (value === 'Approved') {
        return <div className="active-status px-3">
          <hr /> {value}
        </div>
      }else{
        return <div className='pending-status px-3'><hr />{value}</div>
      }
    })},
    {Header: 'Actions', accessor:'action', Cell:({cell})=>{
      const id = cell.row.original.id
        return <div className="d-flex justify-content-center" 
        onClick={()=>{
            openView();
          setId(id)}}>
            <FaUsersViewfinder style={{cursor:'pointer'}}/>
        </div>
    }},
]
function closeView() {
  setIsOpen(false);
  setIsReject(false)
}
function openView() {
  setIsOpen(true);
}
const columns = useMemo(() => column, []);
const { width } = useScreenSize();
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    height:'65%',
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    width: width > 900 ? "800px" : "320px",
    overFlowY: "scroll",
  },
};

// Function to Post Withdrawal account
const postAccount=(e)=>{
  e.preventDefault()
  const payload ={
    debitAccountNumber: account,
    id: request.id,
    instalDueNo: request.instalDueNo,
    principalAmount: request.principalAmount,
    accountNumber: request.accountNumber
  }
  axios.post('RequestVerification/loan-repayment-request-approved', payload,{headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true})
    setTimeout(() => {
      closeView()
      getReports()
    }, 5000);
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose: false}))
}

// Function to reject Withdrawal account
const rejectAccount=(e)=>{
  e.preventDefault()
  const payload ={
    narration: reason,
    id: request.id,
  }
  axios.post('RequestVerification/loan-repayment-request-reject', payload,{headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true}))
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose: false}))
}
  return (
    <div>
      <UnpaginatedTable data={reports} filename='LoanRepaymentRequest.csv' columns={columns} />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeView}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
       <h4 className="text-uppercase" style={{fontSize:'18px', fontWeight:'600', textAlign:'center'}}>Loan Repayment Request </h4> 
      <div className='d-flex flex-column gap-2 mt-3'>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Account Number:</strong> <span> {request?.accountNumber}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Full Name:</strong> <span>{request?.memberName}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Member ID: </strong> <span>{request?.memberNo}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Transaction Date:  </strong> <span>{request?.transactionDate}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Amount: </strong> <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.amount)}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Principal Amount: </strong> <span>
          {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.principalAmount)}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Total Repay Amount: </strong> <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.totalRepayAmount)}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Status: </strong> <span>{request?.status}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Narration:  </strong> <span>{request?.narration}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Balance: </strong> <span> {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.balance)}</span>
        </div>
      </div>
      <h3 style={{fontSize:'18px', fontWeight:'600', marginTop:'1rem'}}>Loan Schedules</h3>
          <div className="table-responsive">
          <table className='table border request-table' id='customers'>
            <thead>
              <tr>
                <th>Acct NO</th>
                <th>Principal</th>
                <th>Date</th>
                <th>Interest</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {request?.loanScheduleDetails?.map(loan=>(
                 <tr key={loan.accountNumber}>
                  <td>{loan.accountNumber}</td>
                 <td>{ new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.principal)}</td>
                 <td>{loan.date}</td>
                 <td>{loan.interest}</td>
                 <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.balance)}</td>
                 <td>{loan.status}</td>
               </tr>
              ))}
             
            </tbody>
          </table>
          <div className="d-flex flex-column gap-3 mt-3">
          <select name={account} onChange={(e)=>setAccount(e.target.value)} 
           className='w-100 mb-2 p-2 rounded-3' style={{backgroundColor:'#fafafa', border:'solid 1px #f2f2f2'}}>
            <option value="">Select Account</option>
            {
              accounts.map(account=>(
                <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
              ))
            }
          </select>
              {isReject && (
              <div className="d-flex mt-1 flex-column">
                <label htmlFor="reason">Enter reason to reject</label>
                <input
                  type="text"
                  name={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-3 p-2"
                  style={{border:'solid 1px #d3d3d3'}}
                />
              </div>
            ) }
        <div className="d-flex gap-3 justify-content-end">
          <button className='btn-md member px-4 border-0' onClick={postAccount}>Post</button>
          {!isReject ? (
                <button
                  className="btn btn-md rounded-5 px-4 py-2"
                  onClick={() => setIsReject(true)}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              ) : (
                <button
                  className="btn btn-md rounded-5 px-4 py-2"
                  onClick={rejectAccount}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                  disabled={!reason}
                >
                  Reject
                </button>
              )}
        </div>
      </div>
          </div>
      </Modal>
      <ToastContainer/>
    </div>
  )
}

export default LoanRepaymentRequest
