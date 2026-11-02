import React, { useState, useRef, useEffect, useMemo } from "react";
import upload from "../../../assets/directbox-send.svg";
import axios from "../../axios";
import { FileUploader } from "react-drag-drop-files";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import UnpaginatedTable from "../Reports/UnpaginatedTable";

const BulkLoanCreation = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchNo, setBatchNo] = useState({});
  const [data, setData] = useState([]);


  const fetchBatchNo = () => {
    axios("Acounting/fetch-batch-no").then((resp) => setBatchNo(resp.data.data.batchNumber));
  };

  useEffect(() => {
    fetchBatchNo();
  }, []);
  const handleChange = (file) => {
    setFile(file);
    const payload = new FormData();
    payload.append("file", file);
    if (!batchNo) {
  toast("Batch number not ready yet", { type: "error" });
  return;
}
    axios
      .post(
        `LoanApplication/upload-bulk-loan-application?batchNo=${batchNo}`,
        payload
      )
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        if (resp.data.data) {
          setData(resp?.data?.data);
        }
      });
  };

  const downloadTemplate = () => {
    axios("LoanApplication/bulk-loan-application-upload-template", {responseType:'blob'}).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BulkLoanTemplate.xlsx");
      link.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    });
  };
const downloadPDF = (responseData) => {
  const doc = new jsPDF();

  doc.text("Bulk Upload Report", 14, 15);

  const tableData = responseData.map(item => [
    item.memberID,
    item.reportMessage
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Member ID", "Report Message"]],
    body: tableData,
  });

  doc.save("Bulk_Upload_Report.pdf");
};
  const postApplications = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      batchNo: String(batchNo),
      trackingId: String(batchNo),
    };
    axios
      .post("LoanApplication/post-bulk-loan-application", payload)
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setLoading(false);
        setTimeout(() => {
          setFile(null);
          setData([]);
          fetchBatchNo();
          downloadPDF(resp?.data?.data)
        }, 3000);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
        setLoading(false);
      });
  };

  const column = [
    { Header: "Product Code", accessor: "productCode" },
    { Header: "Member ID", accessor: "memberId" },
    { Header: "Loan Funding Src", accessor: "loanFundingSource" },
    { Header: "Start Date", accessor: "startDate" },
    { Header: "End Date", accessor: "endDate" },
    { Header: "First PMT Date", accessor: "firstPaymentDate" },
    { Header: "Loan Term", accessor: "loanTerm" },
    { Header: "Term Freq.", accessor: "termFreq" },
    { Header: "Int. Rate", accessor: "interestRate" },
    { Header: "Loan Amount", accessor: "loanAmount" },
    { Header: "Loan Purpose", accessor: "loanPurpose" },
    { Header: "Loan Source", accessor: "loanSource" },
  ]

  const columns = useMemo(() => column, []);

                    

  return (
    <div>
      <div className="mt-4 bg-white px-3 py-2 rounded-4">
        <div className="d-flex my-4 justify-content-between">
          <p className="active-selector">Bulk Loan Creation</p>
          <button
            className="px-4 btn btn-md text-white rounded-5"
            style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
            onClick={() => downloadTemplate()}
          >
            Download Excel Template
          </button>
        </div>
        <div
          style={{
            backgroundColor: "var(--memcos-blue)",
            borderRadius: "15px 15px 0 0",
          }}
          className="py-3 px-4"
        >
          <h5 style={{ fontSize: "16px" }}>Bulk Loan Creation</h5>
        </div>

        <form onSubmit={postApplications}>
          <div
            className="bg-white p-4"
            style={{
              borderRadius: "0",
              border: "solid 1px #f2f2f2",
              borderBlock: "0",
            }}
          >
            <div
              style={{
                backgroundColor: "#F2F2F2",
                padding: "10px",
                borderRadius: "2rem",
              }}
              className="d-flex flex-column gap-2"
            >
              <span
                className="text-center mt-2"
                style={{ fontWeight: "500", fontFamily: "DM Sans" }}
              >
                Please upload an excel sheet with the following columns:
              </span>
              <span
                style={{
                  fontSize: "14px",
                  textAlign: "center",
                  fontFamily: "DM Sans",
                }}
              >
                Product Code | Member ID | Loan Funding Source | Start
                Date(yyyy-mm-dd) | End Date(yyyy-mm-dd) | First PMT
                Date(yyyy-mm-dd) | Loan Term.
              </span>
            </div>
            <div
              className="my-5 d-flex flex-column text-center
             justify-content-center align-items-center rounded-4"
              style={{ border: "2px dashed #ddd", height: "max-content" }}
            >
              <div style={{ margin: "2rem 0" }}>
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
            <UnpaginatedTable data={data} columns={columns} isExport={false}/>
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
              className="btn btn-sm rounded-5 px-4"
              style={{ backgroundColor: "#f7f7f7" }}
            >
              Discard
            </button>
            <button
              type="submit"
              className="border-0 btn-md member"
              disabled={loading}
            >
              Post
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BulkLoanCreation;
