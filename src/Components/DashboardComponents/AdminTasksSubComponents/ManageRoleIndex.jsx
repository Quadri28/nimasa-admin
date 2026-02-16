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
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import { LiaTimesCircle } from "react-icons/lia";


const ManageRoleIndex = () => {
  const [roles, setRoles]= useState([])
const {credentials}=useContext(UserContext)
  const getRoles=()=>{
    axios('/Roles/get-roles', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setRoles(resp.data.data)
    })
  }
  useEffect(()=>{
    getRoles()
  },[])

  const deleteRole=(id)=>{
    const isConfirmed = window.confirm('Are you sure to delete the role?')
    if (isConfirmed) {      
    axios(`Roles/delete-role?roleId=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000})
      getRoles()
  })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
  }
    
     const column = [
         { Header: "S/N", accessor: "", Cell:(({cell})=>{
          const sn= cell.row.index
          return <span>{sn +1}</span>
         }) },
         { Header: "Role name", accessor: "roleName" },
         { Header: "Role Description", accessor: "roleDescription" },
         { Header:'Actions', accessor:'', Cell:(({cell})=>{
          const id= cell.row.original.roleId
             return <div className="d-flex gap-4 align-items-center">
               <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Delete</span>
                 <RiDeleteBin6Line className="action-icons" onClick={()=>deleteRole(id)}/>
                  </div>
                  <div style={{ position: "relative" }} className="status-icon">
                  <span className="stat">Edit</span>
                <Link to={`edit-role/${id}`} style={{color:'#333'}}> <MdOutlineEdit className="action-icons" /></Link>
             </div>
             </div>
         })}
        
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
     <div className="d-flex justify-content-between align-items-center mb-3">
       <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Manage role</h4>
       <Link to='add-new-role'  className='border-0 member btn-md rounded-5 px-3' style={{textDecoration:'none'}}>
            Add new role</Link>
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
           {roles.length && (
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
          
           <button
             onClick={() => gotoPage(0)}
             className="px-2 py-1 rounded-3 border-0 pagination-btn"
             disabled={!canPreviousPage}
           >
             {"<<"}
           </button>
           <button disabled={!canPreviousPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
             {" "}
             <FaAngleLeft onClick={() => previousPage()} />{" "}
           </button>
            <span>
             Page {""}
             <strong>
               {pageIndex + 1} of {pageOptions.length}
             </strong>
           </span>
           <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
             <FaAngleRight onClick={() => nextPage()} />
           </button>
           <button
             onClick={() => gotoPage(pageCount - 1)}
             className="px-2 py-1 rounded-3 border-0 pagination-btn"
             disabled={!canNextPage}
           >
             {">>"}
           </button>
         </div>: <div className="d-flex justify-content-center">No data yet...</div> }
     </div>
     <ToastContainer/>
     </div>
   )
 }

export default ManageRoleIndex
