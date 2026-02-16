import React, { useContext, useEffect, useState } from 'react'
import './GeneralOverview.css'
import RevenueChart from './RevenueChart'
import MemberChart from './MemberChart'
import OutstandingSubscriptions from './OutstandingSubscriptions'
import ExpiredSubscriptions from './ExpiredSubscriptions'
import ExpiringSoon from './ExpiringSoon'
import DateComponent from './DateComponent'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'

const GeneralOverview = () => {
    const [active, setActive]= useState('outstanding')
    const [coopDetails, setCoopDetails]= useState({})
    const [memberDetails, setMemberDetails]=useState([])
    const [revenues, setRevenues]=useState([])
  const [activated, setActivated] = useState("");
    const [value, setValue]= useState(null)
    const {credentials}= useContext(UserContext)
    const getComponents=()=>{
        if (active ==='outstanding') {
            return <OutstandingSubscriptions/>
        }else if (active === 'expired') {
            return <ExpiredSubscriptions/>
        }else if (active === 'expiring') {
            return <ExpiringSoon/>
        }
    }

    const getCooperativeDetails=()=>{
        axios(`GlobalAdminDashBoard/global-admin-dashboard-data?filter=${value}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
            setCoopDetails(resp.data.data)
            setMemberDetails(resp.data.data.memberOverview)
            setRevenues(resp.data.data.revenue)
        })
    }
    useEffect(()=>{
        getCooperativeDetails()
    },[value])
  return (
    <>
    <div className='display-container'>
    <div className='d-flex justify-content-between flex-wrap'>
      <span className='container-title'>General Overview</span>
      <DateComponent setValue={setValue} active={activated} setActive={setActivated}/>
    </div>
    </div>
    <div className="bg-white p-4 global-overview-card-container">
        <div className="card p-3">
            <prev className='head'>Active users</prev>
            <span>{coopDetails?.userDataCount?.activeUsers}</span>
        </div>
        <div className="card p-3">
        <prev className='head'>INACTIVE USERS</prev>
        <span>{new Intl.NumberFormat('en-US', {}).format(coopDetails?.userDataCount?.inActiveUsers)}</span>
        </div>
        <div className="card p-3">
        <prev className='head'>BLOCKED USERS</prev>
        <span>{new Intl.NumberFormat('en-US', {}).format(coopDetails?.userDataCount?.blockedUsers)}</span>
        </div>
        <div className="card p-3">
        <prev className='head'>NEW USERS</prev>
        <span>{new Intl.NumberFormat('en-US', {}).format(coopDetails?.userDataCount?.newUsers)}</span>
        </div>
        <div className="card p-3">
        <prev className='head'>EXPIRED SUBSCRIPTIONS</prev>
        <span>{new Intl.NumberFormat('en-US', {}).format(coopDetails?.expiredSubscription)}</span>
        </div>
        <div className="card p-3">
        <prev className='head'>OUTSTANDING SUBSCRIPTIONS</prev>
        <span>{new Intl.NumberFormat('en-US', {}).format(coopDetails?.outstandingSubscription)}</span>
        </div>
        <div className="card p-3">
            <prev className='head'>REVENUE</prev>
        <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(coopDetails?.totalRevenue)}</span>
        </div>
    </div>
    <div className="global-charts-container py-4">
        <div>
        <div className="display-container">
            <div className="d-sm-flex justify-content-between align-items-center">
            <span className='container-title'>Revenue</span>
                 <DateComponent setValue={setValue} active={activated} setActive={setActivated}/>
            </div>
        </div>
        <div className="bg-white p-4"  style={{borderRadius:'0 0 10px 10px'}}>
            <RevenueChart revenues={revenues}/>
        </div>
        </div>
        <div>
        <div className="display-container">
        <div className="d-sm-flex justify-content-between gap-3">
        <span className='container-title'> Member Overview</span>
        <DateComponent setValue={setValue} active={activated} setActive={setActivated}/>
        </div>
        </div>
        <div className="bg-white member-chart" style={{borderRadius:'0 0 10px 10px'}}>
            <MemberChart memberDetails={memberDetails}/>
        </div>
    </div>
    </div>
    <div className='display-container'>
    <div className='d-flex justify-content-between align-items-center flex-wrap'>
      <span className='container-title'>Subscriptions Overview</span>
      <DateComponent setValue={setValue} active={activated} setActive={setActivated}/>
    </div>
    </div>
    <div className="bg-white p-3" style={{borderRadius:'0 0 10px 10px'}}>
        <div className="d-flex gap-5 navigation-links flex-wrap" >
        <span className={active === 'outstanding'? 'active-navigator' : 'in-active-navigator'}
          onClick={()=>setActive('outstanding')}>
            Outstanding subscriptions</span>
        <span className={active === 'expired'? 'active-navigator' : 'in-active-navigator'}
          onClick={()=>setActive('expired')}>
            Expired subscriptions</span>
        <span className={active === 'expiring'? 'active-navigator' : 'in-active-navigator'}
        onClick={()=>setActive('expiring')}>
            Expiring soon</span>
        </div>

        <div className="mt-3">
            {getComponents()}
        </div>
    </div>
    </>
  )
}

export default GeneralOverview
