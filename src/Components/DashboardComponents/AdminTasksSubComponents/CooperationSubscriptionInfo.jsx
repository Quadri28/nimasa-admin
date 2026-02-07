import React,{useMemo} from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const CooperationSubscriptionInfo = () => {
  const data =[
    {   id:'23-DE-RT-12' ,
        name:'Maresk Hamzik',
        transactionId:'12,426',
        description:'12,426',
        amount:'32%',
        latestActivityDate:'12/2/2023',
        accountBalance:'12,426',
    },
    {   id:'23-DE-RT-12' ,
        name:'Maresk Hamzik',
        transactionId:'12,426',
        description:'12,426',
        amount:'32%',
        latestActivityDate:'12/2/2023',
        accountBalance:'12,426',
    },
    {   id:'23-DE-RT-12' ,
        name:'Maresk Hamzik',
        transactionId:'12,426',
        description:'12,426',
        amount:'32%',
        latestActivityDate:'12/2/2023',
        accountBalance:'12,426',
    },
    {   
      id:'23-DE-RT-12' ,
      name:'Maresk Hamzik',
      transactionId:'12,426',
      description:'12,426',
      amount:'32%',
      latestActivityDate:'12/2/2023',
      accountBalance:'12,426',
    },
    {
      id:'23-DE-RT-12' ,
      name:'Demilade Awoyomi',
      transactionId:'12,426',
      description:'12,426',
      amount:'32%',
      latestActivityDate:'12/2/2023',
      accountBalance:'12,426',
  },
]

const column=[
    {Header: 'Member ID', accessor:'id'},
    {Header: 'Account Name', accessor: 'name'},
    {Header: 'Transaction ID', accessor:'transactionId'},
    {Header: 'Description', accessor: 'description'},
   {Header: 'Amount', accessor: 'amount'},
    {Header: 'Latest Activity Date', accessor: 'latestActivityDate'},
   {Header: 'Account Balance', accessor: 'accountBalance'}
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
  <div className="my-2">
    <span className='active-selector'>Member's Report</span>
  </div>
  <div className="d-sm-flex gap-3 my-3 member-card-container">
    <div className="card px-3 py-1 ">
      <span>Total Members</span>
      <h4>12,426</h4>
    </div>
    <div className="card px-3 py-1">
      <span>New Members</span>
      <h4>12,426</h4>
    </div>
    <div className="card px-3 py-1">
      <span>Former Members</span>
      <h4>12,426</h4>
    </div>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>: <tbody> No data entry yet</tbody>}
      </table>
      <div className="d-flex justify-content-center gap-2 mt-2 align-items-center">
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
export default CooperationSubscriptionInfo
