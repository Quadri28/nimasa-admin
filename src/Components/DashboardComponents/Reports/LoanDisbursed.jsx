import React, { useContext, useEffect, useMemo, useState } from "react";
import UnpaginatedTable from "./UnpaginatedTable";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";

const LoanDisbursed = () => {
  const [reports, setReports] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { credentials } = useContext(UserContext);

  const getReports = () => {
    axios(
      `Reports/loan-disbursed-report?Branch=${branch}&LoanDisbursedStatus=${status}&LoanStartDate=${startDate}&LoanEndDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => {
      if (resp.data.data.loanDisbursedReport) {
      setReports(resp.data.data.loanDisbursedReport)
      }
    });
  };
 
  const getBranches = () => {
    axios("MemberManagement/get-branch",{headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then((resp) => {
      setBranches(resp.data.data);
    });
  };
  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    getReports();
  }, [status, startDate, endDate, branch]);

  const column = [
    { Header: "Account No", accessor: "accountnumber" },
    { Header: "Full Name", accessor: "fullname" },
    { Header: "Start Date", accessor: "startdate" },
    { Header: "Maturity Date", accessor: "maturityDate" },
    { Header: "Loan Amount", accessor: "loanamount",Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        }) },
    { Header: "Interest Amount", accessor: "interestRate" },
    { Header: "Disbursed Status", accessor: "status" },
    { Header: "Created by", accessor: "createdby" },
    { Header: "Charges", accessor: "charges" },
  ];

  const columns = useMemo(() => column, []);
  return (
    <div className="card px-3 py-4 mt-3 rounded-4" style={{border:'solid 1px #fafafa'}}>
      <div className="admin-task-forms mb-3">
        <div className="d-flex flex-column gap-1">
          <label htmlFor="branch">
            Select Branch<sup className="text-danger">*</sup>
          </label>
          <select
            name={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option value={branch.branchCode} key={branch.Name}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="status">
            Loan Status<sup className="text-danger">*</sup>
          </label>
          <select
            name={status}
            id=""
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select loan status</option>
            <option value="1">Disbursed</option>
            <option value="2">Not Disbursed</option>
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            End Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
      </div>
       <UnpaginatedTable
        data={reports}
        columns={columns}
        filename="disbursedLoan.csv"
      />
    </div>
  );
};

export default LoanDisbursed;
