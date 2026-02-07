import React, { useMemo } from 'react'
import UnpaginatedTable from '../UnpaginatedTable';

const OutStandingPartialPayment = ({reports}) => {
    const column=[
        {Header: 'Node ID', accessor:'node_id'},
        {Header: 'Cooperative Name', accessor:'cooperativeName'},
        {Header: 'Address', accessor:'address'},
        {Header: 'Next Payment Date', accessor:'nextPaymentDate'},
        {Header: 'Member Count', accessor:'memberCount'},
        {Header: 'Contact Person', accessor:'contactPerson'},
        {Header: 'Designation', accessor:'designation'},
        {Header: 'Phone', accessor: 'phone'},
        {Header: 'Email', accessor:'email'},      
        {Header: 'Amount Due', accessor:'amountDue'},      
        {Header: 'Partial Amount', accessor:'partialAmount'},      
        {Header: 'Outstanding Balance', accessor:'outstandingBalance'},      
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
      <UnpaginatedTable data={reports} columns={columns} filename='OutstandingPartialPayment.csv'/>
    </div>
  )
}

export default OutStandingPartialPayment
