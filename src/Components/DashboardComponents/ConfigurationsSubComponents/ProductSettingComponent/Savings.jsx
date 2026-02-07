import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import "./Table.css";
import GlobalFilter from "../GlobalFilter";
import { CiEdit } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {FaAngleRight, FaAngleLeft} from 'react-icons/fa'
import {LiaTimesCircle} from 'react-icons/lia'
import { Link } from "react-router-dom";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";


const Savings = () => {
  const [savings, setSavings]= useState([])
  const {credentials} = useContext(UserContext)
  const fetchSavings = ()=>{
    axios('SavingProduct/get-saving-products', {headers:{
       Authorization:`Bearer ${credentials?.token}`
     }})
     .then((resp)=>setSavings(resp.data.data))
   }

  useEffect(()=>{
    fetchSavings()
  }, [])

    const column = [
        { Header: "Product Code", accessor: "productCode" },
        { Header: "Product Name", accessor: "productName" },
        { Header: "Product Class", accessor: "productClass", Cell:()=>{
          return (
            <span>Savings</span>
          )
        } },
        { Header: "Actions", accessor: "actions",
        Cell: (props)=>{
          const savingCode = props.row.original.productCode;
          return ( 
        <div className="d-flex gap-3">
          <div style={{ position: "relative" }} className="status-icon">
          <span className="stat">View</span>
        <Link to={`view-savings/${savingCode}`} className="text-dark">
        <MdOutlineRemoveRedEye style={{cursor:'pointer'}}/> 
        </Link>
        </div>
        <div style={{ position: "relative" }} className="status-icon">
               <span className="stat">Edit</span>
        <Link to={`edit-savings/${savingCode}`} className="text-dark">
        <CiEdit style={{cursor:'pointer'}}/>
        </Link>
        </div>
      </div>
      )}
      }
      ];
      const columns = useMemo(() => column, []);
    
      const tableInstance = useTable(
        {
          columns: columns,
          data: savings,
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
        pageCount
      } = tableInstance;
      const { globalFilter, pageIndex } = state;
      return (
        <>
        <div className="d-flex justify-content-end">
        <Link to='add-new-saving' className="btn-md px-3 member border-0"
          style={{textDecoration:'none'}}>Add new</Link>
          </div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <div className="table-responsive mt-3">
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
           {savings.length > 0 && 
           <tbody {...getTableBodyProps()}>
              {page.map((row) => {
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
            </tbody> }
          </table>
           {savings.length < 1 &&<div className="d-flex justify-content-center flex-column">
              <LiaTimesCircle className='mx-auto' size={30}/>
              <p className="text-center">No record yet</p>
              </div>}
          </div>
          {savings.length > 0 && 
          <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
            <button onClick={()=>gotoPage(0)} className="px-2 py-1 rounded-3 border-0 pagination-btn"
            disabled={!canPreviousPage}>{'<<'}</button>
           <button disabled={!canPreviousPage} 
           className="px-2 py-1 rounded-3 border-0 pagination-btn"> <FaAngleLeft onClick={()=>previousPage()}/> </button>
           <span>
                Page {''}
                <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
           <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"><FaAngleRight onClick={()=>nextPage()}/></button>
           <button onClick={()=>gotoPage(pageCount -1)} className="px-2 py-1 rounded-3 border-0 pagination-btn" disabled={!canNextPage}>{'>>'}</button>
           </div>}
        </>
      );
    };

export default Savings
