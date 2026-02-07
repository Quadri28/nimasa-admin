import React,{useMemo, useState, useContext, useEffect} from 'react'
import {FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { UserContext } from '../AuthContext';
import Table from '../DashboardComponents/CommunicationSubComponents/Table';
import axios from '../axios';
import { toast, ToastContainer } from 'react-toastify';

const ApplicationApproval = () => {
  const [candidates, setCandidates]= useState([])
  const {credentials}= useContext(UserContext)
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [searchQuery, setSearchQuery]= useState('')
 const [pageSize, setPageSize] = useState(10)
  const fetchIdRef = React.useRef(0);


  const fetchData = React.useCallback(async ({ pageSize, pageNumber, search })=> {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(
            `Election/get-contestants?PageSize=${pageSize}&PageNumber=${pageNumber + 1}&Filter=${encodeURIComponent(search)}`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },}
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setCandidates(resp.data.data.modelResult);
              setPageCount(
                Math.ceil(resp.data.data.totalCount / pageSize)
              );
            }
          });
        setLoading(false);
      }
    })
  }, []);

  useEffect(() => {
   const delayDebounce = setTimeout(() => {
     fetchData({ pageSize, pageNumber, search: searchQuery });
   }, 500);
 
   return () => clearTimeout(delayDebounce);
 }, [searchQuery, pageNumber, pageSize, fetchData]);
  
const approveCandidate=(id, status)=>{
  const payload={
    ContestantId:id,
    ApprovalStatus: status
  }
  axios.post('Election/update-contestant-application-status', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    fetchData({pageSize, pageNumber})
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
    const column=[
        {Header: 'Member ID', accessor:'memberId'},
        {Header: 'Member Name', accessor:'fullName'},
        {Header: 'Position applying for', accessor: 'positionName'},
        {Header: 'Election name', accessor:'electionName'},
        {Header: 'Status', accessor: 'approvalStatus', 
        Cell:({cell:{value}})=>{
         if (value === 3) {
             return( 
                 <div className='active-status px-2'>
                     <hr />
                      <span >Approved</span>
                 </div>)
         }else if (value === 1) {
             return(
             <div className='suspended-status px-2'>
                 <hr />
              <span >Pending</span>
              </div>
              )}else if (value === 4) {
                return(
                <div className='suspended-status px-2'>
                    <hr />
                 <span >Rejected</span>
                 </div>
                 )}
        }},
        {Header: 'Date applied', accessor: 'dateCreated', Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString('en-US')}</span>
        }) },
        {Header: 'Action', accessor: 'action', Cell:(props)=>{
            const id = props.row.original.id
            const status = props.row.original.approvalStatus
            return <>
            {status === 1 ?
             <div className="d-flex align-items-center justify-content-center gap-2">
              <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Reject</span>
               <FaRegTimesCircle size={20} style={{fontSize:'18px', cursor:'pointer'}} 
                onClick={()=>approveCandidate(id, 4)}/>
                </div>
                <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Approve</span>
                <FaRegCheckCircle size={20} style={{fontSize:'18px', cursor:'pointer'}} 
                onClick={()=>approveCandidate(id, 3)}/> 
                </div>
            </div> : ''
              }
              </>
        }},
    ]

    const columns = useMemo(() => column, []);
    
  return (
    <>
    <div className='card p-3 border-0 rounded-4'>
    <div className='d-sm-flex justify-content-between align-items-center my-3'
     style={{width:'fit-content'}}>
        <p className="active-selector" >
            Application Approval
        </p>
    </div>
    <Table 
      fetchData={fetchData}
      pageCount={pageCount}
      data={candidates}
      loading={loading}
      columns={columns}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      pageSize={pageSize}
      setPageSize={setPageSize}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      />
     </div>    
     <ToastContainer/>
     </>
  )
}

export default ApplicationApproval
