import React, { useContext, useEffect, useMemo, useState } from 'react'
import UnpaginatedTable from '../Reports/UnpaginatedTable'
import { FaUsersViewfinder } from 'react-icons/fa6'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import useScreenSize from '../../ScreenSizeHook'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'

const RetirementRequestPosting = () => {
  const [reports, setReports]= useState([])
  const [accounts, setAccounts]= useState([])
  const [account, setAccount]= useState('')
  const [id, setId] = useState('')
  const {credentials} = useContext(UserContext)
  const [request, setRequest]= useState({})
  const [isOpen, setIsOpen] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [reason, setReason]= useState(null)

  const getReports =()=>{
    axios('RequestVerification/retirement-request-postings', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.retirementRequestPostings) {
        setReports(resp.data.data.retirementRequestPostings)
      }}
     )
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
    axios(`RequestVerification/retirement-request-posting?id=${id}`, {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>setRequest(resp.data.data))
  }
  useEffect(()=>{
    getRequest()
  },[id])
  const column=[
    {Header: 'Employee ID', accessor:'employeeId'},
    {Header: 'Full Name', accessor:'fullName'},
    {Header: 'Amount', accessor:'amount', Cell:({value})=>{
      return <span>{value.toLocaleString('en-US')}</span>
    }},
    {Header: 'Transaction Date', accessor:'transactionDate', Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    })},
    {Header: 'Status', accessor:'status'},
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
    width: width > 900 ? "500px" : "320px",
    overFlowY: "scroll",
  },
};

const postPosting=(e)=>{
  e.preventDefault()
  const payload={
    id: request.id,
    narration: 'Retirement posting approval',
    creditAccount: account,
  }
  axios.post('RequestVerification/retirement-request-posting-approval', payload,{headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true}))
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose: false}))
}
const rejectPosting=(e)=>{
  e.preventDefault()
  const payload={
    id: request.id,
    narration: reason
  }
  axios.post('RequestVerification/retirement-request-posting-reject', payload,{headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true})
    setTimeout(() => {
      setIsOpen(false)
    }, 5000);
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose: false}))
}
  return (
    <div className='pt-3'>
      <UnpaginatedTable data={reports} filename='RetirementPostingRequest.csv' columns={columns} />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeView}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
       <h4 className="text-uppercase" style={{fontSize:'18px', fontWeight:'600'}}>Retirement posting </h4> 
      <div className='d-flex flex-column gap-2 mt-3'>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Account Number:</strong> <span> {request?.accountNumber}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Full Name:</strong> <span>{request?.fullName}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Member ID: </strong> <span>{request?.memberId}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Transaction Date:  </strong> <span>{request?.transactionDate}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Amount: </strong> <span>{request?.amount?.toLocaleString('en-US')}</span>
        </div>
       { request?.totalSavingBalance && <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Total Saving Bal: </strong>
         <span>{request?.totalSavingBalance?.toLocaleString('en-US')}</span>
        </div>
        }
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Status: </strong> <span>{request?.status}</span>
        </div>
        <div className="d-flex gap-3" style={{fontSize:'14px'}}>
        <strong>Email: </strong> <span>{request?.email}</span>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 mt-3">
       
      <select name={account} onChange={(e)=>setAccount(e.target.value)}  className="rounded-3 p-2"
                  style={{border:'solid 1px #d3d3d3'}}>
            <option value="">Select Account</option>
            {
              accounts.map(account=>(
                <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
              ))
            }
          </select>
          {isReject && (
              <div className="d-flex mt-3 flex-column">
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
        <div className="d-flex gap-3">
        <form onSubmit={postPosting}>
          <button className='btn btn-md member px-4 py-2'>Post</button>
        </form>
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
                  onClick={rejectPosting}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                  disabled={!reason}
                >
                  Reject
                </button>
              )}
        </div>
      </div>
      </Modal>
      <ToastContainer/>
    </div>
  )
}

export default RetirementRequestPosting
