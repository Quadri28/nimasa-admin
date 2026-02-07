import React, { useContext, useEffect, useMemo, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios'
import { UserContext } from '../AuthContext'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ViewElection = () => {
    const {id}= useParams()
    const [election, setElection]= useState({})
    const [contestants, setContestants]= useState([])
    const navigate = useNavigate()
    const {credentials}= useContext(UserContext)
    
    const getElection=()=>{
        axios(`Election/get-election?id=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          if (resp.data.data) {
          setElection(resp.data.data)
            setContestants(resp.data.data.contestants)
          }
        })
    }
useEffect(()=>{
getElection()
},[])


const column=[
  {Header:'S/N', accessor:'', Cell:(({cell})=>{
    const No= cell.row.index
    return <span>{No + 1}</span>
  })},
  {Header: 'Position', accessor:'positionName'},
  {Header: 'Name of Candidate', accessor:"fullName"},
  {Header: 'Candidate Picture', accessor: 'profileImageBase64', Cell:(({value})=>{
    return <div className="d-flex justify-content-center">
    <img src={`data:image/png;base64, ${value}`} alt="candidate's image" style={{borderRadius:'1rem', height:'100px'}}/>
    </div>
  })},
  {Header: 'Approval Status', accessor:'approvalStatusTest', Cell:(({value})=>{
    return <div className='active-status px-3' style={{width:'fit-content'}}>
      <hr />
    <span >{value}</span>
    </div>
  })},
]

const columns = useMemo(() => column, []);

const tableInstance = useTable(
  {
    columns: columns,
    data: contestants,
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
    <div className="mt-4 bg-white px-3 py-3 rounded-3">
    <div className="mb-4 mt-2">
      <span className="active-selector">View Election Details</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <p style={{ fontWeight: "500", fontSize: "16px" }}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> View Election Details
          </p>
      </div>
      <div className='my-3 px-3'>
    <p><strong>Election title</strong>: {election?.title}</p>
    <p><strong>Election description</strong>: {election?.description}</p>
    <p><strong>Start Date</strong>: {new Date(election?.startDateAndTime).toLocaleDateString('en-US')} {new Date(election?.startDateAndTime).toLocaleTimeString('en-US')}
    </p>
    <p><strong>End Date</strong>: {new Date(election?.endDateAndTime).toLocaleDateString('en-US')} {new Date(election?.endDateAndTime).toLocaleTimeString('en-US')}</p>
    <p><strong>Setup Start Date & Time</strong>: {new Date(election?.setUpStartDateAndTime).toLocaleDateString('en-US')} {new Date(election?.endDateAndTime).toLocaleTimeString('en-US')}</p>
    <p><strong>Setup End Date & Time</strong>: {new Date(election?.setUpEndDateAndTime).toLocaleDateString('en-US')} {new Date(election?.endDateAndTime).toLocaleTimeString('en-US')}</p>
    <strong>Election Guideline</strong>: {''}
    <span onClick={() => window.open(election?.electionGuideLine, "_blank")} style={{cursor:'pointer'}}>
    View File</span>


    <div className="table-responsive w-100 mt-3">
            <table {...getTableProps()} id="customers" className="table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {contestants.length > 0 ?<div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
              <span>
                Page {""}
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
            </div>: <div className="d-flex justify-content-center">No data yet...</div> }
          </div>
      </div>
      </div>
    </div>
  )
}

export default ViewElection
