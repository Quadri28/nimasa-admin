import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import UnpaginatedTable from '../Reports/UnpaginatedTable'
import Modal from 'react-modal'
import useScreenSize from '../../ScreenSizeHook'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const LoanRequest = () => {
  const [requests, setRequests]= useState([])
  const {credentials}= useContext(UserContext)
  const [guarantors, setGuarantors]= useState([])
  const [loan, setLoan]= useState({})
  const [id, setId]= useState('')
  const [isReject, setIsReject] = useState(false)
  const [reason, setReason] = useState('')
  const [coop, setCoop]= useState({
    id:'',
    name:''
  })
  const [isOpen, setIsOpen]= useState(false)
  const [guarantorOpen, setGuarantorOpen]= useState(false)
  const [details, setDetails]= useState({})
  const [loading, setLoading]= useState(false)
  
  const getLoans=()=>{
    axios(`RequestVerification/loan-request?applicationNo=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{ if (resp.data.data) {
      setLoan(resp.data.data)
    }})
  }

  const getRequests=()=>{
axios('RequestVerification/loan-requests',{headers:{
  Authorization: `Bearer ${credentials.token}`
}}).then(resp=>{
  if (resp.data.data.loans) {
  setRequests(resp.data.data.loans)
  }})}

  useEffect(()=>{
    getRequests()
  },[])

  const getGuarantors= async()=>{
    await axios(`RequestVerification/get-loan-guarantors?applicationNo=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.loanGuarantors) {
        setGuarantors(resp.data.data.loanGuarantors)
      }else{
        setGuarantors([])
      }
     })
  }

