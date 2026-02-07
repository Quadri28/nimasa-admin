import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import UnpaginatedTable from './UnpaginatedTable'

const MemberRequestReport = () => {
    const[type, setType] = useState(null)
    const[status, setStatus] = useState('')
    const [statuses, setStatuses] = useState([])
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState([])
    const {credentials} = useContext(UserContext)
    const getStatuses=()=>{
        axios(`Reports/get-member-request-type-status?MemberRequestReportType=${type}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setStatuses(resp.data.data))
    }
    useEffect(()=>{
        getStatuses()
    },[type])

const getReports=()=>{
    axios(`Reports/member-request-report?MemberRequestReportType=${type}&Status=${status}&TransactionDateFrom=${startDate}&TransactionDateTo=${endDate}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.requestReport) {
      setReports(resp.data.data.requestReport)
        
      }
    })
}
useEffect(()=>{
getReports()
},[type, startDate, endDate, status])

const column=[
    {Header: 'Application No', accessor:'applicationNumber'},
    {Header: 'Member ID', accessor:'memberID'},
    {Header: 'Full Name', accessor:'fullName'},
    {Header: 'Product', accessor: 'product'},
    {Header: 'Loan Amount', accessor:'loanAmount', Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    {Header: 'Request Date', accessor:'requestDate', Cell:({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-us')} {new Date(value).toLocaleTimeString('en-us')}</span>
    }},
    {Header: 'Loan Purpose', accessor:'loanPurpose'},
    {Header: 'Status', accessor:'status'},
    {Header: 'Bank', accessor: 'bank'},
    {Header: 'Acct Name', accessor: 'accountName'},
    {Header: 'Bank Acct No', accessor:'bankAccountNumber'},
    
]

const column1=[
    {Header: 'Member ID', accessor:'memberID'},
    {Header: 'Full Name', accessor:'fullName'},
    {Header: 'Product', accessor: 'product'},
    {Header: 'Amount', accessor:'amount', Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    {Header: 'Request Date', accessor:'requestDate', Cell:({value})=>{
      return <span>{new Date(value).toLocaleDateString('en-us')} {new Date(value).toLocaleTimeString('en-us')}</span>
    }},
    {Header: 'Status', accessor:'status'},
    {Header: 'Bank', accessor: 'bank'},
    {Header: 'Acct Name', accessor: 'accountName'},
    {Header: 'Bank Acct No', accessor:'bankAccountNumber'},
    
]

const columns = useMemo(() => column, []);
const columns1 = useMemo(() => column1, []);
  return (
    <div className='card py-3 px-3 mt-3 rounded-4'>
      <div className="admin-task-forms mb-2">
      <div className="d-flex flex-column gap-1">
          <label htmlFor="type">
            Request type<sup className="text-danger">*</sup>
          </label>
          <select
            name={type}
            id=""
            onChange={(e) => setType(e.target.value)}
            className="p-2 border-0 rounded-3"
          >
            <option value="">Select report type</option>
            <option value={1}>Loan application</option>
            <option value={2}>Withdrawal</option>
            <option value={3}>Retirement</option>
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="status">
            Select Status<sup className="text-danger">*</sup>
          </label>
          <select
            name={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border-0 rounded-3"
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option value={status.statusId} key={status.statusName}>
                {status.statusName}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            End Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
        </div>
    <div style={{fontSize:'14px'}} className='px-1'>
      <UnpaginatedTable
        data={reports}
        columns={type ==1 ? columns : columns1}
        filename="MemberRequestReport.csv"
      />
    </div>
    </div>
  )
}

export default MemberRequestReport
