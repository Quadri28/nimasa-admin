import React, { useContext, useEffect, useMemo, useState } from "react";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import { FaUsersViewfinder } from "react-icons/fa6";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

const WithdrawalRequest = () => {
  const [reports, setReports] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [id, setId] = useState("");
  const { credentials } = useContext(UserContext);
  const [request, setRequest] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('')
  const [isReject, setIsReject] = useState(false);

  const getReports = () => {
    axios("RequestVerification/withdrawal-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.withdrawalRequests) {
        setReports(resp.data.data.withdrawalRequests);
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
    axios(`RequestVerification/withdrawal-request?id=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRequest(resp.data.data));
  };
  useEffect(() => {
    getRequest();
  }, [id]);

  const column = [
    { Header: "Member ID", accessor: "memberId" },
    { Header: "Full Name", accessor: "fullName" },
    {
      Header: "Amount",
      accessor: "amount",
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
    {
      Header: "Transaction Date",
      accessor: "transactionDate",
      Cell: ({ value }) => {
        return (
          <span>
            {new Date(value).toLocaleDateString()}{" "}
            {new Date(value).toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => {
        if (value === "Pending") {
          return (
            <div className="suspended-status px-2">
              <hr /> <span>{value}</span>
            </div>
          );
        } else {
          return (
            <div className="active-status px-2">
              <hr /> <span>{value}</span>
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
            className="d-flex justify-content-center"
            onClick={() => {
              openView();
              setId(id);
            }}
          >
            <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Post</span>
              <FaUsersViewfinder style={{ cursor: "pointer" }} />
            </div>
          </div>
        );
      },
    },
  ];
  function closeView() {
    setIsOpen(false);
    setIsReject(false);
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
      width: width > 900 ? "800px" : "320px",
      overFlowY: "scroll",
    },
  };

  // Function to Post Withdrawal account
  const postAccount = (e) => {
    e.preventDefault();
    const payload = {
      narration: request.narration,
      id: request.id,
      creditAccountNumber: account,
    };
    axios
      .post("RequestVerification/withdrawal-request-approved", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        setTimeout(() => {
          getReports();
          closeView();
        }, 5000);
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  // Function to reject Withdrawal account
  const rejectAccount = (e) => {
    e.preventDefault();
    const payload = {
      narration: reason,
      id: request.id,
    };
    axios
      .post("RequestVerification/withdrawal-request-reject", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        getReports();
        setTimeout(() => {
          closeView();
        }, 5000);
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
      })
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
          className="text-uppercase text-center"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          Withdrawal posting
        </h4>
        <div className="d-flex flex-column gap-2 mt-3">
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Account Number:</strong>{" "}
            <span> {request?.accountNumber}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Full Name:</strong> <span>{request?.fullName}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Member ID: </strong> <span>{request?.memberId}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Transaction Date: </strong>{" "}
            <span>{request?.transactionDate}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Amount: </strong> <span>{request?.amount}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Status: </strong> <span>{request?.status}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Email: </strong> <span>{request?.email}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Narration: </strong> <span>{request?.narration}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Account Balance: </strong> <span> 
              {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(request?.balance)}</span>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 mt-3">
          <select
            name={account}
            onChange={(e) => setAccount(e.target.value)}
          className="rounded-3 p-2"
          style={{border:'solid 1px #d3d3d3'}}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option value={account.glNumber} key={account.glNumber}>
                {account.accountName}
              </option>
            ))}
          </select>
          {isReject && (
              <div className="d-flex mt-2 flex-column">
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
          <div className="d-flex gap-3 justify-content-end align-items-center">
            <button className="member btn-md border-0 px-4" onClick={postAccount}>
              Post
            </button>
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

export default WithdrawalRequest;
