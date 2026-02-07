import React from 'react'
import ManageStatus from '../AdminTasksSubComponents/ManageStatus'
import ReportChart from './ReportChart'

const FinancialReport = () => {
  return (
    <>
    <div>
      <h6>Cooperative Revenue Growth</h6>
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
      <ManageStatus/>
    </>
  )
}

export default FinancialReport
