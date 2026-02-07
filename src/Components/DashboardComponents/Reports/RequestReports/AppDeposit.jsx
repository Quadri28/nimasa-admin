import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../../AuthContext'
import Table from '../../CommunicationSubComponents/Table'
import axios from '../../../axios'

const AppDeposit = () => {
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
               `RequestApproved/get-app-deposits?PageNumber=${
                 pageNumber + 1
               }&PageSize=${pageSize}`,
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
        {Header:'Employee Name', accessor:'employeeName'},
        {Header:'Account Number', accessor:'accountnumber'},
        {Header:'Deposit Amount', accessor:'deposit', Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header:'Date', accessor:'approveDate'},
        {Header:'Status', accessor:'status', Cell:(({value})=>{
            if (value === 'Approved') {
            return <div className="active-status px-3">
                <hr /> <span>{value}</span>
            </div>
            }else{
                return <div className="pending-status px-3">
                    <hr /> <span>{value}</span>
                </div>
            }
        })},
     ]

     const columns= useMemo(()=>column,[])

  return (
    <>

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

export default AppDeposit
