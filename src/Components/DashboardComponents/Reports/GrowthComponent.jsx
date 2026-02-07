import React from 'react'
import UnpaginatedTable from './UnpaginatedTable'

const GrowthComponent = ({data, columns}) => {
  return (
    <>
       <UnpaginatedTable data={data} columns={columns} filename='MemberGrowth.csv'/>
    </>
  )
}

export default GrowthComponent
