import React,{useContext, useEffect, useMemo, useRef, useState} from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import {GrEdit } from 'react-icons/gr'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from '../../axios';
import ErrorText from '../ErrorText';
import { CSVLink } from 'react-csv';
import { UserContext } from '../../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { Circles } from 'react-loader-spinner';

const MemberDeduction = () => {
  const {credentials} = useContext(UserContext)
  const [batchNo, setBatchNo] = useState('')
  const [period, setPeriod] = useState('')
  const [deductions, setDeductions]= useState([])
  const [loading, setLoading] = useState(false)
  const [dloading, setDLoading] = useState(false)
  const initialValues ={

  }
  const validationSchema = Yup.object({

  })
  const onSubmit=(values)=>{
    console.log(values)
  }
 

  //Fetch Batch number
  const getBatchNo=()=>{
    axios('MemberManagement/get-batch-no', {
      headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setBatchNo(resp.data.message))
  }
  useEffect(()=>{
    getBatchNo()
  }, [])

// Fetching Deductions
const getDeduction = async ()=>{
  await axios(`MemberManagement/deduction-download?Period=${period}&BatchNumber=${batchNo}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
   if (resp.data.data) {
    setDeductions(resp?.data.data)
   }
  })
}

 useEffect(()=>{
  getDeduction()
 }, [period])

  // // Submitting form to get deductions
  // const submitDeductions=(e)=>{
  //   e.preventDefault();
  //   setLoading(true)
  //   const payload={
  //     Period: period,
  //     BatchNumber: batchNo
  //   }
  //   axios.post('MemberManagement/deduction-download', payload, {headers:{
  //     Authorization: `Bearer ${credentials.token}`
  //   }}
  //   ).then(resp=>{
  //     setLoading(false)
  //     toast(resp.message, {type:'success', autoClose:5000, pauseOnHover:true})
  //   }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  // }

  const confirmDownload=(e)=>{
    e.preventDefault()
    const payload={
      batchNumber: batchNo
    }
    axios.post('MemberManagement/deduction-download-confirmation', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp)=>toast(resp.data.message, 
      {type:'success', autoClose:5000, pauseOnHover:true}))
    .catch(error=>toast(error.response.data.message, 
      {type:'error', pauseOnHover:true, autoClose:5000}))
  }

  const downloadDeduction=()=>{
    setDLoading(true)
    if (!period) {
     alert('Pls select a period for the deduction to be downloaded') 
     setDLoading(false)
     return;
    }
    axios(`MemberManagement/deduction-download-export?Period=${period}&BatchNumber=${batchNo}`, 
    {responseType: "blob",
    headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((blob) => {
    setDLoading(false)
    const url = window.URL.createObjectURL(new Blob([blob.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deductionDownload.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
  }).catch(error=>{
    setDLoading(false)
  })
  }

  const downloadDeductionBreakdown=()=>{
    setLoading(true)
    if (!period) {
     alert('Pls select a period for the deduction to be downloaded') 
     setLoading(false)
     return;
    }
    axios(`MemberManagement/export-deduction-download-breakdown?Period=${period}`, 
    {responseType: "blob",
    headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((blob) => {
    setLoading(false)
    const url = window.URL.createObjectURL(new Blob([blob.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deductionDownloadBreakdown.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
  }).catch(error=>{
    setLoading(false)
    console.log(error)
      const errors = error.response?.errors || [];
      errors.forEach((err) => {
        toast.error(err.message, {
          autoClose: 5000,
          pauseOnHover: true,
        });
      });
  });
  }
  
 
  const column = [
    { Header: "Employee ID", accessor: "employeeId" },
    { Header: "SurName", accessor: "surname" },
    { Header: "Employee First Name", accessor: "first_Name" },
    { Header: "Period", accessor: "period" },
    { Header: "Normal Deduction", accessor: "normal_Contribution", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Loan Deduction", accessor: "loan_Repayment" },
    { Header: "Project Finance", accessor: "project_Finance" },
    { Header: "Total Amount", accessor: "total_Amt", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Approved Amount", accessor: "approved_Total_Amt" },
    // { Header: "Approval Note", accessor: "approval_Note" },
    { Header: "Batch ID", accessor: "batch" },
    { Header: "Company", accessor: "company" },
    { Header: "Customer ID", accessor: "customerId" },
  ]

  const columns = useMemo(() => column, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: deductions
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
    <>
    <div>
      <div className="d-flex justify-content-between mt-1 flex-wrap">
    <h6> Member Deduction </h6>
    <div className="d-flex gap-3 align-items-center">
       <button className='btn member' style={{backgroundColor:'#E6F0FF', padding:'10px 15px',
          color:'var(--custom-color)', fontSize:'12px'}}
        onClick={()=>{ downloadDeduction() }}>
         {!dloading ? 'Download deductions' : 'Downloading...'} </button>
         <button className='btn member' style={{backgroundColor:'#E6F0FF', padding:'10px 15px',
          color:'var(--custom-color)', fontSize:'12px'}}
        onClick={()=>{ downloadDeductionBreakdown() }}>
         {!loading  ? 'Download schedule breakdown' : 'Downloading...' }</button>
    </div>
    </div>
        <form>
          <div className="admin-task-forms mb-2">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="period">Period<sup className='text-danger'>*</sup>:</label>
          <input type="date" name='period'
           onChange={(e)=>setPeriod(e.target.value)}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="batchNumber">Batch Number:</label>
          <input  name='batchNumber' readOnly value={batchNo}/>
          </div>
          </div>
        </form>
    </div>
      <div>
      {deductions?.length > 0 &&
      <form className="search-form mb-4">
        <input
          type="text"
          placeholder="Search anything"
          className="w-100 "
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </form>}
      <div className="table-responsive" >
        <table {...getTableProps()} id='deductions' className="table">
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
           {deductions.length > 0 && <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
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
        {deductions.length > 0 ?
         <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
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
        </div> : <p className="text-center">No data entry yet</p> } 
      </div>
      <form onSubmit={confirmDownload} className='d-flex justify-content-end'>
        <button className='btn member'
         onClick={()=>confirmDownload} type='submit' 
      >Complete validation</button>
       </form>
      </div>
      
      
      <div
        className="modal fade"
        id="member"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog mt-4 py-4" role="document">
          <div className="modal-content">
            <div className="px-3 mt-3">
              <h6 className="modal-title text-center" id="exampleModalLabel">
                Add new member
              </h6>
            </div>
            <Formik 
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={onSubmit}>
            <Form className="p-4">
          //
             <div className="d-sm-flex justify-content-end gap-4 mt-4">
              <button className="btn btn-md" style={{backgroundColor:'#ddf'}} type="reset">Discard</button>
              <button className="btn btn-md add-new-btn" type="submit">Save</button>
             </div>
            </Form>
            </Formik>
        </div>
        </div>
        </div>
        <ToastContainer/>
    </>
  )
}

export default MemberDeduction
