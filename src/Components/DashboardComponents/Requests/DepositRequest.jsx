import "./Requests.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import { FaUsersViewfinder } from "react-icons/fa6";
import axios from "../../axios";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../AuthContext";

const DepositRequest = () => {
  const [reports, setReports] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState(null);
  const [id, setId] = useState("");
  const { credentials } = useContext(UserContext);
  const [request, setRequest] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason]= useState('')
  const [isReject, setIsReject] = useState(false)

  const getReports = () => {
    axios("RequestVerification/deposit-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.memberContributions) {
        setReports(resp.data.data.memberContributions);
      }
    });
  };
  const getAccounts = () => {
    axios("RequestVerification/gl-account-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccounts(resp.data.data.glAccounts));
  };
  useEffect(() => {
    getReports();
    getAccounts();
  }, []);
  const getRequest = () => {
    axios(`RequestVerification/deposit-request?id=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRequest(resp.data.data));
  };
  useEffect(() => {
    getRequest();
  }, [id]);
  const column = [
    { Header: "Member ID", accessor: "id" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Contribution", accessor: "contribution" },
    {
      Header: "Request Amount",
      accessor: "requestAmount",
      Cell: ({ value }) => {
        return (
          <span>
            {new Intl.NumberFormat("en-Us", {
              minimumFractionDigits: 2,
            }).format(value)}
          </span>
        );
      },
    },
    { Header: "Payment Mode", accessor: "paymentMode" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => {
        if (value === "Pending") {
          return (
            <div className="suspended-status px-2">
              <hr /> {value}
            </div>
          );
        } else {
          return (
            <div className="active-status px-2">
              <hr /> {value}
            </div>
          );
        }
      },
    },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.id;
        return (
          <div
            className="d-flex justify-content-center align-items-center"
            onClick={() => {
              openView();
              setId(id);
            }}
          >
            <FaUsersViewfinder style={{ cursor: "pointer" }} />
          </div>
        );
      },
    },
  ];
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
      height: "65%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 900 ? "400px" : "320px",
      overFlowY: "scroll",
    },
  };

  // Function to Post Withdrawal account
  const postAccount = (e) => {
    e.preventDefault();
    const payload = {
      narration: request.narration,
      id: request.id,
      userName: request.userName,
      fullName: request.fullName,
      contribution: request.contribution,
      paymentMode: request.paymentMode,
      amount: request.amount,
      accountNumber: request.accountNumber,
      bankPaid: request.bankPaid,
      bankAccount: request.bankAccount,
      tellerNo: request.tellerNo,
      debitAccount: account,
    };
    axios
      .post("RequestVerification/deposit-request-approved", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
          getReports();
          closeView();
        }, 5000);
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  // Function to reject Withdrawal account
  const rejectAccount = (e) => {
    e.preventDefault();
    const payload = {
      narration: request.narration,
      id: request.id,
      userName: request.userName,
    };
    axios
      .post("RequestVerification/deposit-request-reject", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
        setTimeout(() => {
           getReports();
          closeView();
        }, 5000);
      }
      )
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };
  return (
    <div>
      <UnpaginatedTable
        data={reports}
        filename="WithdrawalRequest.csv"
        columns={columns}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeView}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h4
          className="text-capitalize text-center"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          Deposit posting
        </h4>
        <div className="d-flex flex-column gap-2 mt-3">
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Account Number:</span> <p> {request?.accountNumber}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Full Name:</span> <p>{request?.fullName}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Member ID: </span> <p>{request?.id}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Transaction Date: </span> <p>{request?.submitedDate}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Amount: </span> <p>{request?.amount}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Bank Account: </span> <p>{request?.bankAccount}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Status: </span> <p>{request?.status}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Payment Mode: </span> <p>{request?.paymentMode}</p>
          </div>
          {request?.paymentMode === "Paid At Bank" && (
            <img
              src={request?.tellerUploadLink}
              alt=""
              style={{ height: "200px" }}
            />
          )}
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Narration: </span> <p>{request?.narration}</p>
          </div>
          <div className="d-flex gap-3 discourse" style={{ fontSize: "14px" }}>
            <span>Teller NO: </span> <p> {request?.tellerNo}</p>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 mt-3">
          <select
            name={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-100 mb-2 p-2  rounded-2"
            style={{ backgroundColor: "#fafafa", border: "solid 1px #f2f2f2" }}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option value={account.glNumber} key={account.glNumber}>
                {account.accountName}
              </option>
            ))}
          </select>
            {isReject ? (
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
            ) : (
              ""
            )}
          <div className="d-flex gap-3 justify-content-end">
            <button
              className="border-0 btn-md member px-4"
              onClick={postAccount}
              disabled={!account}>
              Post
            </button>
           {!isReject ? (
                <button
                  className="btn btn-md rounded-5 px-4"
                  onClick={() => setIsReject(true)}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              ) : (
                <button
                  className="btn btn-md rounded-5 px-4"
                  onClick={rejectAccount}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              )}
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};
export default DepositRequest;
