import React,{useMemo} from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';


const GlobalUserSetting = () => {
  const data =[
    {
      loanId:'XRE-342-90',
      borrowerName:'John Smith',
      amount:'500,000',
      paymentType:'Transfer',
      repaymentStatus:'Suspended',
      joinDate:'04-July-2000',
    },
    {
      loanId:'XRE-342-90',
      borrowerName:'John Smart',
      amount:'500,000',
      paymentType:'Card',
      repaymentStatus:'Active',
      joinDate:'24-July-2020',
    },
    {
      loanId:'XRE-342-90',
      borrowerName:'Doe Smith',
      amount:'900,000',
      paymentType:'Card',
      repaymentStatus:'Suspended',
      joinDate:'02-July-2020',
    },
    {
      loanId:'XRE-344-90',
      borrowerName:'John Doe',
      amount:'1000,000',
      paymentType:'Transfer',
      repaymentStatus:'Active',
      joinDate:'24-July-2022',
    },
    {
      loanId:'XRE-342-90',
      borrowerName:'John Smith',
      amount:'500,000',
      paymentType:'Card',
      repaymentStatus:'Suspended',
      joinDate:'24-July-2020',
  },
]

const column=[
    {Header: 'Loan ID', accessor:'loanId'},
    {Header: "Borrower's Name", accessor: 'borrowerName'},
    {Header: 'Amount', accessor:'amount'},
    {Header: 'Payment Type', accessor: 'paymentType'},
    {
      Header: 'Repayment Status',
      accessor: 'repaymentStatus',
      Cell: ({cell: {value}})=> {
      if (value === 'Suspended') {
        return <div className='suspended-status w-75'>
         <hr /> <span >{value}</span>
          </div>
      }else if (value === 'Active') {
        return  <div className='active-status w-75'>
         <hr /><span> {value}</span>
         </div>
      }
      }
    },
    {Header: 'Date Joined', accessor: 'joinDate'}
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
<div className='card px-3 py-4'>
  <div className="py-2">
    <span className='active-selector' style={{cursor:'pointer'}}>Loan Summary</span>
  </div>
<div className='d-sm-flex justify-content-between align-items-center my-3'>
  <form className='search-anything my-2'>
    <input type="text" name='search' value={globalFilter || ''} 
  onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Search anything' className='p-2 search-inputs w-100'/>
  </form>
  <div className='d-flex gap-2 export-btn-container my-2 flex-wrap'>
    <button className='btn btn-md'>Export in csv</button>
    <button className='btn btn-md'>Export in pdf</button>
    <button className='btn btn-md'>Assets</button>
  </div>
</div>
<div className='table-responsive'>
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
        {data.length ? <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                    <td>{index + 1}</td>
                {row.cells.map((cell, ) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                 </td>
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
 </div>    

)
}

export default GlobalUserSetting
