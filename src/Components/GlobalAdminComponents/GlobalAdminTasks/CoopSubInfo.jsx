import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {UserContext} from '../../../Components/AuthContext'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import axios from "../../axios";
import { Link } from "react-router-dom";

const CoopSubInfo = () => {
  const [roles, setRoles]= useState([])
  const {credentials}=useContext(UserContext)
    const getRoles=()=>{
      axios('Admin/cooperative-subscription-information', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        setRoles(resp.data.data)
      })
    }
    useEffect(()=>{
      getRoles()
    },[])
      
       const column = [
           { Header: "S/N", accessor: "", Cell:(({cell})=>{
            const sn= cell.row.index
            return <span>{sn +1}</span>
           }) },
           { Header: "Cooperative name", accessor: "org_name" },
           { Header: "Member(s) Count", accessor: "memCount" },
           { Header: "Outstanding amount", accessor: "outStandingAmt", Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
           }) },
           { Header: "Next due", accessor: "nextSubDue", Cell:(({value})=>{
            return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
           }) },
           { Header:'Next sub date', accessor:'nextSubDate', Cell:(({value})=>{
            return <span>{new Date(value).toLocaleDateString('en-US')}</span>
           }) }
          
         ];
       
         const columns = useMemo(() => column, []);
       
         const tableInstance = useTable(
           {
             columns: columns,
             data: roles,
           },
           useGlobalFilter,
           useSortBy,
           usePagination
         );
       
         const {
           getTableProps,
           getTableBodyProps,
           page,
           prepareRow,
           headerGroups,
           state,
           setGlobalFilter,
           nextPage,
           previousPage,
           canNextPage,
           canPreviousPage,
           pageOptions,
           gotoPage,
           pageCount,
         } = tableInstance;
         const { globalFilter, pageIndex } = state;
  
     return (
       <div className='bg-white p-3 rounded-3'>
       <div className="mb-3">
         <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Cooperative Subscription Info</h4>
         </div>
         <form className="search-form mb-4">
           <input
             type="text"
             placeholder="Search anything"
             className="w-100 "
             value={globalFilter || ""}
             onChange={(e) => setGlobalFilter(e.target.value)}
           />
         </form>
         <div className="table-responsive">
           <table {...getTableProps()} id="customers" className="table">
             <thead>
               {headerGroups.map((headerGroup) => (
                 <tr {...headerGroup.getHeaderGroupProps()}>
                   {headerGroup.headers.map((column) => (
                     <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                       {column.render("Header")}
                     </th>
                   ))}
                 </tr>
               ))}
             </thead>
             {roles.length ? (
               <tbody {...getTableBodyProps()}>
                 {page.map((row, index) => {
                   prepareRow(row);
                   return (
                     <tr {...row.getRowProps()}>
                       {row.cells.map((cell) => {
                         return (
                           <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                         );
                       })}
                     </tr>
                   );
                 })}
               </tbody>
             ) : (
               <tbody> No data entry yet</tbody>
             )}
           </table>
           <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
             <span>
               page {""}
               <strong>
                 {pageIndex + 1} of {pageOptions.length}
               </strong>
             </span>
             <button
               onClick={() => gotoPage(0)}
               className="btn btn-sm"
               disabled={!canPreviousPage}
             >
               {"<<"}
             </button>
             <button disabled={!canPreviousPage} className="btn btn-sm">
               {" "}
               <FaAngleLeft onClick={() => previousPage()} />{" "}
             </button>
             <button disabled={!canNextPage} className="btn btn-sm">
               <FaAngleRight onClick={() => nextPage()} />
             </button>
             <button
               onClick={() => gotoPage(pageCount - 1)}
               className="btn btn-sm"
               disabled={!canNextPage}
             >
               {">>"}
             </button>
           </div>
       </div>
       </div>
     )
   }
export default CoopSubInfo
