import React, { useMemo } from 'react'
import UnpaginatedTable from '../UnpaginatedTable';

const ExpiringInSixty = ({reports}) => {
    const column=[
        {Header: 'Coop ID', accessor:'coopID'},
        {Header: 'Cooperative Name', accessor:'cooperativeName'},
        {Header: 'Next Payment Date', accessor:'nextPaymentDate'},
        {Header: 'Member Count', accessor:'memberCount'},
        {Header: 'Phone', accessor: 'phone'},
        {Header: 'Email', accessor:'email'},      
        {Header: 'Contact Person', accessor:'contactPerson'},      
        {Header: 'Address', accessor:'address'},      
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
    <div style={{fontSize:'14px'}}>
      <UnpaginatedTable data={reports} columns={columns} filename='MemberStrength.csv'/>
    </div>
  )
}

export default ExpiringInSixty
