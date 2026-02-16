import React, { useContext, useEffect, useMemo, useState } from "react";
import {UserContext} from '../../../Components/AuthContext'
import axios from "../../axios";
import { Link } from "react-router-dom";
import { BsArrowRepeat } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import Table from "../../DashboardComponents/CommunicationSubComponents/Table";
import { CiLock, CiUnlock } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";


const OperationLockStatus = () => {
  
    const [data, setData] = useState([])
    const {credentials}= useContext(UserContext)
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading]= useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(10)
     const fetchIdRef = React.useRef(0);
       const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
               const fetchId = ++fetchIdRef.current;
               setLoading(true);
               setTimeout(() => {
                 if (fetchId === fetchIdRef.current) {
                   axios
                     .get(
                      `Admin/locked-cooperative?PageSize=${pageSize}&PageNumber=${pageNumber + 1}`,
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
               fetchData({ pageSize, pageNumber });
             }, [fetchData, pageNumber, pageSize]);


     const unlockStatus=(id)=>{
      axios.post('Admin/un-locked-cooperative', {nodeId: id}, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000})
        fetchData()
      })
      .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
     }
     
     const lockStatus=(id)=>{
      axios.post('Admin/locked-cooperative', {nodeId: id}, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000})
        fetchData()
      })
      .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
     }
    
      const column = [
          { Header: "S/N", accessor: "", Cell:(({cell})=>{
            return <span>{1 + cell.row.index}</span>
          }) },
          { Header: "Cooperative Name", accessor: "tenant" },
          { Header: "Cooperative Code", accessor: "node_id" },
          { Header: "Total Number", accessor: "total_No", Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {}).format(value)}</span>
          }) },
          { Header: 'Status', accessor:'status', Cell: ({ cell: { value } })=>{
            if (value === 1) {
            return <div className="active-status px-3" style={{width:'fit-content'}}> <hr />Active</div>
            }else{
                return <div className="suspended-status px-3" style={{width:'fit-content'}}> <hr />Locked</div>
            }
        }},
          { Header:'Actions', accessor:'', Cell:(({cell})=>{
            const id = cell.row.original.node_id
            const status = cell.row.original.status
            return <div className="d-flex gap-1 align-items-center">
                {status === 1 ? <span onClick={()=>lockStatus(id)} style={{cursor:'pointer'}}> <CiLock size={20}/> Lock</span> : <span 
                onClick={()=>unlockStatus(id)} style={{cursor:'pointer'}}><CiUnlock/> Unlock</span>}
            </div>
        })},
        
        ];
      
        const columns = useMemo(() => column, []);
    return (
      <>
      <div className='bg-white p-3 rounded-3'>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Operation lock status</h4>
        </div>
        
        <Table 
      pageCount={pageCount}
      data={data}
      columns={columns}
      pageNumber={pageNumber}
      pageSize={pageSize}
      setPageSize={setPageSize}
      setPageNumber={setPageNumber}/>
      </div>
      <ToastContainer/>
    </>
  )
}

export default OperationLockStatus
