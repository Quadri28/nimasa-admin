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
import { LiaTimesCircle } from "react-icons/lia";

const PostCoopSettlement = () => {
  const [roles, setRoles]= useState([])
  const {credentials}=useContext(UserContext)
    const getRoles=()=>{
      axios('Admin/list-post-cooperative-settlement', {headers:{
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
           { Header: "Cooperative name", accessor: "roleName" },
           { Header: "Member(s) Count", accessor: "roleDescription" },
           { Header: "Total outstanding amount", accessor: "amount" },
           { Header: "Total next due", accessor: "due" },
           { Header:'Nex due date', accessor:'', }
          
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
         <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Post Cooperative Settlement</h4>
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
             {roles.length > 0 && (
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
             )}
           </table>
           {roles.length ? <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
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
           </div>:
            <div className="d-flex justify-content-center flex-column">
              <LiaTimesCircle className='mx-auto' size={30}/>
              <p className="text-center">No record yet</p>
              </div>}
       </div>
       </div>
     )
}

export default PostCoopSettlement
