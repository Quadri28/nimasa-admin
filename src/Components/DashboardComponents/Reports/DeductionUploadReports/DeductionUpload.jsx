import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../../AuthContext'
import Table from '../../CommunicationSubComponents/Table'
import axios from '../../../axios'
import { Link } from 'react-router-dom'

const DeductionUpload = () => {

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
               `Reports/get-deduction-upload-report?PageNumber=${
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
        {Header:'Batch Number', accessor:'batchNumber'},
        {Header:'Deduction Period', accessor:'deductionPeriod'},
        {Header:'Total Amount', accessor:'totalAmt',  Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header:'Status', accessor:'status', Cell:(({value})=>{
            if (value === 'Successful') {
            return <div className="active-status px-3">
                <hr /> <span>{value}</span>
            </div>
            }else{
                return <div className="suspended-status px-3">
                    <hr /> <span>{value}</span>
                </div>
            }
        })},
        {Header:'Action', Cell:(({cell})=>{
            const id = cell.row.original.batchNumber
            return <button className="member border-0 btn-md">
                <Link to={`view-deduction-upload/${id}`} className='text-white' style={{textDecoration:'none'}}>View Deduction </Link>
                </button>
        })}
     ]

     const columns= useMemo(()=>column,[])

  return (
    <>
    <h5 className="fs-6">Deduction Upload Reports</h5>
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

export default DeductionUpload
