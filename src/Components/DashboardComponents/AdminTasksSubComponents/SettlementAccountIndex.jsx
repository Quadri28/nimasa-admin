import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {UserContext} from '../../../Components/AuthContext'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import axios from "../../axios";
import { Link, Outlet } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";


const SettlementAccountIndex = () => {
    const data=[
        {bankName: 'Admin', accountNumber:'9804999034',},
        {bankName: 'Admin', accountNumber:'9804999034',},
        {bankName: 'Admin', accountNumber:'9804999034',},
        {bankName: 'Admin', accountNumber:'9804999034',},
        {bankName: 'Admin', accountNumber:'9804999034',},
     ]
     const column = [
         { Header: "Role name", accessor: "bankName" },
         { Header: "Account Number", accessor: "accountNumber" },
         { Header:'Actions', accessor:'', Cell:(()=>{
             return <div className="d-flex gap-3 align-items-center">
                 <MdOutlineEdit/>
             </div>
         })}
        
       ];
     
       const columns = useMemo(() => column, []);
       const datas = useMemo(() => data, []);
     
       const tableInstance = useTable(
         {
           columns: columns,
           data: datas,
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
     <div className="d-flex justify-content-between align-items-center mb-3">
       <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Settlement account</h4>
       <Link to='add-settlement-account' style={{fontSize:'14px', color:'#fff',
          backgroundColor:'var(--custom-color)'}} className='btn btn-md rounded-5 px-3'>
            Add new settlement account</Link>
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
                 <th>S/N</th>
                 {headerGroup.headers.map((column) => (
                   <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                     {column.render("Header")}
                   </th>
                 ))}
               </tr>
             ))}
           </thead>
           {data.length ? (
             <tbody {...getTableBodyProps()}>
               {page.map((row, index) => {
                 prepareRow(row);
                 return (
                   <tr {...row.getRowProps()}>
                     <td>{index + 1}</td>
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

export default SettlementAccountIndex
