import React, { useMemo } from 'react'
import UnpaginatedTable from '../UnpaginatedTable';

const BlockedCooperatives = ({reports}) => {
    const column=[
        {Header: 'Node ID', accessor:'node_id'},
        {Header: 'Cooperative Name', accessor:'cooperativeName'},
        {Header: 'Address', accessor:'address'},
        {Header: 'Next Payment Date', accessor:'nextPaymentDate'},
        {Header: 'Member Count', accessor:'memberCount'},
        {Header: 'Phone', accessor: 'phone'},
        {Header: 'Email', accessor:'email'},      
        {Header: 'Contact Person', accessor:'contactPerson'},      
        {Header: 'Status', accessor:'activityStatus'},      
    ]

    const columns = useMemo(() => column, []);
  return (
    <div style={{fontSize:'14px'}}>
      <UnpaginatedTable data={reports} columns={columns} filename='BlockedCooperatives.csv'/>
    </div>
  )
}

export default BlockedCooperatives
