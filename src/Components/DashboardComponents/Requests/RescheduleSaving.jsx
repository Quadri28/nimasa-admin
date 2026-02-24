import React, { useContext, useEffect, useMemo, useState } from "react";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import { FaUsersViewfinder } from "react-icons/fa6";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

const RescheduleSaving = () => {
  const [reports, setReports] = useState([]);
  const [id, setId] = useState("");
  const { credentials } = useContext(UserContext);
  const [request, setRequest] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isReject, setIsReject] = useState(false);

  const getReports = () => {
    axios("RequestVerification/reschedule-saving-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.userRegistrations) {
        setReports(resp.data.data.userRegistrations);
      }
    });
  };
  useEffect(() => {
    getReports();
  }, []);
  const getRequest = () => {
    axios(`RequestVerification/reschedule-saving-request?id=${id}`, {
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
      Header: "New Amount",
      accessor: "newAmount",
      Cell: ({ value }) => {
        return <span>{new Intl.NumberFormat("en-US", {}).format(value)}</span>;
      },
    },
    {
      Header: "Date Applied",
      accessor: "dateCreated",
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
        return (
          <div
            className={
              value === "Pending"
                ? "suspended-status px-3"
                : "active-status px-3"
            }
          >
            <hr /> <span>{value}</span>
          </div>
        );
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
            <FaUsersViewfinder style={{ cursor: "pointer" }} />
          </div>
        );
      },
    },
  ];
  function closeView() {
    setIsOpen(false);
  }
  function openView() {
    setIsOpen(true);
    setIsReject(false)
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
      width: width > 900 ? "500px" : "320px",
      overFlowY: "scroll",
    },
  };

  // Function to Post Withdrawal account
  const postAccount = (e) => {
    e.preventDefault();
    const payload = {
      narration: request.narration,
      id: Number(request.id),
    };
    axios
      .post("RequestVerification/reschedule-saving-request-approved", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
      )
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
      fullName: request.fullName,
    };
    axios
      .post("RequestVerification/reschedule-saving-request-reject", payload, {
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
        setIsReject(false);
        closeView();
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
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
        onRequestClose={closeView}
           overlayClassName="loan-overlay"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
        <h4
          className="text-uppercase mt-3 text-center"
          style={{ fontSize: "16px", fontWeight: "600" }}
        >
          Reschedule Saving{" "}
        </h4>
        <div className="d-flex flex-column mx-auto gap-2 mt-3">
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Account Number:</strong>{" "}
            <span> {request?.accountNumber}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Full Name:</strong> <span>{request?.fullName}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Member ID: </strong> <span>{request?.employeeNo}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Old Amount: </strong>{" "}
            <span>{request?.monthlyContribution?.toLocaleString("en-US")}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>New Amount: </strong>{" "}
            <span>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(request?.newAmount)}
            </span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Status: </strong> <span>{request?.status}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "16px" }}>
            <strong>Email: </strong> <span>{request?.email}</span>
          </div>
        </div>
        {isReject ? (
          <div className="d-flex mt-4 flex-column">
            <label htmlFor="reason">Enter reason to reject</label>
            <input
              type="text"
              name={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-3 p-2"
              style={{ border: "solid 1px #d3d3d3" }}
            />
          </div>
        ) : (
          ""
        )}
        <div className="d-flex flex-column gap-3 mt-4 justify-content-end">
          <div
            className="d-flex gap-3 justify-content-end align-items-center"
            style={{ fontSize: "14px" }}
          >
            {!isReject ? (
              <button
                className="btn btn-md rounded-5"
                onClick={() => setIsReject(true)}
                style={{ backgroundColor: "#ddd", fontSize: "16px" }}
              >
                Reject
              </button>
            ) : (
              <button
                className="btn btn-md rounded-5"
                onClick={rejectAccount}
                style={{ backgroundColor: "#ddd", fontSize: "16px" }}
              >
                Reject
              </button>
            )}
            <button className="border-0 btn-md member" onClick={postAccount}>
              Post
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default RescheduleSaving;
