import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { FaUsersViewfinder } from "react-icons/fa6";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

const SMSRequests = () => {
  const [reports, setReports] = useState([]);
  const { credentials } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState({});
  const [id, setId] = useState("");
  const [reason, setReason] = useState("");
  const [isReject, setIsReject] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getReports = () => {
    axios("RequestVerification/sms-requests", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      if (resp.data.data.smsRequests) {
        setReports(resp.data.data.smsRequests);
      }
    });
  };
  useEffect(() => {
    getReports();
  }, []);

  const fetchRequest = () => {
    axios(`RequestVerification/sms-request?id=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRequest(resp.data.data));
  };
  useEffect(() => {
    fetchRequest();
  }, [id]);

  const column = [
    { Header: "Employee ID", accessor: "employeeId" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Phone Number", accessor: "phoneNumber" },
    { Header: "Transaction Date", accessor: "transactionDate" },
    { Header: "Status", accessor: "status" },
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
                setId(id);
                openModal();
              }}
            />
          </div>
        );
      },
    },
  ];

  const approveSMS = (e) => {
    e.preventDefault();
    const payload = {
      id: id,
    };
    axios
      .post("RequestVerification/sms-request-approved", payload, {
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

  const rejectSMS = (e) => {
    e.preventDefault();
    const payload = {
      id: id,
    };
    axios
      .post("RequestVerification/sms-request-reject", payload, {
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
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  const columns = useMemo(() => column, []);
  return (
    <div>
      <UnpaginatedTable
        data={reports}
        filename="SMSRequest.csv"
        columns={columns}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
       overlayClassName="loan-overlay"
        ariaHideApp={false}
        className='loan-modal rounded-3 card p-3'
      >
        <div className="mt-3">
          <h4
            style={{ fontSize: "18px", fontWeight: "600" }}
          >
            SMS Request
          </h4>
          <div className="d-flex flex-column gap-2 mt-3">
             <div className="d-flex gap-3 flex-wrap align-items-center mb-3 discourse">
             <div> <span>Member ID: </span> <span>{request?.employeeId}</span> </div>
              <div><span>Full Name: </span> <span className="text-capitalize">{request?.fullName}</span></div>
              <img src={request?.profileImageUrl} alt="Profile Image" className="view-img img-fluid"/>
             </div>
              <div className="d-flex justify-content-between discourse align-items-center p-2" style={{backgroundColor:'var(--light-blue)'}} >
             <div>
              <span>Phone Number: </span> <span>{request?.phoneNumber}</span>
             </div>
             <div className="d-flex gap-2 discourse align-items-center" >
              <span>Transaction Date: </span>
              <span>{request?.approvedDate}</span>
            </div>
            </div>
            <div className="d-flex justify-content-between discourse align-items-center p-2" >
              <div><span>Status: </span> <span>{request?.smsStatus}</span></div>
             <div className="d-flex justify-content-between discourse align-items-center p-2" >
              <span>Email: </span> <span>{request?.email}</span>
            </div>
            </div>
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
            <div className="d-flex gap-3 mt-4 justify-content-end">
              <form onSubmit={approveSMS}>
                <button className="btn-md border-0 px-3 member">Approve</button>
              </form>
              {!isReject ? (
                <button
                  className="btn btn-md second-btn px-3"
                  onClick={() => setIsReject(true)}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              ) : (
                <button
                  className="btn btn-md"
                  onClick={rejectSMS}
                  style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SMSRequests;
