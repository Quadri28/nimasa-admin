import React, { useContext, useEffect, useMemo, useState } from "react";
import UnpaginatedTable from "../Reports/UnpaginatedTable";
import { FaUsersViewfinder } from "react-icons/fa6";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

const RegistrationRequest = () => {
  const [reports, setReports] = useState([]);
  const [account, setAccount] = useState("");
  const [id, setId] = useState("");
  const { credentials } = useContext(UserContext);
  const [request, setRequest] = useState({});
  const [isOpen, setIsOpen] = useState(false);
    const [isReject, setIsReject] = useState(false)
  

  const getReports = () => {
    axios("RequestVerification/user-registration-requests", {
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
    axios(`RequestVerification/user-registration-request?uniqueId=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRequest(resp.data.data));
  };
  useEffect(() => {
    getRequest();
  }, [id]);
  const column = [
    { Header: "Unique ID", accessor: "uniqueId" },
    { Header: "Member Number", accessor: "memberNumber" },
    { Header: "Full Name", accessor: "fullName" },
    {
      Header: "Monthly Contribution",
      accessor: "monthlyContribution",
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
      Header: "Date Applied",
      accessor: "dateApplied",
      Cell: ({ value }) => {
        return (
          <span>
            {new Date(value).toLocaleDateString()}{" "}
            {new Date(value).toLocaleTimeString()}
          </span>
        );
      },
    },
    { Header: "Status", accessor: "status" },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.uniqueId;
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
      uniqueId: Number(id),
      productCode: account,
    };
    axios
      .post("RequestVerification/user-registration-request-approved", payload, {
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
      narration: request.narration,
      uniqueId: Number(id),
    };
    axios
      .post("RequestVerification/user-registration-request-reject", payload, {
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
  return (
    <div>
      <UnpaginatedTable
        data={reports}
        filename="UserRegRequest.csv"
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
          User Details{" "}
        </h4>
        <div className="d-flex flex-column gap-2 mt-3 mx-auto">
          <div
            className="d-flex gap-3 align-items-center"
            style={{ fontSize: "14px" }}
          >
            <strong>Member photo:</strong>{" "}
            <img src={request?.profileImage} alt="profile-img" width={50} />
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Full Name:</strong> <span>{request?.fullName}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Member ID: </strong> <span>{request?.memberId}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Gender: </strong> <span>{request?.gender}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Bank Name: </strong> <span>{request?.bankName}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Account Number:</strong>{" "}
            <span> {request?.accountNumber}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Account Name: </strong> <span>{request?.accountName}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Status: </strong> <span>{request?.status}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Email: </strong> <span>{request?.email}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Phone NO: </strong> <span>{request?.mobileNumber}</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>DOB: </strong> <span> {request?.dob}</span>
          </div>
          {request.uniqueId}
          <div className="d-flex gap-3" style={{ fontSize: "14px" }}>
            <strong>Monthly Contribution: </strong>{" "}
            <span>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(request?.monthlyContribution)}
            </span>
          </div>
        </div>
        <div className="d-flex flex-column gap-3 mt-3">
          <select
            name={account}
            onChange={(e) => setAccount(e.target.value)}
            id=""
            className="rounded-3 p-2"
            style={{ border: "solid 1px #d3d3d3" }}
          >
            <option value="">Select Account</option>
            {request?.productSelects?.map((account) => (
              <option value={account.productCode} key={account.productCode}>
                {account.productName}
              </option>
            ))}
          </select>
          <div className="d-flex gap-3 mt-4 justify-content-end">
            <form onSubmit={postAccount}>
              <button className="border-0 btn-md member" type="submit">
                Approve
              </button>
            </form>
            {!isReject ? (
              <button
                className="btn btn-md rounded-5"
                onClick={() => setIsReject(true)}
                style={{ backgroundColor: "#ddd", fontSize: "14px" }}
              >
                Reject
              </button>
            ) : (
              <button
                className="border-0 btn-md rounded-5"
                onClick={() => rejectAccount}
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
export default RegistrationRequest;
