import React, { useMemo } from 'react'
import UnpaginatedTable from '../UnpaginatedTable'

const MemberStrength = ({reports}) => {
    const column=[
        {Header: 'Coop ID', accessor:'coopID'},
        {Header: 'Cooperative Name', accessor:'cooperativeName'},
        {Header: 'Registered Member Strength', accessor:'registeredMemberStrength'},
        {Header: 'Actual Member Strength', accessor: 'actualMemberStrength'},
        {Header: 'Coop Status', accessor:'coopStatus'},      
    ]

    const columns = useMemo(() => column, []);
  return (
    <>
      <UnpaginatedTable data={reports} columns={columns} filename='MemberStrength.csv'/>
    </>
  )
}

export default MemberStrength