useEffect(()=>{
getGuarantors()
getLoans()
  }, [id, isOpen, guarantorOpen])

  const getDetails=()=>{
    axios(`RequestVerification/get-loan-guarantor-details?coopNo=${coop?.id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setDetails(resp.data.data))
  }

  useEffect(()=>{
    getDetails()
  },[coop?.id])

// Functions for opening and closing modals
const openLoan=()=>{
setIsOpen(true)
}
const closeLoan=()=>{
  setIsOpen(false)
  setIsReject(false)
}

const openGuarantor=()=>{
  setGuarantorOpen(true)
}
const closeGuarantor=()=>{
  setGuarantorOpen(false)
}
const { width } = useScreenSize();

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    height: details?.activeLoanProducts?.length > 0 ?'70%' : '40%',
    width: width > 600 ? "800px" : "320px",
    overFlowY: "scroll",
  },
};

  const column =[
    {Header:'Loan No', accessor:'loanNo' },
    {Header:'Full Name', accessor:'fullName' },
    {Header:'Amount', accessor:'amount', Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    {Header:'Product Name', accessor:'productName' },
    {Header:'Date applied', accessor:'dateApplied', Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    }) },
    {Header:'Status', accessor:'status', Cell:(({value})=>{
      if (value === 'Pending') {
      return <div className='suspended-status px-2'>
        <hr /> <span>{value}</span>
      </div>
      }else{
        return <div className='active-status px-2'>
        <hr /> <span>{value}</span>
      </div>
      }
    }) },
    {Header:'Action', accessor:'', Cell:({cell})=>{
      const id= cell.row.original.loanNo
      const status = cell.row.original.status
      const noOfGuarantors= cell.row.original.numberOfGuarantors
      return <div className='d-flex gap-2 flex-wrap'>
        
        {noOfGuarantors > 0 &&<button className='border-0 btn-md member' style={{fontSize:'12px'}} onClick={()=>{
          setId(id)
          openGuarantor()
        }}>
          View Guarantors</button>}
        <button className='border-0 btn-md py-2 px-3 rounded-5' style={{fontSize:'12px'}} 
        onClick={()=>{ 
          setId(id)
          openLoan()
          }}>View Loan</button>
          {
            status ==='Approved' ?
             <Link to={`${id}`} className='btn btn-md btn-success rounded-5' style={{fontSize:'12px'}}
             onClick={()=>{setId(id)}}>
               Disburse Loan</Link>: ''
          }
      </div>
    }},
  ]
const columns = useMemo(() => column, []);
const navigate = useNavigate()
const approveRequest=()=>{
  const payload={
  applicationNo: id,
  productName: loan.productName,
  frequency: loan.frequencyCode,
  interest: loan.interestRate
  }
  setLoading(true)
  axios.post('RequestVerification/loan-request-approval', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
  setLoading(false)
  setTimeout(() => {
  getRequests()
  closeLoan()
  navigate(-1)
  }, 5000);
})
  .catch(error=>{
    toast(error.response.data.message, {type:'error', autoClose:false})
    setLoading(false)
  })
}

const rejectRequest=()=>{
  const payload={
    narration: reason,
    applicationNo: id
  }
  axios.post('RequestVerification/loan-request-reject', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
      setIsOpen(false)
    }, 5000);
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
  return (
    <div>
   <UnpaginatedTable data={requests} filename='LoanRequests.csv' columns={columns} />
   <Modal
        isOpen={guarantorOpen}
        onRequestClose={closeGuarantor}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
          <h3 style={{fontSize:'18px', fontWeight:'600', textAlign:'center', marginBottom:'1rem'}}>View Guarantors</h3>
          <div className="table-responsive">
          <table className='table border request-table' id='customers'>
            <thead>
              <tr>
                <th></th>
                <th>Guarantor NO</th>
                <th>Guarantor Name</th>
                <th>Status</th>
                <th>Guarantor's phone</th>
                <th>Guarantor's Email</th>
              </tr>
            </thead>
            <tbody>
              {guarantors.map(guarantor=>(
                 <tr key={guarantor.guarantorNo}>
                  <td style={{cursor:'pointer', color:'blue'}} 
                  onClick={()=>setCoop({id:guarantor.guarantorNo, name:guarantor.guarantorName})}>Guarantor Detail</td>
                 <td>{guarantor.guarantorNo}</td>
                 <td>{guarantor.guarantorName}</td>
                 <td>{guarantor.status}</td>
                 <td>{guarantor.phone}</td>
                 <td>{guarantor.guarantorEmail}</td>
               </tr>
              ))} 
            </tbody>
          </table>
          </div>
        {details?.activeLoanProducts?.length >0 && <p className='text-capitalize'>Guarantor's name:{coop?.name}</p>}
          {details?.activeLoanProducts?.length >0 && <>
          <div className='table-responsive my-3'>
          <table id='customers' className='border request-table'>
            <thead>
            <tr>
              <th>Product Name</th>
              <th>Balance</th>
            </tr>
            </thead>
            <tbody>
              {details?.activeLoanProducts?.map(product=>(
            <tr key={product.productName}>
              <td>{product.productName}</td>
              <td>{new Intl.NumberFormat('en-US', {}).format(product.balance)}</td>
            </tr>
              ))
              }
            </tbody>
          </table>
          </div>
          </>}
          {details?.activeLoansGuaranteed?.length >0 && <>
            <h3 style={{fontSize:'18px', fontWeight:'500'}}>Active loan guaranteed </h3>
          <div className='table-responsive'>
              <table id='customers' className='border request-table'>
                <thead >
                  <tr>
                    <th>S/N</th>
                    <th>Member No</th>
                    <th>Employee Name</th>
                    <th>Account No</th>
                    <th>Loan Amount</th>
                    <th>Current Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {details?.activeLoansGuaranteed?.map(detail=>(
                  <tr key={detail.sn}>
                  <td>{detail.sn}</td>
                  <td>{detail.memberNo}</td>
                  <td>{detail.employeeName}</td>
                  <td>{detail.accountNumber}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(detail.loanAmount)}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(detail.currentBalance)}</td>
                  </tr>
                  ))
                 
                }
                </tbody>
              </table>
            </div>
            </>}
      </Modal>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeLoan}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
      <h3 style={{fontSize:'18px', fontWeight:'600', textAlign:'center', marginBottom:'1rem'}}>Loan Request  </h3>
              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <span>Member No: {loan?.employeeId}</span>
                <span>Member Name: {loan?.fullname}</span>
                <img src={loan?.profileImage} alt="profile image" width={50} className='img-fluid rounded-2'/>
              </div>
              <div className="row mt-3">
              <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Loan Product: {loan?.productName}</span>
                  <span>Loan Amount: {new Intl.NumberFormat('en-US', {}).format(loan?.loanAmount)}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Loan Duration: {loan?.duration} Month</span>
                  <span>Interest Rate: {loan?.interestRate}%</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Bank: {loan?.bank}</span>
                  <span>Account Name: {loan?.accountName}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Account Number: {loan?.accountNumber}</span>
                  <span>Contribution Amount: {new Intl.NumberFormat('en-US', {}).format(loan?.contributionAmount)}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between flex-wrap'>
                  <span>Net Monthly pay: {new Intl.NumberFormat('en-US', {}).format(loan?.netMontlyPay)}</span>
                  <span>Date Joined: {loan?.dateJoined}</span>
                </div>
            </div>
            <div className='mt-4'>
              <p style={{fontSize:'14px', fontWeight:'600'}}>Product Details:</p>
              <div className="table-responsive">
              <table className='border request-table' id='customers'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  { loan?.loanAccounts?.map(account=>(
                  <tr>
                    <td>{account.product}</td>
                    <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:'2'}).format(account.balance)}</td>
                    <td>{account.status}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            <div className='mt-4'>
              <p style={{fontSize:'14px', fontWeight:'600'}}>Loan Schedules:</p>
              <div className="table-responsive">
              <table className='border request-table' id='customers'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Total Repayment</th>
                    <th>Balance</th>
                    <th>Total Repayment + Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  { loan?.theLoanSchedules?.map(account=>(
                  <tr>
                    <td>{new Date(account.date).toDateString('en-us')}</td>
                    <td>{new Intl.NumberFormat('en-US', {}).format(account.principal)}</td>
                    <td>{new Intl.NumberFormat('en-US', {}).format(account.interest)}</td>
                    <td>{new Intl.NumberFormat('en-US', {}).format(account.totalRepay)}</td>
                    <td>{new Intl.NumberFormat('en-US', {}).format(account.balance)}</td>
                    <td className='text-center'>{new Intl.NumberFormat('en-US', {}).format(account.totalRepaymentContribution)}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
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
              </div>
              <div className="d-flex mt-5 gap-3 align-items-center justify-content-end">
                <button className="border-0 member py-2 btn-md"
                disabled={loading} onClick={approveRequest}>Approve</button>
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
                  onClick={rejectRequest}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
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

export default LoanRequest
