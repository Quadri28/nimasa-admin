import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import UnpaginatedTable from "../../DashboardComponents/Reports/UnpaginatedTable";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";

const LoginStatus = () => {
  const [reports, setReports] = useState([]);
  const [branches, setBranches] = useState([]);
  const [ids, setIds]= useState([])
  const [input, setInput] = useState({});
  const navigate = useNavigate();
  const {credentials}= useContext(UserContext)

  const getIDs=async()=>{
    await axios('Reports/get-login-id', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setIds(resp.data.data))
  }
  const getBranches = async () => {
    await axios("Common/get-branches", {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp) =>
      setBranches(resp.data)
    );
  };
  useEffect(() => {
    getBranches();
    getIDs()
  }, []);
  const column = [
    {
      Header: "S/N",
      accessor: "",
      Cell: ({ cell }) => {
        return <span>{1 + cell.row.index}</span>;
      },
    },
    { Header: "Login ID", accessor: "loginID" },
    { Header: "Fullname", accessor: "fullName" },
    { Header: "Staff Status", accessor: "staffStatus" },
    { Header: "Lock Status", accessor: "lockstatus" },
    { Header: "Multi Login Privilege", accessor: "multiLoginPrivilege" },
    { Header: "Multi Login Lock", accessor: "multiloginLocked" },
    { Header: "Login Status", accessor: "loginStatus" },
    { Header: "Login Description", accessor: "loginDescription" },
    { Header: "System Date", accessor: "systemDate" },
    { Header: "Login Attempt Date", accessor: "loginattemptdate" },
  ];
  const columns = useMemo(() => column, [])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const checkReport = () => {
    axios(`Reports/login-status-report?LoginId=${input.loginId ? input.loginId: ''}&Startdate=${input.startDate ? input.startDate : ''}&Branch=${input.branch ? input.branch : ''}&StaffStatus=${input.staffStatus  ? input.staffStatus : 0}&Enddate=${input.endDate ? input.endDate: ''}`, {
      headers: {
        Authorization:`Bearer ${credentials.token}`
    }
    })
    .then(resp=>{
      if (resp.data.data.loginStatusReport) {
      setReports(resp.data.data.loginStatusReport)
      }
    })
  };

  useEffect(()=>{
    checkReport()
  }, [input.loginId, input.startDate, input.endDate, input.branch, input.staffStatus])

  return (
    <>
      <h4 style={{ fontSize: "16px", color: "#1d1d1d" }}>
        Login Status Report
      </h4>
      <div className="rounded-4 mt-3" style={{ border: "solid 1px #f7f4f7" }}>
        <div
          className="py-3 px-4 form-header "
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <div
            style={{ fontSize: "16px", fontWeight: "500", color: "#4D4D4D" }}
          >
            <BsArrowLeft
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
            />{" "}
            Login status report
          </div>
        </div>
        <form onSubmit={checkReport}>
          <div className="admin-task-forms px-3 mb-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="loginID">Login ID:</label>
              <select
                type="text"
                onChange={handleChange}
                name="loginId"
                required
              >
                <option value="">Select type</option>
                {
                  ids.map(id=>(
                    <option value={id.userID} key={id.userID}>{id.fullName}</option>
                  ))
                }
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="staffStatus">Staff Status:</label>
              <select
                type="text"
                onChange={handleChange}
                name="staffStatus"
                required
              >
                <option value="">Select Status</option>
                <option value={1}>Active</option>
                <option value={2}>In-active</option>
                <option value={3}>Disengaged</option>
                <option value={4}>New</option>
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                name="endDate"
                required
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="branch">Branch:</label>
              <select
                type="text"
                onChange={handleChange}
                name="branch"
                required
              >
                <option value="">Select type</option>
                {branches.map((branch) => (
                  <option value={branch.branchCode} key={branch.branchCode}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <div className="px-3">
          <UnpaginatedTable
            data={reports}
            columns={columns}
            filename="LoginReports.csv"
          />
        </div>
      </div>
    </>
  );
};

export default LoginStatus;
