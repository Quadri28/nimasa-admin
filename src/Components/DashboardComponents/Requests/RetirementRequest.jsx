import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { FaUsersViewfinder } from "react-icons/fa6";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import useScreenSize from "../../ScreenSizeHook";

const RetirementRequest = () => {
  const [reports, setReports] = useState([]);
  const { credentials } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState({});
  const [reason, setReason]= useState(null)
  const [isReject, setIsReject] = useState(false)
  const [id, setId] = useState("");

  const getReports = () => {
    axios("RequestVerification/retirement-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.retirements) {
        setReports(resp.data.data.retirements)
      }
    });
  };
  useEffect(() => {
    getReports();
  }, []);

  const fetchRequest = () => {
    axios(`RequestVerification/retirement-request?id=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRequest(resp.data.data));
  };
  useEffect(() => {
    fetchRequest();
  }, [id]);

  function handleOpenModal(){
    setIsOpen(true)
  }

  function handleCloseModal(){
    setIsOpen(false)
    setIsReject(false)
  }

  const column = [
    { Header: "Employee ID", accessor: "employeeId" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Email", accessor: "email" },
    { Header: "Transaction Date", accessor: "transactionDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}</span>
    }) },
    { Header: "Status", accessor: "status",  Cell:(({value})=>{
      if (value === 'Pending') {
      return <div className='pending-status px-2'>
        <hr /> {value}
      </div>
      }else{
        return <div className="active-status px-2">
          <hr /> {value}
        </div>} })},
        
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.id;
        return (
          <div className="d-flex justify-content-center">
            <FaUsersViewfinder
              style={{ cursor: "pointer" }}
              onClick={() => {
                setId(id) 
                handleOpenModal()
              }}
            />
          </div>
        );
      },
    },
  ];

  const approve=(e)=>{
    e.preventDefault()
    const payload ={
      id: id
    }
    axios.post('RequestVerification/retirement-request-approved', payload, {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose: 5000, pauseOnHover: true})
      setTimeout(() => {
        getReports()
      handleCloseModal()
      }, 5000);
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }

  const reject=(e)=>{
    e.preventDefault()
    const payload={
      id: id
    }
    axios.post('RequestVerification/retirement-request-reject', payload, {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose: 5000, pauseOnHover: true})
      setTimeout(() => {
      getReports()
      handleCloseModal()
      }, 5000);
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }

  const columns = useMemo(() => column, []);
  const { width } = useScreenSize();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: '65%',
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 600 ? "800px" : "320px",
      overFlowY: "scroll",
    },
  };
  return (
    <div>
      <UnpaginatedTable
        data={reports}
        filename="SMSRequest.csv"
        columns={columns}
      />
      <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
      style={customStyles}
      >
            <div className="px-3 mt-3">
              <h4 style={{fontSize:'18px', fontWeight:'600', textAlign:'center'}}>Retirement Request</h4>
              <div className="d-flex flex-column gap-3 mt-3">
                <div className="d-flex gap-3">
                  <strong>Account Number: </strong>
                  <span>{request.accountNumber}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Full Name: </strong> <span>{request.fullName}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Balance: </strong> <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request.amount)}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Charges: </strong> <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request.chargesAmount)}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Member ID: </strong> <span>{request.memberId}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Transaction Date: </strong>
                  <span>{request.transactionDate}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Status: </strong><span>{request.status}</span>
                </div>
                <div className="d-flex gap-3">
                  <strong>Email: </strong><span>{request.email}</span>
                </div>
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
                <div className="d-flex gap-3 my-3 justify-content-end">
                  <form onSubmit={approve}>
                  <button className="border-0 btn-md member">Approve</button>
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
                  onClick={reject}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              )}
                </div>
              </div>
            </div>
          </Modal>
      <ToastContainer/>
    </div>)
}

export default RetirementRequest
