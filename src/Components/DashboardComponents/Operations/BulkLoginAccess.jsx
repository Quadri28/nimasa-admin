import React, { useContext, useEffect, useMemo, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import upload from "../../../assets/directbox-send.svg";
import GeneralLedgerTable from "../ConfigurationsSubComponents/ProductSettingComponent/GeneralLedgerTable";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {BsArrowLeft} from 'react-icons/bs'

const BulkLoginAccess = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [batchNo, setBatchNo] = useState(null)
  const [feebacks, setFeedbacks]= useState([])

const {credentials}= useContext(UserContext)
const navigate = useNavigate()
  const column = [
         { Header: "Customer ID", accessor: "customerId" },
         { Header: "Customer Name", accessor: "customerName"},
         { Header: "Username", accessor: "username" },
         {Header:'Password', accessor:'password'},
     ]
       const respcolumn = [
         { Header: "Customer ID", accessor: "customerId" },
         { Header: "Customer Name", accessor: "customerName"},
         { Header: "Username", accessor: "username" },
         {Header:'Password', accessor:'password'},
         {Header:'Feedback Message', accessor:'retrvalMessage'},
     ]
     const errorColumn = [
      { Header: "Error Description", accessor: "errorDescription"},
      { Header: "Batch No", accessor: "batch" },
      {Header:'Created Date', accessor:'datecreated'},
  ]
     const columns = useMemo(() => column, []);
     const respcolumns = useMemo(() => respcolumn, []);
     const errorColumns = useMemo(() => errorColumn, []);

const fetchBatchNo=()=>{
  axios('MemberManagement/get-batch-no', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setBatchNo(resp.data.message))
}
useEffect(()=>{
fetchBatchNo()
}, [])
  const handleChange = (file) => {
    setFile(file);
    const payload = new FormData();
    payload.append("file", file);
    axios
      .post(
        `MemberManagement/upload-bulk-member-login-account-creation?batchNo=${batchNo}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${credentials.token}`,
          },
        }
      )
      .then((resp) => {
        if (resp.data.data) {
          setData(resp?.data?.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const downloadTemplate = async ()=>{
 await axios(`MemberManagement/member-login-creation-upload-template`, 
    {responseType: "blob",
    headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((blob) => {
    setLoading(false)
    const url = window.URL.createObjectURL(new Blob([blob.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bulkloginaccess.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
  }).catch(error=>{
    setLoading(false)
  })
  }

  const onSubmit = async (e) => {
    const payload={
      batchNo:batchNo
    }
    e.preventDefault()
    try {
    await axios.post('MemberManagement/bulk-member-login-creation', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        setFeedbacks(resp.data.data)
        toast(resp.data.message, {autoClose:5000, pauseOnHover: true, type:'success'})
      })
    } catch (error) {
      toast(error.response.data.message, {type:'error', autoClose:false})
    }
  };


  return (
    <>
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
              className="p-3 d-flex justify-content-between align-items-center"
            >
              <h5 style={{ fontSize: "16px", color: "#333" }}>
               <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Bulk Login Access
              </h5>
              <button className="member border-0"
              type="button"
              onClick={()=>{ downloadTemplate() }}>Download template</button>
            </div>
            <div className="admin-task-forms p-3">
            <input type="text" value={batchNo} name="batchNo" />
            </div>
            <div
              className="mb-5 mt-3 d-flex flex-column text-center mx-4
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

            {feebacks.length === 0 &&<div className="px-4">
              {errors.length < 1 ? (
                 <GeneralLedgerTable data={data} columns={columns} />
              ) : (
                <GeneralLedgerTable data={errors} columns={errorColumns} />
              )}
            </div>}
              <div className="px-4 mb-2">
            {
              feebacks.length > 0 && 
                <GeneralLedgerTable data={feebacks} columns={respcolumns} />
            }
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
              <button type="submit" className="border-0 btn-md member">
                Post
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default BulkLoginAccess;
