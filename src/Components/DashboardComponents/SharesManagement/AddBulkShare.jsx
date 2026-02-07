import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import { Form, Formik, Field } from "formik";
import upload from "../../../assets/directbox-send.svg";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";
import UnpaginatedTable from "../Reports/UnpaginatedTable";

const AddBulkShare = () => {
  const [file, setFile] = useState(null);
  const [batchNo, setBatchNo] = useState("");
  const [data, setData] = useState([]);
  const [info, setInfo] = useState([])

  const handleChange = (file) => {
    setFile(file);
  };

  const { credentials } = useContext(UserContext);

  const getBatchNo = () => {
    axios("MemberManagement/get-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNo(resp.data.message));
  };

  useEffect(() => {
    getBatchNo();
  }, []);
  const uploadBulkShare = () => {
    const payload = new FormData();
    payload.append("file", file);
    axios
      .post(`ShareManagement/upload-bulk-share?batchNo=${batchNo}`, payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        if(resp.data.data){
          setData(resp.data.data)}
          if (file) {
            toast(resp.data.message, {
              type: "success",
              autoClose: 5000,
              pauseOnHover: true,
            });
          }
        }).catch(error=>{
          if(file)
          toast(error.response.data.message, {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
  })});
  };

  useEffect(() => {
    uploadBulkShare();
  }, [batchNo, file]);

  const postBulkShare = (e) => {
    e.preventDefault();
    const payload ={
      batchNo: batchNo
    }
    axios
      .post("ShareManagement/post-bulk-share", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        setFile(null);
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setInfo(resp.data.data)
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  //Displaying Table

  const column = [
    { Header: "Customer ID", accessor: "customerId" },
    { Header: "Customer Name", accessor: "customerName" },
    { Header: "Share Name", accessor: "shareTypeName" },
    { Header: "Purchasing Date", accessor: "purchasingDate", Cell:(({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-US')}</span>
    }) },
    { Header: "Purchasing Unit", accessor: "purchaseUnit" },
    { Header: "Purchased Amount", accessor: "purchasedAmount" },
    { Header: "Savings Account",  accessor: "debitAccountNumber"},
  ];
   const column1 = [
    { Header: "Customer Name", accessor: "customerName" },
    { Header: "Share Type", accessor: "shareTypeName" },
    { Header: "Purchased Unit", accessor: "purchaseUnit" },
    { Header: "Purchased Amount", accessor: "purchasedAmount" },
    { Header: "Remark", accessor: "remarks" },
    
  ];
  const columns = useMemo(() => column, []);
  const columns1 = useMemo(() => column1, []);
  return (
    <div>
      <div className="px-3 admin-task-forms">
        <div className="d-flex flex-column gap-1">
          <label htmlFor="batchNumber">Batch Number:</label>
          <input name="batchNumber" disabled value={batchNo} />
        </div>
      </div>
      <form onSubmit={postBulkShare}>
        <div className="px-3">
          <div className="mt-4 bg-white py-2 rounded-4">
            <div
              style={{
                backgroundColor: "#E6F0FF",
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
                Member ID, Surname, or Phone Number | Account Number | Share
                Type | Purchasing Amount | Date(yyyy-mm-dd) |
                Description/Narration.
              </span>
            </div>
            <div
              className="my-5 d-flex flex-column text-center
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
            <div className="mb-4">
              {info.length < 1 ? <UnpaginatedTable data={data} columns={columns} />
              : <UnpaginatedTable data={info} columns={columns1} />}
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: "0 0 10px 10px",
          }}
          className="d-flex justify-content-end gap-3 p-3 mt-3"
        >
          <button
            type="reset"
            className="btn btn-sm rounded-5 px-4"
            style={{ backgroundColor: "#f7f7f7" }}
          >
            Discard
          </button>
          <button type="submit" className="border-0 btn-sm member px-4 ">
            Post
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddBulkShare;
