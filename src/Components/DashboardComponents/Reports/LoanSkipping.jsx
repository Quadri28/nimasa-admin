import React,{useMemo, useState, useContext, useEffect} from 'react'
import {useTable,useSortBy,useGlobalFilter,usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import '../ConfigurationsSubComponents/Table.css'
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { CSVLink } from 'react-csv';
import { LiaTimesCircle } from 'react-icons/lia';

const LoanSkipping = () => {
    const {credentials} = useContext(UserContext)
const [reports, setReports] = useState([])
const getReports =()=>{
    axios('Reports/loan-skipping-details', {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.loanSkippingReports) {
        setReports(resp.data.data.loanSkippingReports)
      }
    })
}
useEffect(()=>{
    getReports()
}, [])
    const column=[
        {Header: 'Customer Name', accessor:'customerName'},
        {Header: 'Settlement Account', accessor:'settlementAcount'},
        {Header: 'Account Number', accessor:'accountNumber'},
        {Header: 'Loan Amount', accessor: 'loanAmount', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header: 'Loan Rate', accessor:'loanRate'},
        {Header: 'Product Name', accessor:'productName'},
        {Header: 'Skipped Date From', accessor:'skippedDateFrom', 
        Cell:(({value})=>(
            <span>{new Date(value).toLocaleDateString('en-Us')}</span>
        ))
        },
        {Header: 'Skipped Date To', accessor:'skippedDateTo', 
            Cell:(({value})=>(
                <span>{new Date(value).toLocaleDateString('en-Us')}</span>
            ))
        },
        {Header: 'Term', accessor: 'term'}
    ]

    const columns = useMemo(() => column, []);

    const tableInstance = useTable(
        {
          columns: columns,
          data: reports,
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
    <div className='bg-white px-3 py-4 mt-3 rounded-4'>
      {reports.length > 0 &&
    <>
    <div className='d-sm-flex justify-content-between align-items-center my-3'>
      <form className='search-anything my-2'>
        <input type="text" name='search' value={globalFilter || ''} 
      onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Search anything'
       className='p-2 search-inputs w-100 rounded-3' style={{border:'solid 1px #f2f2f2', backgroundColor:'#f2f2f2'}}/>
      </form>
      <CSVLink data={reports} filename={"loanSkippingReports.csv"}>
      <button className='btn btn-md text-white fz-6 px-4 rounded-5' style={{backgroundColor:'var(--custom-color)'}}>
        Export</button>
        </CSVLink>
    </div> </> }
  
     <div className='table-responsive w-100'>
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

            {reports.length > 0 &&
             <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, ) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody> }
          </table>
          {reports.length > 0 ? 
          <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
            <span>
                page {''}
                <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
            <button onClick={()=>gotoPage(0)} className="px-2 py-1 rounded-3 border-0 pagination-btn" disabled={!canPreviousPage}>{'<<'}</button>
           <button disabled={!canPreviousPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"> <FaAngleLeft onClick={()=>previousPage()}/> </button>
           <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"><FaAngleRight onClick={()=>nextPage()}/></button>
           <button onClick={()=>gotoPage(pageCount -1)} className="px-2 py-1 rounded-3 border-0 pagination-btn" disabled={!canNextPage}>{'>>'}</button>
           </div> : <div className="d-flex justify-content-center flex-column">
                         <LiaTimesCircle className='mx-auto' size={30}/>
                         <p className="text-center">No record yet</p>
                         </div> }
    </div>
     </div>    

  )
}

export default LoanSkipping
