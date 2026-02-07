import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { CSVLink } from "react-csv";
import { LiaTimesCircle } from "react-icons/lia";

const PostingJournal = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [option, setOption] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [account, setAccount] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const { credentials } = useContext(UserContext);

  const getPostingJournal = () => {
    axios(
      `Reports/get-posting-journal-report?AccountNumber=${account}&AccountTitle=${accountTitle}&TransactionDateFrom=${startDate}&TransactionDateTo=${endDate}&PostingDateType=${option}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => {
      if (resp.data.data.postingJournalReport) {
        setReports(resp.data.data.postingJournalReport);
      }
    });
  };
  const fetchTypes = () => {
    axios("Acounting/general-Ledger-search-option", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setTypes(resp.data));
  };
  useEffect(() => {
    fetchTypes();
  }, []);
  const fetchCustomerEnquiries = () => {
    axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${type}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setEnquiries(resp.data.data));
  };
  useEffect(() => {
    fetchCustomerEnquiries();
  }, [type]);
  useEffect(() => {
    getPostingJournal();
  }, [account, startDate, endDate, option]);

  const fetchAccountTitle = () => {
    axios(
      `Reports/posting-journal-account-number-text-changed?AccountNumber=${account}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setAccountTitle(resp.data.data.accountTitle));
  };
  useEffect(() => {
    fetchAccountTitle();
  }, [account]);
  return (
    <div
      className="bg-white p-3 mt-3 rounded-4"
      style={{ border: "solid .5px #f2f2f2" }}
    >
      <div className="admin-task-forms">
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
        <div className=" d-flex flex-column gap-1">
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
        <div className=" d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Select date type<sup className="text-danger">*</sup>
          </label>
          <select
            name={option}
            onChange={(e) => setOption(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          >
            <option value="">Select</option>
            <option value="1">By Posting Date</option>
            <option value="2">By Value Date</option>
          </select>
        </div>
        <div className=" d-flex flex-column gap-1">
          <label htmlFor="account">
            Select Account type<sup className="text-danger">*</sup>
          </label>
          <select
            name={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          >
            <option value="">Select</option>
            {types.map((type) => (
              <option value={type.value} key={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className=" d-flex flex-column gap-1">
          <label htmlFor="account">
            Select Account<sup className="text-danger">*</sup>
          </label>
          <select
            name={account}
            onChange={(e) => setAccount(e.target.value)}
            className="p-2 rounded-3"
            style={{
              border: "solid 1px #ddd",
              outline: "none",
              overflow: "hidden",
            }}
          >
            <option value="">Select</option>
            {enquiries.map((type) => (
              <option value={type.accountNumber} key={type.accountNumber}>
                {type.acctName} {`>>${type.product}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <CSVLink data={reports} filename="PostingJournal">
          <button className="btn-md member border-0">Export</button>
        </CSVLink>
      </div>
      <div className="table-responsive mt-3" id="customers">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Account No</th>
              <th>Account Name</th>
              <th>Trans. Name</th>
              <th>Post Seq.</th>
              <th>Trans. Date</th>
              <th>Value Date</th>
              <th>Cr</th>
              <th>Dr</th>
              <th>Posted By</th>
              <th>Authorized By</th>
              <th>Narration</th>
            </tr>
          </thead>
          {reports.length > 0 && (
            <tbody>
              {reports.map((report) => (
                <tr style={{ fontSize: "14px" }}>
                  <td>{report.accountNumber}</td>
                  <td>{report.accountName}</td>
                  <td>{report.transName}</td>
                  <td>{report.postseq}</td>
                  <td>
                    {new Date(report.tranDate).toLocaleDateString("en-us")}
                  </td>
                  <td>
                    {new Date(report.valueDate).toLocaleDateString("en-us")}
                  </td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.cr)}</td>
                  <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.dr)}</td>
                  <td>{report.postedBy}</td>
                  <td>{report.authorizedBy}</td>
                  <td>{report.narration}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {reports.length < 1 && (
          <div className="d-flex justify-content-center flex-column">
            <LiaTimesCircle className="mx-auto" size={30} />
            <p className="text-center">No record yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostingJournal;
