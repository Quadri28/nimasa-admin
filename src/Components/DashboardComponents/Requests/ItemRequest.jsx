import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import { FaCheck, FaCloudUploadAlt } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import Modal from "react-modal";
import useScreenSize from "../../../Components/ScreenSizeHook";
import { ToastContainer, toast } from "react-toastify";

const ItemRequest = () => {
  const [reports, setReports] = useState([]);
  const [loans, setLoans] = useState([]);
  const { credentials } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [input, setInput] = useState({});
  const [request, setRequest] = useState({});
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')
  const [isReject, setIsReject] = useState(false)
  const [accounts, setAccounts]= useState([])
  const [savings, setSavings]= useState([])
  const [items, setItems]= useState([])

  function openView() {
    setIsOpen(true);
  }
  function closeView() {
    setIsOpen(false);
  }

  function openUpload() {
    setModalOpen(true);
  }
  function closeUpload() {
    setModalOpen(false);
  }
  const handleChange =(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
  }
  const { width } = useScreenSize();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: '55%',
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 600 ? "700px" : "320px",
      overFlowY: "scroll",
    },
  };

  const getAccounts= async()=>{
    await axios('RequestVerification/get-debit-and-credit-account-numbers', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setAccounts(resp.data.data)
    })
  }
  const getMemberSavingsAccount= async()=>{
    await axios(`RequestVerification/get-member-savings-account-numbers-for-item-request-purchased?username=${request?.username}`, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }
    }).then(resp=>setSavings(resp.data.data))
  }

  const getRequests = () => {
    axios("RequestVerification/item-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) =>{
      if (resp.data.data.items) {
       setReports(resp.data.data.items)
      }
      });
  };
  useEffect(() => {
    getRequests();
    getAccounts()
  }, []);

  useEffect(()=>{
    getMemberSavingsAccount()
  }, [request?.username])
  const getSingleRequest = () => {
    axios(`RequestVerification/item-request?paymentId=${paymentId}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setRequest(resp.data.data.itemRequest)
      setItems(resp.data.data.items)
      setRequests(resp.data.data.items)
    });
  };
  useEffect(() => {
    getSingleRequest();
  }, [paymentId]);

  const approveRequest = (e) => {
    e.preventDefault();
    const payload = {
      paymentId: paymentId,
    };
    setLoading(true)
    axios
      .post("RequestVerification/item-request-approved", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        setLoading(false)
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
        setTimeout(() => {
          closeView()
          getRequests()
        }, 5000);
  })
      .catch((error) =>{
        toast(error.response.data.message, { type: "error", autoClose: false })
        setLoading(false)
      }
      );
  };

  const savingAccountDetails= savings.find((saving)=>saving.accountNumber === request?.accountnumber)

  console.log(request?.accountnumber)
  const rejectRequest = (e) => {
    e.preventDefault();
    const payload = {
      paymentId: paymentId,
      memberName: request.memberName,
      narration: reason
    };
    setLoading(true)
    axios
      .post("RequestVerification/item-request-reject", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        setLoading(false)
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
        setTimeout(() => {
          closeView()
          getRequests()
          setIsReject(false)
        }, 5000);
      }
      )
      .catch((error) =>{
        toast(error.response.data.message, { type: "error", autoClose: false })
        setLoading(false)
      }
      );
  };

  const column = [
    { Header: "Order ID", accessor: "orderId" },
    { Header: "Member Name", accessor: "memberName" },
    { Header: "Payment Mode", accessor: "paymentOption" },
    { Header: "Amount", accessor: "amount", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Date Applied", accessor: "appliedDate", Cell:({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-US')}</span>
    } },
    { Header: "Status", accessor: "status", Cell:(({value})=>{
      if (value === 'Approved') {
        return( 
            <div className='active-status px-3' style={{width:'max-content'}}>
                <hr />
                 <span >{value}</span>
            </div>)
    }else if (value === 'Pending') {
      return (
        <div className="pending-status px-3">
          <hr /> <span>{value}</span>
        </div>)}
    else if (value === 'Rejected')
    {return(
        <div className='suspended-status px-3' style={{width:'max-content'}}>
            <hr />
         <span >{value}</span>
         </div>
         )}else{
          return <div className='sold-status px-3 white' style={{width:'max-content'}}>
            <hr />
         <span >Sold</span>
         </div>
         }
   })},
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ cell }) => {
        const paymentId = cell.row.original.id;
        return (
          <div className="d-flex gap-3 justify-content-between">
        <div style={{ position: "relative" }} className="status-icon">
        <span className="stat">Approve</span>
            <FaCheck
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPaymentId(paymentId);
                openView();
              }}
            />
            </div>
        <div style={{ position: "relative" }} className="status-icon">
        <span className="stat">Post item</span>
            <FaCloudUploadAlt
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPaymentId(paymentId);
                openUpload();
              }}
            />
            </div>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  const getLoanProduct=()=>{
    axios('LoanApplication/get-loan-product', {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data) {
        setLoans(resp.data.data)
      }}
      )
  }
  useEffect(()=>{
    getLoanProduct()
  },[])

  const uploadRequest=(e)=>{
    e.preventDefault()
  const payload={
  id: request.id,
  creditAccount: input.creditAccount,
  debitAccount: request.paymentOption === 'Savings Account' ?savingAccountDetails.accountNumber : input.debitAccount,
  narration: `Payment for item bought-${request?.orderId}`,
  loanProduct: request.paymentOption === 'Pay At Banks'? '' : input.product
  }
    axios.post('RequestVerification/post-item-request-purchased', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
        closeUpload()
        getRequests()
      }, 5000);
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
  return (
    <div>
      <UnpaginatedTable
        data={reports}
        filename="ItemsRequest.csv"
        columns={columns}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeView}
          overlayClassName="loan-overlay"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
        <div>
          <h3
            style={{ fontSize: "20px", fontWeight: "600" }}
            className="text-center mt-1">
            View Item Request
          </h3>
          <div className="d-flex flex-column gap-3">
            <span>Member No: {request?.employeeid}</span>
            <span>Member Name: {request?.memberName}</span>
          </div>
          <div className="table-responsive mt-3">
            <table className="border request-table" id="customers">
              <thead>
                <tr>
                  <th colSpan={2}>Item Name </th>
                  <th>Quantity </th>
                  <th>Unit Price </th>
                  <th>Sub Total </th>
                  <th>Status </th>
                  <th>Order </th>
                </tr>
              </thead>
              <tbody>
                {requests?.map(request=>( 
                  <tr key={request.id}>
                  <td colSpan={2}>{request?.itemName}</td>
                  <td>{request?.quantity}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.unitPrice)}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.subTotal)}</td>
                  <td>{request?.status}</td>
                  <td>{request?.order}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isReject ?
            <div className="d-flex mt-3 flex-column">
              <label htmlFor="reason">Enter reason to reject</label>
              <input type="text" name={reason} onChange={(e)=>setReason(e.target.value)} 
              className="rounded-3 p-2" style={{border:'solid 1px #f2f2f2', backgroundColor:'#fafafa'}}/>
            </div> : null
            }
          <div className="d-flex gap-3 mt-5 justify-content-end">
            <form onSubmit={approveRequest}>
              <button disabled={loading} className="border-0 btn-md member" style={{fontSize:'14px'}}>Approve</button>
            </form>
              {!isReject? 
              <button  className="border-0 rounded-5 btn-md px-3" onClick={()=>setIsReject(true)} 
               style={{fontSize:'14px'}}>
                Reject</button> : 
                <button disabled={loading}  className="border-0 px-3 btn-md rounded-5" 
                onClick={rejectRequest}  style={{fontSize:'14px'}}>
                Reject</button>}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeUpload}
          overlayClassName="loan-overlay"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
        <h4  className="text-capitalize text-center" style={{fontSize:'18px', fontWeight:'600'}}>
          Post Items Purchased</h4>
     <hr />
     <div style={{fontSize:'14px'}}>
     <div className="d-flex justify-content-between flex-wrap align-items-center">
        <span>Member Name: {request?.memberName}</span>
        <span>Member No: {request?.employeeid}</span>
        <img src={request?.profileImage} alt="profile picture" 
        style={{width:'4rem', height:'4rem', borderRadius:'10px'}} />
     </div>
     <div className="mt-4">
     <hr />
    <div className="d-flex justify-content-between flex-wrap">
        <span>Unit Price: {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.amount)}</span>
        <span>Sub Total: {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.totalAmount)}</span>
        <span>Order No: {request?.orderId}</span>
    </div>
     <hr />
     {request?.paymentOption !== 'Online' && 
     <>
     <div className="d-flex justify-content-between flex-wrap">
        <span>Account Number: {savingAccountDetails?.accountNumber ? savingAccountDetails?.accountNumber
         : request?.bankAcctno }</span>
       {request?.paymentOption !== 'Pay At Banks'? <span>Account Product: 
        {savingAccountDetails?.accountProduct}</span> : <span>Bank Name:{request.bankpaid}</span> }
       {request?.paymentOption !== 'Pay At Banks' && <span>Account Balance: {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(savingAccountDetails?.accountBalance)}</span>}
    </div>
     <hr /> </>}
     <div className="d-flex justify-content-between flex-wrap">
        <span>Payment: {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.amount)}</span>
        <span>Mode of payment: {request?.paymentOption}</span>
    </div>
     <hr />
     </div>
     <form onSubmit={uploadRequest}>
        <div className="d-flex flex-column gap-2 mt-4">
        {request?.paymentOption === 'Pay At Banks' &&<div>
              <label htmlFor="tellerImage">Teller Image</label>
              <img src={request?.bankteller} alt="teller-image" className="img-fluid" style={{height:'15rem', width:'100%'}}/>
            </div>}
          {request?.paymentOption==='Loan' &&<div className="d-flex flex-column"> 
            <label htmlFor="product">Loan Product</label>
            <select name='product'onChange={handleChange} className="p-2 w-100 rounded-2" 
            style={{border:'solid 1px #f2f2f2', backgroundColor:'#fafafa'}}>
                <option value="">Select</option>
                {loans.map(loan=>(
                    <option value={loan.productCode} key={loan.productCode}>{loan.productName}</option>
                ))}
            </select>
          </div>}
               {request?.paymentOption !='Loan' && 
               <div className="">
                <div className="d-flex gap-1 flex-column">
                  <label htmlFor="creditAccount">Credit Account</label>
                  <select name="creditAccount" className="py-3 px-2 rounded-3"
                   style={{border:'solid 1px #f2f2f2'}}
                   onChange={handleChange}>
                    <option value="">Select credit account</option>
                    {
                      accounts.map(account=>(
                        <option value={account.glnumber} key={account.glnumber}>
                          {account.acctName}
                        </option>
                      ))
                    }
                  </select>
                </div>
               </div>
               } 
                {request?.paymentOption !='Loan' && request?.paymentOption != 'Savings Account' &&
               <div className="">
                <div className="d-flex gap-1 flex-column">
                  <label htmlFor="debitAccount">Debit Account</label>
                  <select name="debitAccount" className="py-3 px-2 rounded-3"
                  style={{border:'solid 1px #f2f2f2'}}
                   onChange={handleChange}>
                    <option value="">Select debit account</option>
                    {
                      accounts.map(account=>(
                        <option value={account.glnumber} key={account.glnumber}>
                          {account.acctName}
                        </option>
                      ))
                    }
                  </select>
                </div>
               </div>
               } 
            <div>
            <label htmlFor="narration">Narration</label>
            <textarea type="text" className="w-100 rounded-3 p-2" 
            style={{border:'solid 1px #f2f2f2'}} name="narration"
             value={`Payment for item bought-${request?.orderId}`} onChange={handleChange}/>
            </div>

            <div className="table-responsive">
            <table id="customers" className="table">
              <thead>
                <tr>
                <th>Item Name</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {
                items?.map(item=>(
              <tr>
              <td>{item.itemName}</td>
              <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(item.unitPrice)}</td>
              <td>{item.quantity}</td>
              <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(item.subTotal)}</td>
              </tr>
                  ))
                }
              
              </tbody>
            </table>
            </div> 
        </div>
        <div className="d-flex justify-content-end">
        <button type="submit" className="border-0 btn-md mt-3 member">Submit</button>
        </div>
     </form>
     </div>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default ItemRequest;
