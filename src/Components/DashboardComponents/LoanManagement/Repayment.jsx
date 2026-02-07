import React,{useState, useContext, useEffect} from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { toast, ToastContainer } from 'react-toastify'
import Modal from 'react-modal'
import useScreenSize from '../../ScreenSizeHook'

const Repayment = () => {
  const [accounts, setAccounts]= useState([])
  const [gl, setGl]= useState('')
  const [account, setAccount]= useState('')
  const [details, setDetails]= useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [settlement, setSettlement]= useState({})
  const [selectedLoan, setSelectedLoan]= useState({})
  const [id, setId]= useState(null)
  const [payOrder, setPayOrder] = useState(null)
  const [input, setInput] = useState({
    interest:0,
    principal: 0
  })
  const {credentials}= useContext(UserContext)

const getAccounts=()=>{
  axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setAccounts(resp.data.data))
}
const hasPartialPay = credentials?.logInfo?.userRolesPermission.some(
  (permission) => permission.menuId === "257"
);
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

function handleOpen() {
setIsOpen(true)
}

function handleClose() {
setIsOpen(false)
}

const handleChange =(e)=>{
  const name = e.target.name;
  const value = e.target.value;
  setInput({...input, [name]:value})
}

 const { width } = useScreenSize()
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "70%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 900 ? "400px" : "320px",
      overFlowY: "scroll",
    },
  };

const PostRepayment=(e)=>{
  e.preventDefault()
  const payload={
    accountNumber: account,
    accountToRepayFrom: gl,
    uniqueIds: [
      id
    ]
  }
  const confirmed = window.confirm("Are you sure you want to post this repayment?");
  if (!confirmed) return; 
  axios.post('LoanApplication/loan-re-payment', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
      getDetails(account)
    }, 5000); 
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

