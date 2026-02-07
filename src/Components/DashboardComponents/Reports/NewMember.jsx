import React, { useContext, useEffect, useMemo, useState } from 'react'
import UnpaginatedTable from './UnpaginatedTable'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'

const NewMember = () => {
  const [startDate, setStartDate]= useState('')
  const [endDate, setEndDate]= useState('')
  const [reports, setReports] = useState([])
  const {credentials} = useContext(UserContext)

  const getReport=()=>{
      axios(`Reports/new-member-report?TransactionDateFrom=${startDate}&TransactionDateTo=${endDate}`, {headers:{
          Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
          if (resp.data.data.newMemberReport) {
          setReports(resp.data.data.newMemberReport)
          }
  })
  }
  useEffect(()=>{
      getReport()
    },[ endDate,startDate])

    const column=[
      {Header: 'Customer ID', accessor:'customerId'},
      {Header: 'Full Name', accessor:'fullName'},
      {Header: 'Gender', accessor:'gender'},
      {Header: 'Phone No', accessor:'phoneNumber'},
      {Header: 'Monthly Contribution', accessor:'monthlyContribution', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
      {Header: 'Date Opened', accessor:'dateOpened'},
      {Header: 'Created by', accessor:'createdBy'},
  ]

const columns = useMemo(() => column, []);

return (
  <div className='card py-4 px-3 mt-3 rounded-4'>
    <div className='admin-task-forms'>
    <div className="d-flex flex-column gap-1">
        <label htmlFor="startDate">
          Start Date<sup className="text-danger">*</sup>
        </label>
        <input
          type="date"
          name={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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
        />
      </div>
    </div>
    <div className='px-1 mt-2'>
    <UnpaginatedTable
      data={reports}
      columns={columns}
      filename="NewMember.csv"
    />
  </div>
  {
    reports.length > 0 ? `Count: ${reports.length}` : ''
  }
  </div>
)
}


export default NewMember
