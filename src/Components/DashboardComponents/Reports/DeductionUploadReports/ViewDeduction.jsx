import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../../AuthContext'
import Table from '../../CommunicationSubComponents/Table'
import axios from '../../../axios'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'

const ViewDeduction = () => {
    const {id} = useParams() 
    const navigate = useNavigate()
 const [data, setData]= useState([])
    const {credentials}=useContext(UserContext)
    const [loading, setLoading]= useState(false)
    const [pageCount, setPageCount]= useState(0)
    const [pageNumber, setPageNumber]= useState(0)
    const [pageSize, setPageSize]= useState(10)
      const fetchIdRef = React.useRef(0);
    
    const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
       const fetchId = ++fetchIdRef.current;
       setLoading(true);
       setTimeout(() => {
         if (fetchId === fetchIdRef.current) {
           axios
             .get(
               `Reports/deduction-report-detail?PageSize=${pageSize}&PageNumber=${pageNumber + 1}&BatchNumber=${id}`,
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

     const column = [
        {Header:'Employee ID', accessor:'employeeId'},
        {Header:'First Name', accessor:'firstName'},
        {Header:'Last Name', accessor:'surname'},
        {Header:'Deduction Period', accessor:'period'},
        {Header:'Normal Deduction', accessor:'normalContribution',  Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header:'Loan', accessor:'loanRepayment', Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header:'Total', accessor:'totalAmt', Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header:'Approved Amount', accessor:'approvedTotalAmt'},
        {Header:'Company', accessor:'company'},
     ]

     const columns= useMemo(()=>column,[])
  return (
    <>
    <div className="d-flex gap-1 align-items-center">
    <BsArrowLeft style={{cursor:'pointer'}} onClick={()=>navigate(-1)}/> View Deduction</div>
      
      <Table 
      fetchData={fetchData}
      pageCount={pageCount}
      data={data}
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

export default ViewDeduction