const makePartialRepayment=(e)=>{
  e.preventDefault()
  const payload={
  accountNumber: account,
  glAccountNumber: gl,
  instalDue: payOrder,
  paidPrincipal: input.principal,
  paidInterest: input.interest,
  uniqueId: id,
  }
  axios.post('LoanApplication/loan-partial-repayment', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.data, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
      getDetails(account)
      setIsOpen(false)
      setInput({})
    }, 5000); 
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
  return (
    <div className="mt-4 bg-white p-3 rounded-4">
    <div className="mb-4 mt-2">
      <span className="active-selector">Loan Repayment</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <span style={{ fontWeight: "500", fontSize: "16px", color:'#333' }}>
     Loan Repayment
          </span>
      </div>
      <div>
      <form onSubmit={PostRepayment}>
        <>
          <div className="p-3 admin-task-forms bg-white">
            <div className="d-flex flex-column g-2 ">
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
            <div className="d-flex flex-column g-2 ">
              <label htmlFor="account" style={{ fontWeight: "500" }}>
                Select Repayment Account<sup className="text-danger">*</sup>
              </label>
              <select name="gl" required onChange={(e)=>setGl(e.target.value)}>
                <option value="">Select</option>
                {
                  details?.repaymentAccounts?.map((account, i)=>(
                    <option value={account.accountNo} key={i}>
                    {account.accountName.replace(/\s/g, "")}
                  </option>
                  ))
                }
                </select>
            </div>
          </div>
    </>
    <div className="px-3 mb-4">
          <div className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#EDF4FF", paddingTop: "10px", paddingInline:'15px', borderRadius:'10px 10px 0 0' }}>
                  <p>Loan Account Details</p>
                </div>
          <div className="accounting-form-container">
                <div className="d-flex flex-column gap-2 px-3">
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
                <div className="d-flex gap-3 discourse">
                  <span>Loan Amount:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.loanAccountDetails?.loanAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Current Balance:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.loanAccountDetails?.currentBalance)}</p>
                </div>
                </div>
                <div className="d-flex flex-column  gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Loan Rate:</span>
                  <p>{details?.loanAccountDetails?.loanRate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Remaining Term:</span>
                  <p>{details?.loanAccountDetails?.remainingTerm}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Term:</span>
                  <p>{details?.loanAccountDetails?.loanTerm} Month(s)</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Funding Account Name:</span>
                  <p>{settlement?.settlementAccountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Funding Account Balance:</span>
                  <p>{new Intl.NumberFormat('en-US', {}).format(settlement?.settlementAccountBalance)}</p>
                </div>
                </div>
              </div>
              </div>
              </div>
    <div className="table-responsive px-3 mb-4">
          <h4 style={{ fontSize: "16px", fontWeight: "400" }}>
            Loan Schedule Information
          </h4>
          <table className="table" id="customers">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Principal Repayment</th>
                <th>Interest Repayment</th>
                <th>Total Repayment</th>
                <th>Pay Order</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {details?.loanScheduleDetails?.map((schedule) => {
                const {uniqueID, payOrder}= schedule
                return <>
                <tr key={schedule.id}>
                  <td>{schedule.dueDate}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(schedule.principalRepayment)}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(schedule.interestRepayment)}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(schedule.totalRepayment)}</td>
                  <td>{schedule.payOrder}</td>
                  <td> 
                    <span className={schedule.paymentStatus === 'Outstanding' ?  'suspended-status px-3': 'pending-status px-3'}>
                    <hr />{schedule.paymentStatus}</span>
                    </td>
                  <td className='d-flex gap-2 flex-wrap'>
                    <button className='border-0 btn-sm member' style={{fontSize:'12px'}}
                  onClick={()=>setId(uniqueID)}>
                   Full Payment
                   </button>
                  {hasPartialPay &&<button className='border-0 btn-sm second-btn' type='button' style={{fontSize:'12px'}}
                  onClick={()=>{
                    setId(uniqueID)
                    setPayOrder(payOrder)
                    setSelectedLoan(schedule)
                    handleOpen()
                    }}>
                    Part Payment</button>}
                    </td>
                </tr>
                </>
                })}
            </tbody>
          </table>
        </div>
    </form>
    </div>
    </div>
    <Modal 
    isOpen={isOpen}
    onRequestClose={handleClose}
    style={customStyles}
    >
      <div className="d-flex justify-content-center flex-column">
      <h5 className='text-center'>Enter payment details</h5>
      <span className="text-center">
        Split your payment between principal & interest
        </span>
        </div>
        <div className="d-flex mt-3 rounded-4" style={{border:'solid 1px #ddd'}}>
          <div className="card  px-3 py-2 w-50" style={{borderRadius:'10px 0 0 10px', backgroundColor:'#ddd'}}>
            <p>Principal Due</p>
            <strong>₦{new Intl.NumberFormat('en-US', {minimumFractionDigits:'2'}).format(selectedLoan?.principalRepayment)}</strong>
          </div>
          <div className="card  py-2 px-3 w-50" style={{borderRadius:'0 10px 10px 0'}}>
              <p>Interest Due</p>
           <strong>₦{new Intl.NumberFormat('en-US', {minimumFractionDigits:'2'}).format(selectedLoan?.interestRepayment)} </strong>
          </div>
        </div>
      <form onSubmit={makePartialRepayment}>
        <div className="d-flex gap-3 mt-3 flex-column form-content">
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="">Principal amount</label>
          <input type="number" onChange={handleChange} name='principal' />
        </div>
         <div className='d-flex flex-column gap-1'>
          <label htmlFor="">Interest amount ({selectedLoan?.interestRepayment})</label>
          <input type="number" onChange={handleChange} name='interest'
            />
        </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
            <button className='btn btn-md border mt-3 rounded-5' onClick={handleClose}>
           Cancel</button>
        <button className='btn btn-md member mt-3' disabled={!input?.interest && !input?.principal}>
           Make payment</button>
        </div>
      </form>
    </Modal>
    <ToastContainer/>
  </div>
  )
}

export default Repayment
