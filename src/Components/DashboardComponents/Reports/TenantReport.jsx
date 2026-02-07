import React, { useContext, useEffect, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import MemberStrength from './TenantReports/MemberStrength'
import ContactList from './TenantReports/ContactList'
import ExpiredSubCooperative from './TenantReports/ExpiredSubCooperative'
import ExpiringInSixty from './TenantReports/ExpiringInSixty'
import OutStandingPartialPayment from './TenantReports/OutStandingPartialPayment'
import BlockedCooperatives from './TenantReports/BlockedCooperatives'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const TenantReport = () => {
    const [types, setTypes]= useState([])
    const [type, setType]= useState('')
    const{credentials}= useContext(UserContext)
    const [reports, setReports]= useState([])
    const [selected, setSelected] = useState('')

    const getTypes=()=>{
        axios('Reports/tenant-report-types',{headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setTypes(resp.data))
    }

    useEffect(()=>{
        getTypes()
    },[])
    const getReports=()=>{
        axios(`Reports/tenant-report?ReportType=${type}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
            if (resp.data.data.cooperativeMemberStrengths) {
            setSelected('strength')
            setReports(resp.data.data.cooperativeMemberStrengths)   
            }
            if (resp.data.data.cooperativeContactLists) {
                setSelected('contact-list')
                setReports(resp.data.data.cooperativeContactLists)   
                }
                if (resp.data.data.cooperativeSubscriptionExpired) {
                    setSelected('sub-expired')
                    setReports(resp.data.data.cooperativeSubscriptionExpired)   
                    }
                    if (resp.data.data.cooperativeSubscriptionExpiring) {
                        setSelected('expiring')
                        setReports(resp.data.data.cooperativeSubscriptionExpiring)   
                        }
                        if (resp.data.data.cooperativeOutstandingPartial) {
                            setSelected('outstanding')
                            setReports(resp.data.data.cooperativeOutstandingPartial)   
                            }
                            if (resp.data.data.cooperativeBlocked) {
                                setSelected('blocked')
                                setReports(resp.data.data.cooperativeBlocked)   
                                }
        })
    }
    useEffect(()=>{
        getReports()
    },[type])
const getComponent=()=>{
    if (selected === 'strength') {
       return <MemberStrength reports={reports}/>
    }else if (selected === 'contact-list') {
        return <ContactList reports={reports}/>
    }else if (selected === 'sub-expired') {
        return <ExpiredSubCooperative reports={reports}/>
    }else if (selected === 'expiring') {
        return <ExpiringInSixty reports={reports}/>
    }else if (selected === 'outstanding') {
      return  <OutStandingPartialPayment reports={reports}/>
    }else if (selected === 'blocked') {
        return <BlockedCooperatives reports={reports}/>
    }
}
const navigate = useNavigate()
  return (
    <>
       <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Tenant Report</h4>
       <div className="rounded-4 mt-3" style={{border:'solid 1px #f7f4f7'}}>
        <div
      className="py-3 px-4 form-header "
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Tenant report
      </div>
      </div>
    <div className="admin-task-forms px-3 mb-3">
        <div className='d-flex flex-column gap-1'>
            <label htmlFor="reportType">Report type:</label>
            <select type="text"   onChange={(e)=>setType(e.target.value)}>
            <option value="">Select type</option>
            {
                types.map((type)=>(
                    <option value={type.value} key={type.value}>{type.name}</option>
                ))
            }
            </select>
        </div>
        </div>
        <div className="px-3">
      {
        getComponent()
      }
      </div>
      </div>
    </>
  )
}

export default TenantReport
