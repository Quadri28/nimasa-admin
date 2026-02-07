import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
  import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const ViewLoanApplications = () => {
  const [choice, setChoice] = useState(null);
  const [applications, setApplications]= useState([])
const [applicationNo, setApplicationNo] = useState('')
const [endpoint, setEndpoint]= useState('')
const [endDate, setEndDate] = useState('')
const [startDate, setStartDate] = useState('')
const {credentials} = useContext(UserContext)
 
  
  const getApplications=()=>{
    if (applicationNo) {
        setEndpoint(`LoanApplication/get-loan-applications?LoanApplicationNo=${applicationNo}`)
      } else{
        setEndpoint(`LoanApplication/get-loan-applications?StartDate=${startDate}&EndDate=${endDate}`)
      }
    axios(endpoint, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    if (resp.data.data) {
    setApplications(resp.data.data)
    }
})}

const rejectApplication=(id)=>{
    const payload={
        applicationNo: id
    }
    axios.post('LoanApplication/loan-application-reject', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true}))
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
useEffect(()=>{
getApplications()
},[applicationNo, startDate, endDate])

const columns = React.useMemo(
    () => [
      {
        Header: "Application No",
        accessor: "applicationNo",
      },
      {
        Header: "Customer ID",
        accessor: "customerId",
      },
      {
        Header: "Full Name",
        accessor: "fullName",

      },
      {
        Header: "Loan Product",
        accessor: "loanProduct",
      },
      {
        Header: "Start Date",
        accessor: "startDate",
        Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')}</span>
        })
      },
      {
        Header: "Maturity Date",
        accessor: "maturityDate",
        Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')}</span>
        })
      },
      {
        Header: "Tenor",
        accessor: "tenor",
      },
      {
        Header: "Officer Requesting",
        accessor: "officerRequesting",
      },
      {
        Header: "Loan Purpose",
        accessor: "loanPurpose",
      },
      {
        Header: "Reject Application",
        accessor: "reject",
        Cell:(({cell})=>{
            const id= cell.row.original.applicationNo
            return <button className="btn btn-danger" style={{fontSize:'14px'}} 
            onClick={()=>rejectApplication(id)}>Reject</button>
        })
      },
      {
        Header: "Create Acct",
        accessor: "",
        Cell:(({cell})=>{
            const id= cell.row.original.applicationNo
return <Link className="btn btn-success btn-sm" to={`view-application/${id}`} style={{fontSize:'12px'}}>
  Create Account</Link>
        })
      },
  
    ],
    []
  );
const tableInstance = useTable(
    {
      columns: columns,
      data: applications
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
  const { pageIndex } = state;
  
  return (
    <div className="card p-3 border-0 rounded-4">
      <div>
        <span className="active-selector">View Loan Application</span>
      </div>
      <div className="rounded-4 mt-4" style={{ border: "solid 1px #f7f4f7" }}>
        <div
          className="py-3 px-4 form-header "
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <span>View loan application</span>
          </div>
      <>
          <div className="admin-task-forms g-2 my-4 px-3">
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="choice">Select Format</label>
            <select
              name="choice"
              onChange={(e) => setChoice(e.target.value)}
            >
              <option value="">Select</option>
              <option value="date">Date</option>
              <option value="applicationNo">Application No</option>
            </select>
          </div>
          <div className="d-flex flex-column">
              <label htmlFor="">Application No</label>
              <input
                type="text"
                name={applicationNo}
                disabled={choice === "date"}
                onChange={(e)=>setApplicationNo(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="choice">Start Date</label>
              <input
                type="date"
                disabled={choice === "applicationNo"}
                name={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="choice">End Date</label>
              <input
                type="date"
                name={endDate}
                disabled={choice === "applicationNo"}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
        <button className="btn btn-md member" onClick={()=>getApplications()}>Search</button>
          </div>
      </>

      <>
      <div className="mt-4 px-3">
        <form className="search-anything my-2 w-100">
          <input
            type="text"
            title="search"
            // value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search anything"
            className="p-2 search-inputs w-50 rounded-3"
            style={{border:'solid 1px #ddd'}}
          />
        </form>
        <div className="table-responsive mt-3">
        <table {...getTableProps()} id="customers" className="table" style={{fontSize:'13px'}}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {applications.length ? <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
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
      </div> : <div className="d-flex justify-content-center">No data yet...</div> }
      </div>
      <ToastContainer/>
      </>
    </div>
    </div>
    
  );
};

export default ViewLoanApplications;
