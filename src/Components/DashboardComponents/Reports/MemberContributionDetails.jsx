import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../AuthContext";
import { BsArrowLeft } from "react-icons/bs";
import UnpaginatedTable from "./UnpaginatedTable";

const MemberContributionDetails = () => {
  const [detail, setDetail] = useState({});
  const [reports, setReports]= useState([])
  const { credentials } = useContext(UserContext);
  const { id } = useParams();
  const navigate=useNavigate()

  const fetchMemberContributionDetails = async () => {
    await axios(
      `Reports/get-member-contribution-report-history-by-memberId?MemberId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => {
        setDetail(resp.data.data)
        setReports(resp?.data?.data?.contributionHistroyReports)
    });
  };

  useEffect(() => {
    fetchMemberContributionDetails();
  }, [id]);

const column = [
    {Header:'Date', accessor:'dateCreated', Cell:(({value})=>{
        return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString()}</span>
    })},
    {Header:'Account Number', accessor:'accountNumber'},
    {Header:'Previous Amount', accessor:'oldAmount', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    {Header:'New Amount', accessor:'newAmount',Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    {Header:'Status', accessor:'status'},
]

const columns = useMemo(()=>column, [])


  return (
    <>
     <div className="mt-3 rounded-4" style={{border:'solid 1px #f5f5f5'}}>
      <div
        style={{
          backgroundColor: "#F4FAFD",
          borderRadius: "15px 15px 0 0",
        }}
        className="p-3 d-flex gap-2"
      >
       <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> <h5 style={{fontSize:'16px', color:'#333'}}>Member Contribution Details</h5>
      </div>
      <div className="mx-1 p-3 mt-3">
        <div
          className="d-flex flex-column gap-2 pb-3 px-0"
          style={{
            boxShadow: "3px 3px 3px 3px #ddd",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div
            style={{
              backgroundColor: "#EDF4FF",
              paddingTop: "10px",
              paddingInline: "15px",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <p>Member Details</p>
          </div>

          <div className="accounting-form-container p-3">
            <span>Name: {detail?.employeeName}</span>
            <span>Member ID: {detail?.memberId}</span>
            <span>Phone: {detail?.employeePhoneNumber}</span>
            <span>Email: {detail?.employeeEmail}</span>
            <span>Current Contribution: {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.currentContribution)}</span>
          </div>

        </div>
      </div>
      <UnpaginatedTable 
      data={reports}
      columns={columns}
      />
      
      </div>
    </>
  );
};

export default MemberContributionDetails;
