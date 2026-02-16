import React, { useContext, useEffect, useMemo, useState } from "react";

import {UserContext} from '../../../Components/AuthContext'
import axios from "../../axios";
import { Link } from "react-router-dom";
import Table from "../../DashboardComponents/CommunicationSubComponents/Table";
import { LuView } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";


const CooperativeApproval = () => {
    const [data, setData] = useState([])
    const {credentials}= useContext(UserContext)
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading]= useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery]= useState('')
    
     const fetchIdRef = React.useRef(0);

   
     const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
         const fetchId = ++fetchIdRef.current;
         setLoading(true);
         setTimeout(() => {
           if (fetchId === fetchIdRef.current) {
             axios
               .get(
                `Admin/cooperative-registration-authorization?PageSize=${pageSize}&PageNumber=${pageNumber + 1}&Filter=${encodeURIComponent(search)}`,
                 {
                   headers: {
                     Authorization: `Bearer ${credentials.token}`,
                   },
                 }
               )
               .then((resp) => {
                 if (resp.data.data.modelResult) {
                   setData(resp.data.data.modelResult);
                   setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
                 }
               });
             setLoading(false);
           }
         });
       }, []);
       
     useEffect(() => {
         const delayDebounce = setTimeout(() => {
           fetchData({ pageSize, pageNumber, search: searchQuery });
         }, 500);
       
         return () => clearTimeout(delayDebounce);
       }, [searchQuery, pageNumber, pageSize, fetchData]);
     
   
     const resendEmail=(id)=>{
      const payload={
        uniqueId : String(id)
      }
      axios.post('Admin/resend-email-cooperative-registration-approval', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true}))
      .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
     }
      const column = [
          { Header: "S/N", accessor: "", Cell:(({cell})=>{
            return <span>{cell.row.index + 1}</span>
          }) },
          { Header: "Cooperative Name", accessor: "org_name" },
          { Header: "Cooperative ID", accessor: "uniqueId" },
          { Header: "Email", accessor: "email" },
          { Header: "Date Created", accessor: "create_date", Cell:(({value})=>{
            return <span>{new Date(value).toLocaleDateString('en-US')}</span>
          }) },
          { Header: 'Status', accessor:'status', Cell: ({ cell: { value } })=>{
              if (value != 'Pending') {
              return <div className="active-status px-3" style={{width:'fit-content'}}> 
              <hr />{value}</div>
              }else{
                  return <div className="suspended-status px-3" style={{width:'fit-content'}}><hr />{value}</div>
              }
          }},
          { Header:'Actions', accessor:'', Cell:(({cell})=>{
              const id = cell.row.original.uniqueId
              const status = cell.row.original.status
              return <div className="d-flex gap-3 align-items-center" style={{fontSize:'12px'}}>
                  {
                    status === 'Activated' ? <Link to={`view-request/${id}`} style={{textDecoration:'none', color:'#333'}}>
                      <LuView/> View request</Link>:
                    <span style={{cursor:'pointer'}} onClick={()=>resendEmail(id)}><HiOutlineMail/> Resend approval email</span>
                  }
              </div>
          })}         
        ];
      
        const columns = useMemo(() => column, []);
  
    return (
      <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Cooperative approval</h4>
        <button className='border-0 btn-md member rounded-5 px-3'
          >Add new user</button>
        </div>
  
      <Table 
      fetchData={fetchData}
      pageCount={pageCount}
      data={data}
      loading={loading}
      columns={columns}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageSize={setPageSize}
      setPageNumber={setPageNumber}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      />

      <ToastContainer/>
      </>
    )
  }
export default CooperativeApproval
