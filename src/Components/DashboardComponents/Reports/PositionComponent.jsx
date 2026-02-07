import React, { useMemo } from 'react'
import UnpaginatedTable from './UnpaginatedTable'

const PositionComponent = ({data}) => {
    const column=[
        {Header: 'Description OF ACTIVITIES NET STRENGTH', accessor:'description'},
        {Header: 'Male', accessor:'male'},
        {Header: 'Female', accessor: 'female'},
        {Header: 'Total', accessor:'total'},
    ]
const positionColumns= useMemo(()=> column)

  return (
    <>
     <UnpaginatedTable data={data} columns={positionColumns} filename='MemberGrowth.csv'/> 
    </>
  )
}

export default PositionComponent
