import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorText from "../../ErrorText";
import { FileUploader } from "react-drag-drop-files";
import upload from "../../../../assets/directbox-send.svg";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import GeneralLedgerTable from "../../ConfigurationsSubComponents/ProductSettingComponent/GeneralLedgerTable";

const Deduction = () => {
  const [file, setFile] = useState(null);
  const [sourceGL, setSourceGL] = useState("");
  const [financeGL, setFinanceGL] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [financeAccount, setFinanceAccount] = useState("");
  const [sourceOptions, setSourceOptions] = useState([]);
  const [financeOptions, setFinanceOptions] = useState([]);
  const [sourceEnquiries, setSourceEnquiries] = useState([]);
  const [financeEnquiries, setFinanceEnquiries] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);
  const [batchNumber, setBatchNumber] = useState("");
  const { credentials } = useContext(UserContext);

  const fetchSourceOptions = () => {
    axios("Acounting/general-Ledger-search-option", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setSourceOptions(resp.data));
  };
  const fetchFinanceOptions = () => {
    axios("Acounting/general-Ledger-search-option", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setFinanceOptions(resp.data));
  };
  const fetchBatchNo = () => {
    axios("MemberManagement/get-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNumber(resp.data.message));
  };

  useEffect(() => {
    fetchFinanceOptions();
    fetchSourceOptions();
    fetchBatchNo();
  }, []);

  const fetchSourceEnquiries = () => {
    axios(
      `Acounting/general-ledger-customer-enquiry?SearchOption=${sourceGL}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setSourceEnquiries(resp.data.data));
  };
  const fetchFinanceEnquiries = () => {
    axios(
      `Acounting/general-ledger-customer-enquiry?SearchOption=${financeGL}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setFinanceEnquiries(resp.data.data));
  };

  useEffect(() => {
    fetchSourceEnquiries();
  }, [sourceGL]);
  useEffect(() => {
    fetchFinanceEnquiries();
  }, [financeGL]);

  const onSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    const payload = {
      batchNo: batchNo,
      trackingId: batchNumber,
      sourceGl: sourceAccount,
      creditGl: financeAccount,
    };
    axios
      .post("Acounting/post-deduction-upload", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        setLoading(false)
        if (resp.data.data.deductionPostErrors) {
          setErrors(resp.data.data.deductionPostErrors);
        }
        setBatchNo("");
        setFile("");
        setFinanceAccount("");
        setFinanceGL("");
        setSourceGL("");
        setSourceAccount("");

        toast(resp.data.message, {
          type: "success",
          pauseOnHover: true,
          autoClose: 5000,
        });
      })
      .catch((error) =>{
        toast(error.response.data.message, {
          type: "error",
          pauseOnHover: true,
          autoClose: 5000,
        })
        setLoading(false)
      }
      );
  };

  const handleChange = (file) => {
    setFile(file);
    const payload = new FormData();
    payload.append("file", file);
    axios
      .post("Acounting/deduction-upload?", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        setBatchNo(resp.data.data.batchNo);
        if (resp.data.data.deductionsApprovedDetails) {
          setData(resp?.data?.data.deductionsApprovedDetails);
        }
      })
      .catch((error) => console.log(error));
  };

  const column = [
    { Header: "Member ID", accessor: "employeeId" },
    { Header: "Surname", accessor: "surname" },
    { Header: "First Name", accessor: "firstName" },
    {
      Header: "Contribution",
      accessor: "normalContribution",
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
    { Header: "Total Amount", accessor: "totalAmt" },
    { Header: "Approved Total Amt.", accessor: "approvedTotalAmt" },
    { Header: "Posted Date", accessor: "postedDate" },
  ];
  const errorColumn = [
    { Header: "Error Description", accessor: "errorDescription" },
    { Header: "Batch No", accessor: "batch" },
    { Header: "Created Date", accessor: "datecreated" },
  ];
  const columns = useMemo(() => column, []);
  const errorColumns = useMemo(() => errorColumn, []);

  return (
    <div className="mt-4">
      <div
        className="bg-white"
        style={{
          borderRadius: "15px",
          border: "solid .5px #fafafa",
          borderBlock: "0",
        }}
      >
        <form onSubmit={onSubmit}>
          <div
            style={{
              backgroundColor: "#f4fafd",
              borderRadius: "15px 15px 0 0",
            }}
            className="p-3"
          >
            <h5 style={{ fontSize: "16px", color: "#333" }}>
              Deduction Upload
            </h5>
          </div>
          <div className="my-3 admin-task-forms px-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="sourceGL">Select source option</label>
              <select
                name={sourceGL}
                value={sourceGL}
                onChange={(e) => setSourceGL(e.target.value)}
                as="select"
              >
                <option value="">Select option</option>
                {sourceOptions.map((option) => (
                  <option value={option.value} key={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="financeGL">Select finance option</label>
              <select
                name={financeGL}
                value={financeGL}
                onChange={(e) => setFinanceGL(e.target.value)}
                as="select"
              >
                <option value="">Select option</option>
                {financeOptions.map((option) => (
                  <option value={option.value} key={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="sourceAccount">Source GL/Account:</label>
              <select
                name={sourceAccount}
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                style={{ textOverflow: "ellipsis" }}
              >
                <option value="">Select</option>
                {sourceEnquiries.map((option) => (
                  <option value={option.accountNumber} key={option.acctName}>
                    {`${option.acctName} >> ${option.product}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="financeAccount">Finance Credit GL/Account:</label>
              <select
                name={financeAccount}
                onChange={(e) => setFinanceAccount(e.target.value)}
                style={{ textOverflow: "ellipsis" }}
                value={financeAccount}
              >
                <option value="">Select</option>
                {financeEnquiries.map((option) => (
                  <option value={option.accountNumber} key={option.acctName}>
                    {`${option.acctName} >> ${option.product}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="batchNo">Batch number:</label>
              <input name="batchNo" value={batchNo} readOnly />
            </div>
          </div>
          <div
            className="my-5 d-flex flex-column text-center mx-4
             justify-content-center align-items-center rounded-4 p-3"
            style={{ border: "2px dashed #ddd", height: "max-content" }}
          >
            <div style={{ margin: "2rem" }}>
              <img className="img-fluid mb-2" src={upload} />
              <FileUploader
                name="file"
                handleChange={handleChange}
                maxSize="5mb"
                label="Drag and drop or upload a file, maximum size of 5000kb"
              />
              <p>
                {file ? `File name: ${file.name}` : "no files uploaded yet"}
              </p>
            </div>
          </div>
          <div className="px-4">
            {errors.length < 1 ? (
              <GeneralLedgerTable data={data} columns={columns} />
            ) : (
              <GeneralLedgerTable data={errors} columns={errorColumns} />
            )}
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 15px 15px",
            }}
            className="d-flex justify-content-end gap-3 p-3"
          >
            <button
              type="reset"
              className="btn btn-sm rounded-5"
              style={{ backgroundColor: "#f7f7f7" }}
            >
              Discard
            </button>
            <button type="submit" className="border-0 btn-md member" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Deduction;
