import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import UnpaginatedTable from './UnpaginatedTable'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const UserReports = () => {
  const [status, setStatus]= useState(null)
  const [reports, setReports]= useState([])
  const {credentials} = useContext(UserContext)
  const getReport=()=>{
    axios(`Reports/user-details-report?LoginStatus=${status}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
            setReports(resp.data.data.userDetailReports || []) 
    }).catch(()=>setReports([]))
  }

  useEffect(()=>{
    if (status) {
    getReport()
    }
  },[status])
  const column=[
    // {Header: 'Login ID', accessor:'loginId'},
    {Header: 'Full Name', accessor:'fullName'},
    {Header: 'Department', accessor:'department'},
    {Header: 'Role', accessor:'role'},
    // {Header: 'Login Status', accessor:'loginStatus'},
    {Header: 'Authorizer Status', accessor:'authoriserStatus'},
    {Header: 'Till Acct', accessor:'tillAccount'},
    {Header: 'Authorizer', accessor:'authoriser'},
    {Header: 'Email Address', accessor:'emailAddress'},
    {Header: 'Phone Number', accessor:'phoneNumber'},
]

const columns = useMemo(() => column, []);
const navigate = useNavigate()
  return (
    <>
       <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>User Detail Report</h4>
       <div className="rounded-4 mt-3" style={{border:'solid 1px #f7f4f7'}}>
      <div
      className="py-3 px-4 form-header "
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> User details report
      </div>
      </div>
      <div className="admin-task-forms px-3">
      <div className='d-flex flex-column gap-1'>
        <label htmlFor="status">Login Status:</label>
        <select name={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">Select login status:</option>
          <option value={1}>Logged in</option>
          <option value={2}>Not Logged in</option>
        </select>
      </div>
      </div>
      <div style={{fontSize:'14px'}} className='px-3'>
      <UnpaginatedTable
        data={reports}
        columns={columns}
        filename="UserReports.csv"
      />
    </div>
    </div>
    </>
  )
}

export default UserReports
