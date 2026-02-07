import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import upload from "../../../assets/directbox-send.svg";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "react-toastify";
import GeneralLedgerTable from "../ConfigurationsSubComponents/ProductSettingComponent/GeneralLedgerTable";
import { useNavigate } from "react-router-dom";


const AddMultipleMember = ({file, handleChange, batchNo, setBatchNo, data}) => {
  const { credentials } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId]= useState('')

    const [members, setMembers]= useState([])
  
    //Fetch Batch number
      const getBatchNo=()=>{
        axios('MemberManagement/get-batch-no', {
          headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setBatchNo(resp.data.message))
      }
      //Fetch tracking Id
      const fetchTrackingId=()=>{
        axios('MemberManagement/get-tracking-Id', {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setTrackingId(resp.data.message))
      }

      const getMembers=()=>{
        axios(`MemberManagement/get-bulk-member-upload-response?BatchNumber=${batchNo}`, {
          headers:{
            Authorization: `Bearer ${credentials.token}`
          }
        }).then(resp=>setMembers(resp.data.data))
      }
      useEffect(()=>{
        getBatchNo()
        fetchTrackingId()
      }, [])

useEffect(()=>{
getMembers()
}, [batchNo])

const navigate = useNavigate()
 
  const getTemplate = () => {
    axios("MemberManagement/member-bulk-upload-template", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BulkMemberTemplate.xlsx");
      link.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
    });
  };

  const onSubmit =(e)=>{
    e.preventDefault()
    const payload = {
      batchNo: batchNo,
      trackingId: trackingId,
    }
    axios.post('MemberManagement/post-bulk-member', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
        navigate(-1)
      }, 5000);
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }

  //Displaying Table

   const column = [
      { Header: "Member ID", accessor: "memberId"},
      { Header: "Surname", accessor: "surname" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Gender", accessor: "gender" },
      { Header: "Monthly Cont.", accessor: "monthlyContrib", Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
      {Header:'Email', accessor:'email'},
      {Header:'Phone', accessor:'phoneNo'},
      {Header:'Next of kin', accessor:'nextOfKin'}
  ]
  const columns = useMemo(() => column, []);
  return (
    <>
    <div style={{border:'solid 1px #E6F0FF'}}>
    <form style={{padding:'1rem'}} onSubmit={onSubmit}>
          <div
          className="bg-white mt-3"
          style={{
            border:'solid 1px #fafafa',
            borderRadius:'12px 12px 0 0'
          }}
        >
     <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 p-3"
      style={{backgroundColor:'#f2f2f2', borderRadius:'10px 10px 0 0'}}>
      <h6 style={{fontSize:'16px'}}>Upload Bulk Member Creation From Excel File</h6>
        <button
          className="btn-md border-0 member"
          type="button"
          href="#"
          disabled={loading}
          onClick={getTemplate}
        >
          Download template
        </button>
      </div>
      <div className="px-3 admin-task-forms">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="batchNumber">Batch Number:</label>
          <input  name='batchNumber' disabled value={batchNo}/>
          </div>
          </div>
          <div className="px-3">
          <div
            className="my-5 d-flex flex-column text-center
             justify-content-center align-items-center rounded-4 p-3"
            style={{ border: "2px dashed #f2f2f2", height: "max-content" }}
          >
          
            <div style={{ margin: "2rem", }} >
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
          </div>
          <div className="px-3 mb-4">
          <GeneralLedgerTable data={data} columns={columns}/>
          </div>
          </div>
        <div className="d-sm-flex justify-content-end gap-4 p-3" 
        style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
        <button
          className="btn btn-md rounded-4"
          style={{ backgroundColor: "#ddf" }}
          type="reset"
        >
          Discard
        </button>
        <button className="border-0 btn-md text-white member" type="submit">
          Save
        </button>
      </div>
        </form>
      </div>
    </>
  );
};

export default AddMultipleMember;
