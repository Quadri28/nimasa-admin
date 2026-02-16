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
import { BsArrowRepeat } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import {LiaTimesCircle} from 'react-icons/lia'

const ManageUsers = () => {
  const [data, setData] = useState([])
  const {credentials}= useContext(UserContext)

    const getUsers=()=>{
      axios('Users', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setData(resp.data.data))
    }
    useEffect(()=>{
      getUsers()
    },[])
    const column = [
        { Header: "User ID", accessor: "userId" },
        { Header: "Full Name", accessor: "fullName" },
        { Header: "Role", accessor: "role_name" },
        { Header: "Branch", accessor: "branchName" },
        { Header: "Phone Number", accessor: "phoneno" },
        { Header: 'Status', accessor:'status', Cell: ({ cell: { value } })=>{
            if (value === 'Active') {
            return <div className="active-status px-2" > <hr />{value}</div>
            }else{
                return <div className="suspended-status px-2" > <hr />{value}</div>
            }
        }},
        { Header:'Actions', accessor:'', Cell:(({cell})=>{
            const id = cell.row.original.uniqueID
            return <div className="d-flex gap-3 align-items-center">
               <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Reset</span>
                <Link to={`reset-user/${id}`} style={{color:'#1d1d1d'}}><BsArrowRepeat/> </Link>
                </div>
                <div style={{ position: "relative" }} className="status-icon">
                <span className="stat">Edit</span>
                <Link to={`edit-user/${id}`} style={{color:'#1d1d1d'}}> <MdOutlineEdit/></Link>
                </div>
            </div>
        })}
       
      ];
    
      const columns = useMemo(() => column, []);
    
      const tableInstance = useTable(
        {
          columns: columns,
          data: data,
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
      <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Manage users</h4>
      <Link to='add-user' className='border-0 btn-md member rounded-5 px-3' style={{textDecoration:'none'}}>Add new user</Link>
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
          {data.length &&
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
            </tbody> }
        </table>
        {data.length ? 
        <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
        
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
        </div> : (
          <div className="d-flex justify-content-center flex-column">
                        <LiaTimesCircle className='mx-auto' size={30}/>
                        <p className="text-center">No record yet</p>
                        </div>
        )}
    </div>
    </div>
  )
}

export default ManageUsers
