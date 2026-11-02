import React, { useMemo, useState, useContext, useEffect } from "react";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { UserContext } from "../AuthContext";
import Table from "../DashboardComponents/CommunicationSubComponents/Table";
import axios from "../axios";
import { toast, ToastContainer } from "react-toastify";

const ApplicationApproval = () => {
  const [candidates, setCandidates] = useState([]);
  const { credentials } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const fetchIdRef = React.useRef(0);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

  const fetchData = React.useCallback(
    async ({ pageSize, pageNumber, search }) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          axios(
            `Election/get-contestants?PageSize=${pageSize}&PageNumber=${pageNumber + 1}&Filter=${encodeURIComponent(search)}`,
          ).then((resp) => {
            if (resp.data.data.modelResult) {
              setCandidates(resp.data.data.modelResult);
              setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
            }
          });
          setLoading(false);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);

  const openApprovalModal = (id, status) => {
    setSelectedAction({ id, status });
    setComment("");
    setShowModal(true);
  };

  const approveCandidate = () => {
    const payload = {
      ContestantId: selectedAction.id,
      ApprovalStatus: selectedAction.status,
      ReasonForRejection: comment,
    };

    axios
      .post("Election/update-contestant-application-status", payload)
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });

        setShowModal(false);

        fetchData({
          pageSize,
          pageNumber,
          search: searchQuery,
        });
      })
      .catch((error) =>
        toast(error.response.data.message, {
          type: "error",
          autoClose: false,
        }),
      );
  };

  const column = [
    { Header: "Member ID", accessor: "memberId" },
    { Header: "Member Name", accessor: "fullName" },
    { Header: "Position applying for", accessor: "positionName" },
    { Header: "Election name", accessor: "electionName" },
    {Header: 'Comment', accessor:'reasonForRejection' },
    {
      Header: "Status",
      accessor: "approvalStatus",
      Cell: ({ cell: { value } }) => {
        if (value === 3) {
          return (
            <div className="active-status px-2">
              <hr />
              <span>Approved</span>
            </div>
          );
        } else if (value === 1) {
          return (
            <div className="suspended-status px-2">
              <hr />
              <span>Pending</span>
            </div>
          );
        } else if (value === 4) {
          return (
            <div className="suspended-status px-2">
              <hr />
              <span>Rejected</span>
            </div>
          );
        }
      },
    },
    {
      Header: "Date applied",
      accessor: "dateCreated",
      Cell: ({ value }) => {
        return (
          <span>
            {new Date(value).toLocaleDateString("en-US")}{" "}
            {new Date(value).toLocaleTimeString("en-US")}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        const id = props.row.original.id;
        const status = props.row.original.approvalStatus;
        return (
          <>
            {status === 1 ? (
              <div className="d-flex align-items-center justify-content-center gap-2">
                <div style={{ position: "relative" }} className="status-icon">
                  <span className="stat">Reject</span>
                  <FaRegTimesCircle
                    size={20}
                    style={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={() => openApprovalModal(id, 4)}
                  />
                </div>
                <div style={{ position: "relative" }} className="status-icon">
                  <span className="stat">Approve</span>
                  <FaRegCheckCircle
                    size={20}
                    style={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={() => openApprovalModal(id, 3)}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  return (
    <>
      <div className="card p-3 border-0 rounded-4">
        <div
          className="d-sm-flex justify-content-between align-items-center my-3"
          style={{ width: "fit-content" }}
        >
          <p className="active-selector">Application Approval</p>
        </div>
        <Table
          fetchData={fetchData}
          pageCount={pageCount}
          data={candidates}
          loading={loading}
          columns={columns}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          <div className="bg-white p-4 rounded-4" style={{ width: "400px" }}>
            <h5 className="mb-3">
              {selectedAction?.status === 3
                ? "Approve Application"
                : "Reject Application"}
            </h5>

            <div className="d-flex flex-column gap-2">
              <label>Comment</label>

              <textarea
                className="form-control"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter comment"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn btn-light rounded-5"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="border-0 member" onClick={approveCandidate}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default ApplicationApproval;
