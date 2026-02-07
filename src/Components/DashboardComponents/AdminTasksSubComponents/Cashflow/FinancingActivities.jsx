import React from 'react'
import ReportChart from '../../Reports/ReportChart'

const FinancingActivities = () => {
  return (
    <div className='card py-3 px-4 my-3'>
      <div className="d-flex gap-3 mt-3 member-card-container">
        <div className="card px-2 rounded-4 col-sm-2" style={{ backgroundColor: '#FAFAFA', height:'fit-width'}}>
            <p>Budget</p>
            <h4>192,426</h4>
        </div>
        <div className="card px-2 rounded-4 col-sm-2" style={{ backgroundColor: '#FAFAFA', height:'fit-width'}}>
            <p>Actuals</p>
            <h4>192,426</h4>
        </div>
      </div>
      <ReportChart/>
    </div>
  )
}

export default FinancingActivities
