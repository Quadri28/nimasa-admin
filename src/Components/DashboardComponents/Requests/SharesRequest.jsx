import React, { useState, useEffect, useMemo, useContext } from "react";
import Table from "../CommunicationSubComponents/Table";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { FaCheck, FaRegTimesCircle } from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SharesRequest = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fetchIdRef = React.useRef(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [type, setType]= useState('')
  const [id, setId]= useState('')
  const [debitAccount, setDebitAccount]= useState('')
  const [accounts, setAccounts]= useState([])
  const [loading, setLoading] = useState(false);
  const [narration, setNarration]= useState('')
  const { credentials } = useContext(UserContext);

  // Functions to open and close modal
  function handleOpen() {
    setIsOpen(true);
  }
  function handleClose() {
    setIsOpen(false);
  }

  function handleModalOpen() {
    setModalOpen(true);
  }
  function handleModalClose() {
    setModalOpen(false);
  }
  const fetchAccounts=()=>{
      axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${1}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setAccounts(resp.data.data))
    }
    useEffect(()=>{
fetchAccounts()
    }, [])

  const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `RequestVerification/get-shares-request-verification?PageSize=${pageSize}&PageNumber=${
              pageNumber + 1
            }`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },
            }
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setData(resp.data.data.modelResult);
              setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
            }
          });
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchData({ pageSize, pageNumber });
  }, [fetchData, pageNumber, pageSize]);

  const column = [
    { Header: "Member Name", accessor: "memberName" },
    { Header: "Member ID", accessor: "memberId" },
    {
      Header: "Purchasing Amt.",
      accessor: "purchasingAmount",
      Cell: ({ value }) => {
        return (
          <span>
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
            }).format(value)}
          </span>
        );
      },
    },
    { Header: "Payment Type", accessor: "paymentType" },
    { Header: "Share Type", accessor: "shareTypeName" },
    {
      Header: "Purchase Unit",
      accessor: "purchaseUnit",
      Cell: ({ value }) => {
        return <span className="d-flex justify-content-center">{value}</span>;
      },
    },
    {
      Header: "Status",
      accessor: "approvalStatusText",
      Cell: ({ value }) => {
        if (value === "Active") {
          return (
            <div className="active-status px-3">
              <hr />
              {value}
            </div>
          );
        } else {
          return (
            <div className="pending-status px-3">
              <hr />
              {value}
            </div>
          );
        }
      },
    },
    { Header: "Date", accessor: "purchasingDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString()} {new Date(value)?.toLocaleTimeString()}</span>
    })},
    {
      Header: "Action",
      accessor: "",
      Cell: ({ cell }) => {
        const paymentType = cell.row.original.paymentType
        const id = cell.row.original.id
        return (
          <div className="d-flex gap-3 align-items-center">
            <FaCheck
              style={{ cursor: "pointer" }}
              onClick={() =>{
                handleOpen()
                setType(paymentType)
                setId(id)
            }}
            />
            <FaRegTimesCircle style={{ cursor: "pointer" }}
             onClick={() =>{
              handleModalOpen()
              setId(id)
          }} />
          </div>
        );
      },
    },
  ];
  const columns = useMemo(() => column, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "fit-content",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: "320px",
      overFlowY: "scroll",
    },
  };
  const approveRequest=(e)=>{
    e.preventDefault()
    const payload={
        id:id,
        debitAccountNumber: debitAccount
    }
    setLoading(true)
    axios.post('RequestVerification/share-purchase-request-approval', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setLoading(false)
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
        setTimeout(() => {
    handleClose()
    fetchData({pageNumber:0, pageSize:10})
        }, 5000);
    }).catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
      setLoading(false)
    })
  }

  const DeclineRequest=(e)=>{
    e.preventDefault()
    const payload={
        id:id,
        narration:narration
    }
    setLoading(true)
    axios.post('RequestVerification/share-withdrawal-and-purchase-request-reject', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setLoading(false)
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
        setTimeout(() => {
    handleModalClose()
    fetchData({pageNumber:0, pageSize:10})
        }, 5000);
    }).catch(error=>{
      setLoading(false)
      toast(error.response.data.message, {type:'error', autoClose:false})
    })
  }
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        ariaHideApp={false}
        style={customStyles}
      >
        <h5 className="text-center">Approve Share Request</h5>
<div className="discourse d-flex gap-2 align-items-center">
        <p className="mt-3">Payment mode:</p> <span>{type}</span>
        </div>
        <form onSubmit={approveRequest}>
        { type === 'Online' || type === 'Paid At Bank' ?<div className="custom-input-wrapper">
        <label htmlFor="settlementAccount">Settlement Account</label>
        <select type="text" name="settlementAccount" className="custom-input" 
        style={{backgroundColor:'#f5f5f5'}} onChange={(e)=>setDebitAccount(e.target.value)}>
        <option value="">Select settlement account</option>
        {
                        accounts.map((debit)=>(
                          <option style={{textTransform:'lowercase'}} value={debit.accountNumber} key={debit.accountNumber}>
                            {debit.acctName} {`>>  ${debit.product}`}</option>
                        ))
                      }
        </select>
        </div>: ''}
        <button className="w-100 btn-md member mt-3 border-0" disabled={loading}>Approve</button>
        </form>
      </Modal>

      {/* Modal to reject share request */}
      <>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        ariaHideApp={false}
        style={customStyles}
      >
        <h5 className="text-center">Decline Share Request</h5>
        <form onSubmit={DeclineRequest}>
        <div className="d-flex flex-column gap-2">
          <label htmlFor="narration">Reason</label>
          <textarea type="text" name="narration" onChange={(e)=>setNarration(e.target.value)}
          className="rounded-3 p-2" style={{border:'solid 1px #f5f5f5'}}/>
        <button className="w-100 btn-md member mt-3 border-0" disabled={loading}>Decline</button>
        </div>
        </form>
      </Modal>
      </>
      <Table
        fetchData={fetchData}
        pageCount={pageCount}
        data={data}
        loading={loading}
        columns={columns}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <ToastContainer/>
    </div>
  );
};

export default SharesRequest;
