import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../../AuthContext'
import Table from '../../CommunicationSubComponents/Table'
import axios from '../../../axios'

const AppReschedule = () => {
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
                  `RequestApproved/get-app-reschedule-savings?PageNumber=${
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
          {Header:'Employee Name', accessor:'fullName'},
          {Header:'Account Number', accessor:'accountNumber'},
          {Header:'New Amount', accessor:'newAmount', Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
          })},
          {Header:'Approved By', accessor:'approvedBy'},
          {Header:'Status', accessor:'status', Cell:(({value})=>{
           if (value === 'Rejected') {
           return <div className="suspended-status px-3">
               <hr /> <span>{value}</span>
           </div>
           }else{
               return <div className="active-status px-3">
                   <hr /> <span>{value}</span>
               </div>
           }
       })},]
   
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
export default AppReschedule
