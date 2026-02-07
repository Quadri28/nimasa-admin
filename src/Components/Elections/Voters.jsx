import React,{useContext, useEffect, useMemo, useState} from 'react'
import {useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import axios from '../../Components/axios';
import {UserContext} from '../AuthContext'

const Voters = () => {
  const [data, setData]= useState([])
  const {credentials}= useContext(UserContext)
  const getVoters=()=>{
    axios('Election/get-election-voters', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setData(resp.data.data))
  }
    
  useEffect(()=>{
    getVoters()
  }, [])
    const column=[
        {Header:'S/N', accessor:'', Cell:(({cell})=>{
          const No= cell.row.index
          return <span>{No + 1}</span>
        })},
        {Header: 'Member ID', accessor:'memberId'},
        {Header: 'Name of Voter', accessor:"nameOfVoter"},
        {Header: 'Name of candidates voted', accessor: 'nameOfCandidateVotedFor', Cell:(({value})=>{
          return <span>{ value.map(voter=>(voter))} |</span>
        })},
        {Header: 'Date and time voted', accessor:'dateAndTimeVoted'},
    ]
    
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
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount
      } = tableInstance;
      const {  pageIndex } = state;
  return (
    <div className='table-responsive'>
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
            {data.length > 0 &&
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
            </tbody>}
          </table>
          
          {Voters.length > 0 &&<div className="d-flex justify-content-center gap-2 mt-2 align-items-center">
            <span>
                page {''}
                <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
            <button onClick={()=>gotoPage(0)} className="btn btn-sm" disabled={!canPreviousPage}>{'<<'}</button>
           <button disabled={!canPreviousPage} className="btn btn-sm"> <FaAngleLeft onClick={()=>previousPage()}/> </button>
           <button disabled={!canNextPage} className="btn btn-sm"><FaAngleRight onClick={()=>nextPage()}/></button>
           <button onClick={()=>gotoPage(pageCount -1)} className="btn btn-sm" disabled={!canNextPage}>{'>>'}</button>
           </div>}
    </div>
  )
}

export default Voters
