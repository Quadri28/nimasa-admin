import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import UnpaginatedTable from '../Reports/UnpaginatedTable'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'
import { AiOutlineEye  } from 'react-icons/ai'

const SavingAccountRequest = () => {
  const [requests, setRequests]= useState([])
  const [id, setId]= useState('')
  const [isOpen, setIsOpen]= useState(false)
  const [request, setRequest]= useState({})
  const [view, setView] = useState(null)
  const {credentials}= useContext(UserContext)
  const [reason, setReason] = useState('')
  const [isReject, setIsReject] = useState(false)


  const getRequests=()=>{
    axios('RequestVerification/saving-account-requests', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.savingAccounts) {
        setRequests(resp.data.data.savingAccounts)
      }}
      )
  }
  
  useEffect(()=>{
    getRequests()
  },[])

  const openModal=()=>{
    setIsOpen(true)
  }
  const closeModal=()=>{
    setIsOpen(false)
    setIsReject(false)
  }
  const getSingleRequest=()=>{
    axios(`RequestVerification/saving-account-request?id=${id}`,{headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setRequest(resp.data.data))
  }
  useEffect(()=>{
    getSingleRequest()
  },[id])
  const column = [
    { Header: "Customer ID", accessor: "customerId" },
    // { Header: "User Name", accessor: "userName" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Product Name", accessor: "productName" },
    { Header: "Transaction Date", accessor: "transactionDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    }) },
    { Header: "Status", accessor: "status" },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.id;
        return (
          <div className='d-flex justify-content-center'>
           <AiOutlineEye  style={{cursor:'pointer'}}
            onClick={()=>{
              setId(id)
              openModal()
            }
           }/>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

const approveSaving=(e)=>{
  e.preventDefault()
  const payload={
  id: request?.id,
  sweepToAccount: request.sweepToAccount,
  blockViewOnAccount: view ? 1 : 0,
  crInterestRate: request?.product?.creditInterest,
  drInterestRate: request?.product?.debitInterest,
  subBranch: '',
  accountDescription: request?.accountDescription,
  sweepToAmount: request?.product?.penalRate
  }
  axios.post('RequestVerification/saving-account-request-approved', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message,{type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
      closeModal()
      getRequests()
    }, 5000);
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

const rejectSaving=(e)=>{
  e.preventDefault()
  const payload={
  id: request.id,
  sweepToAccount: request.sweepToAccount,
  blockViewOnAccount: view === true ? 1 : 0,
  crInterestRate: request?.product?.creditInterest,
  drInterestRate: request?.product?.debitInterest,
  subBranch: request.subBranch,
  accountDescription: request.accountDescription,
  sweepToAmount: request?.product?.penalRate,
  narration: reason
  }
  axios.post('RequestVerification/saving-account-request-reject', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message,{type:'success', autoClose:5000, pauseOnHover:true})
    setIsReject(false)
    closeModal()
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

  return (
    <div>
      <UnpaginatedTable
        data={requests}
        filename="SavingAccountRequest.csv"
        columns={columns}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
        <h3 style={{fontSize:'16px', fontWeight:'600', textAlign:'center'}}>Add savings Account</h3>
              <div className="row mt-3">
              <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Full Name: {request?.fullName}</span>
                  <span>Employee ID: {request?.employeeId}</span>
                  <span>Employee Username: {request?.employeeUsername}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Branch Code: {request?.branchCode} </span>
                  <span>Branch Name: {request?.branchName}</span>
                  <span>Status: {request?.status}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Email: {request?.email}</span>
                  <span>Product Name: {request?.product?.productName}</span>
                  <span>Product Start Date: {request?.product?.productStartDate}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Product Expiry Date: {request?.product?.productExpiryDate}</span>
                  <span>Product Currency: {request?.product?.productCurrency}</span>
                  <span>Min. Acct. Bal: {request?.product?.minimumAccountBalance}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Product Type: {request?.product?.productType}</span>
                  <span>Opening Bal. : {request?.product?.openingBalance}</span>
                  <span>Closing Bal. : {request?.product?.closingBalance}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Min. Interest: {request?.product?.minimumInterest}</span>
                  <span>Credit Interest : {request?.product?.creditInterest}</span>
                  <span>Debit Interest. : {request?.product?.debitInterest}</span>
                  <span>Sweep to Account. : {request?.product?.sweeping}</span>
                <label htmlFor=""> Block Account view <input type="checkbox" 
                name={view} onChange={(e)=>setView(e.target.checked)}/></label>
                </div>
                {isReject ?
            <div className="d-flex mt-3 flex-column">
              <label htmlFor="reason">Enter reason to reject</label>
              <input type="text" name={reason} onChange={(e)=>setReason(e.target.value)}  className="rounded-3 p-2"
                  style={{border:'solid 1px #d3d3d3'}}/>
            </div> : ''
            }
                <div className="d-flex gap-3 mt-4 justify-content-end">
                  <form onSubmit={approveSaving}>
                  <button className='border-0 btn-md member' type='submit'>Approve</button>
                  </form>
                   {!isReject? <button  className="btn btn-md rounded-5" onClick={()=>setIsReject(true)} style={{backgroundColor:'#ddd', fontSize:'14px'}}>
                Reject</button> : 
                <button  className="border-0 btn-md btn rounded-5" onClick={rejectSaving} style={{backgroundColor:'#ddd', fontSize:'14px'}}>
                Reject</button>}
                </div>
            </div>
      </Modal>
<ToastContainer/>
    </div>

  )
}
export default SavingAccountRequest
