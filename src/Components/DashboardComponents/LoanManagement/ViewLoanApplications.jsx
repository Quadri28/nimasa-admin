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
import Table from "../CommunicationSubComponents/Table";

const ViewLoanApplications = () => {
  const [choice, setChoice] = useState(null);
  const [applications, setApplications]= useState([])
const [applicationNo, setApplicationNo] = useState('')
const [pageSize, setPageSize] = useState(10)
const [pageNumber, setPageNumber] = useState(0)
const [endpoint, setEndpoint]= useState('')
const [endDate, setEndDate] = useState('')
const [startDate, setStartDate] = useState('')
const fetchIdRef = React.useRef(0);
  const [pageCount, setPageCount] = useState(0);
const [loading, setLoading] = useState(false)
const {credentials} = useContext(UserContext)
 
const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(
            `LoanApplication/paginated-loan-applications?StartDate=${startDate}&EndDate=${endDate}&Search=${encodeURIComponent(search)}&PageSize=${pageSize}&PageNumber=${
              pageNumber + 1
            }`,            
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setApplications(resp.data.data.modelResult);
              setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
            }
          });
        setLoading(false);
      }
    });
  }, []);

 useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: applicationNo });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [applicationNo, pageNumber, pageSize, fetchData]);


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

  
  return (
    <div className="card p-3 border-0 rounded-4">
      <div>
        <span className="active-selector">View Loan Application</span>
      </div>
      <div className="rounded-4 mt-4" style={{ border: "solid 1px #f7f4f7" }}>
        <div
          className="py-3 px-4 form-header "
          style={{ backgroundColor: "var(--memcos-blue)", borderRadius: "15px 15px 0 0" }}
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
          </div>
      </>

      <>
      <div className="mt-4 px-3">
       <Table
          fetchData={fetchData}
          pageCount={pageCount}
          data={applications}
          loading={loading}
          columns={columns}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={applicationNo}
          setSearchQuery={setApplicationNo}
        />
        </div>
      <ToastContainer/>
      </>
    </div>
    </div>
    
  );
};

export default ViewLoanApplications;
