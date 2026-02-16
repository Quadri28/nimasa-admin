import React, { useContext, useEffect, useMemo, useState } from 'react'
import GlobalTable from '../GlobalTable'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { LiaTimesCircle } from 'react-icons/lia'

const OutstandingSubscriptions = () => {
    const [data, setData]= useState([])
    const {credentials}= useContext(UserContext)

    const getOutstandingSubscription=()=>{
      axios('Reports/tenant-report?ReportType=5', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setData(resp.data.data.cooperativeOutstandingPartial))
    }

    useEffect(()=>{
      getOutstandingSubscription()
    }, [])
    const column=[
        {Header: 'S/N', accessor: '', Cell:(({cell})=>{
            const No = cell.row.index
            return <span>{No +1}</span>
          })  },
          {Header: 'Cooperative Name', accessor:'cooperativeName'},
          {Header: 'Address', accessor:'address'},
          {Header: 'Email', accessor:'email'},
          {Header: 'Phone No', accessor:'phone'},
          {Header: 'Member count', accessor:'memberCount'},
          {Header: 'Next pay due', accessor:'nextPaymentDate'},
          {Header: 'Status', accessor:'activityStatus', Cell:(({value})=>{
            if (value === 'Active') {
              return <div className='active-status px-3'>
          <hr /> <span>{value}</span>
              </div>
            }else{
              return <div className='pending-status px-3'>
              <hr /> <span>{value}</span>
                  </div>
            }
           
          })},      
    ]
    const columns = useMemo(() => column, []);

  return (
    <div>
      <GlobalTable columns={columns} data={data}/>
    </div>
  )
}

export default OutstandingSubscriptions
