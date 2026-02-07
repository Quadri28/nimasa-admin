import React,{useMemo} from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { CSVLink } from 'react-csv'
import { usePDF } from 'react-to-pdf'

const SavingAcctSummary = () => {
    const {targetRef, toPDF} = usePDF({filename: 'assets.pdf'})
    const data =[
        {
          id:'23-RT-ED',
          name:'Maresk Hamzik',
            currentBalance:'34,678',
            interest:'32%',
            activity:'25-09-2000',
            openingBalance:'12,426',
            acctBalance:'32,560',
        },
        {
          id:'23-RT-ED',
          name:'Maresk Hamzik',
            currentBalance:'34,678',
            interest:'32%',
            activity:'25-09-2000',
            openingBalance:'12,426',
            acctBalance:'39,009',
        },
        {
          id:'23-RT-ED',
          name:'Maresk Hamzik',
            currentBalance:'34,678',
            interest:'32%',
            activity:'25-09-2000',
            openingBalance:'12,426',
            acctBalance:'10,110',
        },
        {
          id:'23-RT-ED',
          name:'Maresk Hamzik',
            currentBalance:'34,678',
            interest:'32%',
            activity:'25-09-2000',
            openingBalance:'12,426',
            acctBalance:'10,420',
        },
        {
          id:'23-RT-ED',
          name:'Demilade Awoyomi',
          currentBalance:'34,678',
          interest:'32%',
          activity:'25-09-2000',
          openingBalance:'30,426',
          acctBalance:'12,426',
      },
    ]

    const column=[
        {Header: 'Member ID', accessor:'id'},
        {Header: 'Account Name', accessor:'name'},
       {Header: 'Opening Balance', accessor: 'openingBalance'},
       {Header: 'Current Balance', accessor: 'currentBalance'},
        {Header: 'Interest rate', accessor:'interest'},
        {Header: 'Latest Activity Date', accessor: 'activity'},
        {Header: 'Account Balance', accessor: 'acctBalance'},
    ]

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
        pageCount
      } = tableInstance;
      const { globalFilter, pageIndex } = state;
    
  return (
    <>
    <div className='d-sm-flex justify-content-between align-items-center my-3'>
      <form className='search-anything my-2'>
        <input type="text" name='search' value={globalFilter || ''} 
      onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Search anything' className='p-2 search-inputs w-100'/>
      </form>
      <div className='d-flex gap-2 export-btn-container my-2 flex-wrap'>
        <CSVLink data={data} filename='Assets.csv' >
          <button  className='btn btn-md'>Export in csv </button></CSVLink>
        <button className='btn btn-md' onClick={()=>toPDF()}>Export in pdf</button>
      </div>
    </div>
    <div className='table-responsive'>
    <table {...getTableProps()} id="customers" className="table" ref={targetRef}>
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
            {data.length ? <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                        <td>{index + 1}</td>
                    {row.cells.map((cell, ) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>: <tbody> No data entry yet</tbody>}
          </table>
          <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
            <span>
                page {''}
                <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
            <button onClick={()=>gotoPage(0)} className="btn btn-sm" disabled={!canPreviousPage}>{'<<'}</button>
           <button disabled={!canPreviousPage} className="btn btn-sm"> <FaAngleLeft onClick={()=>previousPage()}/> </button>
           <button disabled={!canNextPage} className="btn btn-sm"><FaAngleRight onClick={()=>nextPage()}/></button>
           <button onClick={()=>gotoPage(pageCount -1)} className="btn btn-sm" disabled={!canNextPage}>{'>>'}</button>
           </div>
    </div>
     </>    
    
    )
}

export default SavingAcctSummary
