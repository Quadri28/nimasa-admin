import React,{useContext, useEffect, useMemo, useState} from 'react'
import { BsThreeDots } from 'react-icons/bs';
import axios from '../axios';
import { UserContext } from '../AuthContext';
import { GrEdit } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import Table from '../DashboardComponents/CommunicationSubComponents/Table';

const Candidates = () => {
  const [candidates, setCandidates]= useState([])
  const {credentials}= useContext(UserContext)
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [pageSize, setPageSize] = useState(10)
  const fetchIdRef = React.useRef(0);


  const fetchData = React.useCallback(() => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(`Election/get-contestants?PageSize=${pageSize}&PageNumber=${pageNumber+1}`,
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
  fetchData();
}, [pageNumber, fetchData, pageSize]);


    const column=[
        {Header: 'S/N', accessor: '', Cell:(({cell})=>{
          const No = cell.row.index
          return <span>{No +1}</span>
        })  },
        {Header: 'Member ID', accessor:'memberId'},
        {Header: 'Member Name', accessor:'fullName'},
        {Header: 'Position', accessor: 'positionName'},
        {Header: 'Election type', accessor:'electionName'},
        {Header: 'Eligibility status', accessor: 'approvalStatus', 
        Cell:({cell:{value}})=>{
         if (value === 3) {
             return( 
                 <div className='active-status px-3'  style={{width:'fit-content'}}>
                     <hr />
                      <span >Approved</span>
                 </div>)
         }else if (value=== 2) {
          return( 
            <div className='suspended-status px-3'  style={{width:'fit-content'}}>
                <hr />
                 <span >Review</span>
            </div>)
         }
         else if (value ===1) {
          return( 
            <div className='suspended-status px-3'  style={{width:'fit-content'}}>
                <hr />
                 <span >Pending</span>
            </div>)
         }
         else{
             return(
             <div className='suspended-status px-3' style={{width:'fit-content'}}>
                 <hr />
              <span >Rejected</span>
              </div>
              )}
        }},
        {Header: 'Action', accessor: 'action', Cell:(props)=>{
            const id = props.row.original.id
            return<div className="d-flex align-items-center justify-content-center">
              <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Edit</span>
            <Link to={`update-candidate/${id}`} className='text-dark'>
            <GrEdit style={{fontSize:'18px', cursor:'pointer'}}/></Link>
            </div>
        </div>
        }},
    ]

    const columns = useMemo(() => column, []);
    
  return (
   <>
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
      />
     </>    
  )
}
export default Candidates
