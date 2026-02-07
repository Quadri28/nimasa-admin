import React,{useCallback, useContext, useMemo, useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import axios from '../../Components/axios';
import Table from '../DashboardComponents/CommunicationSubComponents/Table';
import { UserContext } from '../AuthContext';
import { toast } from 'react-toastify';
import {GrEdit} from 'react-icons/gr'
import {MdOutlineRemoveRedEye, MdPersonAddAlt1} from 'react-icons/md'


const Election = () => {
  const [data, setData]= useState([])
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPagSize] = useState(10);
  const fetchIdRef = React.useRef(0);
  const {credentials}= useContext(UserContext)
  const [loading, setLoading]= useState(false)
  const [searchQuery, setSearchQuery]= useState('')

 // Function to fetch the data from the API
 const fetchData = useCallback(async ({ pageSize, pageNumber, search })=>{
  const fetchId = ++fetchIdRef.current;
  setLoading(true);
  axios
    .get(`Election/get-elections?PageSize=${pageSize}&PageNumber=${pageNumber+1}&Filter=${encodeURIComponent(search)}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    })
    .then((resp) => {
      if (fetchId === fetchIdRef.current) {
        if (resp.data.data.modelResult) {
          setData(resp.data.data.modelResult);
          setPageCount(Math.ceil(resp.data.data.totalCount / 10)); // Assuming PageSize is 10
        }
      }
    })
    .finally(() => setLoading(false));
}, [pageNumber, pageSize, credentials.token]);

 useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchData({ pageSize, pageNumber, search: searchQuery });
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery, pageNumber, pageSize, fetchData]);

    const column=[
      {Header: 'Election Name', accessor: 'title'},
        {Header: 'Start Date', accessor:'startDateAndTime', Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString('en-US')}</span>
        })},
        {Header: 'Setup Start Date & Time', accessor:'setUpStartDateAndTime', Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString('en-US')}</span>
        })},
         {Header: 'Setup End Date & Time', accessor:'setUpEndDateAndTime', Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString('en-US')}</span>
        })},
        {Header: 'End Date', accessor: 'endDateAndTime',Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')} {new Date(value).toLocaleTimeString('en-US')}</span>
        })},
        {Header: 'No of Applicants', accessor:'numberOfApplicant', Cell:(({value})=>{
          return <span className='d-flex justify-content-center'>{value}</span>
        })},
       {Header: 'Election status', accessor: 'isActive', 
       Cell:({cell:{value}})=>{
        if (value === true) {
            return( 
                <div className='active-status px-3' style={{width:'max-content'}}>
                    <hr />
                     <span >Active</span>
                </div>)
        }else if (value === false) {
            return(
            <div className='suspended-status px-3' style={{width:'max-content'}}>
                <hr />
             <span >In-active</span>
             </div>
             )}
       }},
        {Header: 'Action', accessor: 'action', Cell:(({cell})=>{
            const value = cell.row.original.electionStatusText
          const id = cell.row.original.id;
            return <div className='d-flex gap-3 align-items-center'>
              <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Edit</span>
              <Link to={`edit-election/${id}`} className='text-dark'><GrEdit size={16}/></Link>
              </div>
              <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">View</span>
              <Link to={`view-election/${id}`} className='text-dark'><MdOutlineRemoveRedEye size={16}/>
              </Link>
              </div>
              <div style={{ position: "relative" }} className="status-icon">
              <span className="stat">Add contestant</span>
              <Link to={`add-contestant/${id}`} className='text-dark'><MdPersonAddAlt1 size={16}/></Link>
              </div>
            </div>
        })},
    ]

    const columns = useMemo(() => column, []);
    
  return (
    <div className='card p-3 border-0 rounded-4'>
    <div className='d-sm-flex justify-content-between align-items-center my-2'>
        <p className="active-selector">
            All Elections
        </p>
      <div className='d-flex gap-3 export-btn-container my-2 flex-wrap '>
        <Link className='btn btn-md text-white rounded-4' to={'create-election'}
        style={{backgroundColor:'var(--custom-color)', fontSize:'14px'}}>
          Create new election</Link>
      </div>
    </div>
    <Table
    data={data}
    columns={columns}
    fetchData={fetchData}
    loading={loading}
    pageNumber={pageNumber}
    pageCount={pageCount}
    setPageNumber={setPageNumber}
    pageSize={pageSize}
    setPagSize={setPagSize}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    />
     </div>    
  )
}

export default Election
