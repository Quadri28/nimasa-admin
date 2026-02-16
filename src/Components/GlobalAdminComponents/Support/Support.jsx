import React, { useContext, useEffect, useMemo, useState } from 'react'
import Table from '../../DashboardComponents/CommunicationSubComponents/Table'
import { Link } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { MdOutlineModeEdit } from 'react-icons/md'

const Support = () => {
    const [data, setData]= useState([])
    const [loading, setLoading]= useState(false)
    const [pageNumber, setPageNumber] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const fetchIdRef = React.useRef(0);
    const {credentials} = useContext(UserContext)

    const fetchData = React.useCallback(() => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        setTimeout(() => {
          if (fetchId === fetchIdRef.current) {
            axios
              .get(
                `Faq/get-all-faq-question?PageSize=${pageSize}&PageNumber=${pageNumber + 1}`,
                {
                  headers: {
                    Authorization: `Bearer ${credentials.token}`,
                  },}
              )
              .then((resp) => {
                if (resp.data.data.modelResult) {
                  setData(resp.data.data.modelResult);
                  setPageCount(
                    Math.ceil(resp.data.data.totalCount / pageSize)
                  );
                }
              });
            setLoading(false);
          }
        })
      }, []);
    
    
      const column = [
        { Header: "S/N", accessor: "", Cell:(({cell})=>{
          return <span>{1 + cell.row.index}</span>
        }) },
        { Header: "Question Name", accessor: "questionName" },
        { Header: "Section Name", accessor: "questionSectionName" },
        { Header: "Answer", accessor: "answer" },
        { Header: 'Status', accessor:'isActive', Cell: ({ cell: { value } })=>{
          if (value === true) {
          return <div className="active-status px-3" style={{width:'fit-content'}}> <hr />Active</div>
          }else{
              return <div className="suspended-status px-3" style={{width:'fit-content'}}> <hr />In-active</div>
          }
      }},
        { Header:'Actions', accessor:'', Cell:(({cell})=>{
          const id = cell.row.original.id
          return <div className="d-flex gap-1 align-items-center justify-content-center">
             <Link to={`edit-faq/${id}`} className='text-dark'> <MdOutlineModeEdit style={{cursor:'pointer'}} size={20}/></Link>
          </div>
      })},
      ];
    
      const columns = useMemo(() => column, []);
       useEffect(() => {
         fetchData({ pageSize, pageNumber });
       }, [fetchData, pageNumber, pageSize]);
  return (
    <>
    <div className="d-flex justify-content-between align-items-center">
      <h4 style={{ fontSize: "18px" }}>Support</h4>
      <div className="d-flex gap-3">
      <Link to='create-faqs' className='border-0 btn-md px-3 member'
       style={{fontSize:'14px', textDecoration:'none'}}>Create FAQ</Link>
         <Link to='faq-section' className='border-0 btn-md px-3 member'
       style={{fontSize:'14px', textDecoration:'none'}}>FAQ section</Link>
       </div>
    </div>
   <Table
   data={data}
   loading={loading}
   fetchData={fetchData}
   columns={columns}
   pageNumber={pageNumber}
   pageCount={pageCount}
   setPageNumber={setPageNumber}
   pageSize={pageSize}
   setPageSize={setPageSize}
   />
    </>
  )
}

export default Support
