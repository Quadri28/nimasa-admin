import React, { useState, useRef, useEffect, useContext } from "react";
import { Form, Formik, Field } from "formik";
import upload from "../../../assets/directbox-send.svg";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { FileUploader } from "react-drag-drop-files";
import { toast, ToastContainer } from "react-toastify";

const BulkLoanCreation = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [batchNo, setBatchNo] = useState({})
  const [data, setData] = useState([])

  const {credentials}= useContext(UserContext)

  const fetchBatchNo =()=>{
    axios('Acounting/fetch-batch-no', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setBatchNo(resp.data.data.batchNumber))
  }
  
  useEffect(()=>{
fetchBatchNo()
  }, [])
    const handleChange = (file) => {
      setFile(file);
      const payload= new FormData()
      payload.append('file', file)
      axios.post(`LoanApplication/upload-bulk-loan-application?batchNo=${batchNo}`, payload,{
        headers:{
          Authorization: `Bearer ${credentials.token}`
        }
      }).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
        if (resp.data.data) {
        setData(resp?.data?.data)
        }
      })
  }

  const downloadTemplate = () => {
    axios('LoanApplication/bulk-loan-application-upload-template', {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BulkLoanTemplate.xlsx");
      link.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    });
  };

  const postApplications=(e)=>{
    e.preventDefault()
    const payload={
      batchNo: String(batchNo),
      trackingId:String(batchNo)
    }
    axios.post('LoanApplication/post-bulk-loan-application', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true}))
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
  return (
    <div>
      <div className="mt-4 bg-white px-3 py-2 rounded-4">
      <div className="d-flex my-4 justify-content-between">
        <p className="active-selector">Bulk Loan Creation</p>
        <button className="px-4 btn btn-md text-white rounded-5" 
        style={{backgroundColor:'var(--custom-color)', fontSize:'14px'}} onClick={()=>downloadTemplate()}>
            Download Excel Template</button>
        </div>
        <div
          style={{
            backgroundColor: "#F5F9FF",
            borderRadius: "15px 15px 0 0",
          }}
          className="py-3 px-4"
        >
          <h5 style={{fontSize:'16px'}}>Bulk Loan Creation</h5>
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
              <div style={{backgroundColor:'#F2F2F2', padding:'10px', borderRadius:'2rem'}}
               className="d-flex flex-column gap-2">
                <span className="text-center mt-2" style={{fontWeight:'500', fontFamily:'DM Sans'}}>
                    Please upload an excel sheet with the following columns:</span>
                <span style={{fontSize:'14px', textAlign:'center', fontFamily:'DM Sans' }}>
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
            <div style={{ margin: "2rem 0", }} >
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
            <div className="table-responsive">
        <table className="table" id="customers" style={{fontSize:'16px'}}>
        <thead>
          <tr>
              <th>Product Code</th>
              <th>Member ID</th>
              <th>Loan Funding Src</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>First PMT Date</th>
              <th>Loan Term</th>
              <th>Term Freq.</th>
              <th>Int. Rate</th>
              <th>Loan Amount</th>
              <th>Loan Purpose</th>
              <th>Loan Source</th>
          </tr>
          </thead>
            <tbody>
              {data.map((data)=>(
              <tr>
                <td>{data?.productCode}</td>
                <td>{data?.memberID}</td>
                <td>{data?.loanFundingSource}</td>
                <td>{data?.startDate}</td>
                <td>{data?.endDate}</td>
                <td>{data?.firstPMTDate}</td>
                <td>{data?.loanTerm}</td>
                <td>{data?.termFreq}</td>
                <td>{data?.interestRate}</td>
                <td>{data?.loanAmount}</td>
                <td>{data?.loanPurpose}</td>
                <td>{data?.loanSource}</td>
              </tr>
              ))}
            </tbody>
        </table>
      </div>
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
              <button type="submit" className="border-0 btn-md member">
                Post
              </button>
            </div>
          </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default BulkLoanCreation;
