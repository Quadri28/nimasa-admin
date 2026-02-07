import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import ListOfBalances from './StatutoryReportTables/ListOfBalances'
import FinancialPosition from './StatutoryReportTables/FinancialPosition'
import ComprehensiveIncome from './StatutoryReportTables/ComprehensiveIncome'
import FinancialPositionNote from './StatutoryReportTables/FinancialPositionNote'
import ComprehensiveIncomeNote from './StatutoryReportTables/ComprehensiveIncomeNote'
import OperatingStatement from './StatutoryReportTables/OperatingStatement'
import SurplusFund from './StatutoryReportTables/SurplusFund'

const StatutoryReports = () => {
const [reports, setReports] = useState([])
const [types, setTypes] = useState([])
const [type, setType] = useState('')
const [endDate, setEndDate] = useState('')
const [startDate, setStartDate] = useState('')
const [selected, setSelected] = useState('')
const [error, setError] = useState('')
const {credentials} = useContext(UserContext)


const getTypes=()=>{
  axios('Reports/statutory-report-type', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    setTypes(resp.data)
  })
}

useEffect(()=>{
getTypes()
},[])
const getReports = () => {
  // Don't make request if required fields are empty
  if (!type || !startDate || !endDate) {
    setReports([]);
    setSelected('');
    return;
  }

  setReports([]);
  setSelected('');

  axios(`Reports/statutory-reports?ReportType=${type}&ReportStartDate=${startDate}&ReportEndDateDate=${endDate}`, {
    headers: { Authorization: `Bearer ${credentials.token}` }
  })
  .then(resp => {
    // Reset everything first
    setReports([]);
    setSelected('');

    // Check each report type with null checks
    const data = resp.data.data || {};
    
    if (data.listOfBalancesReports?.length) {
      setSelected('balances');
      setReports(data.listOfBalancesReports);
    } 
    else if (data.statementOfFinancialPositionReports?.length) {
      setSelected('financial');
      setReports(data.statementOfFinancialPositionReports);
    } 
    else if (data.statementOfComprehensiveIncomeReports?.length) {
      setSelected('income');
      setReports(data.statementOfComprehensiveIncomeReports);
    }
    else if (data.statementOfFinancialPositionNotesReports?.length) {
      setSelected('notes');
      setReports(data.statementOfFinancialPositionNotesReports);
    }
    else if (data.statementOfComprehensiveIncomeNotesReports?.length) {
      setSelected('incomeNotes');
      setReports(data.statementOfComprehensiveIncomeNotesReports);
    }
    else if (data.comparativeAnalysisOfOperatingStatementReports?.length) {
      setSelected('operating');
      setReports(data.comparativeAnalysisOfOperatingStatementReports);
    }
    else if (data.disposalOfSurplusFundsReports?.length) {
      setSelected('surplus');
      setReports(data.disposalOfSurplusFundsReports);
    }
    else {
      // No data found for any report type
      setSelected('none');
    }
  })
  .catch(err => {
    setReports([]);
    setSelected('');
    setError(err.response.data.message)
  })
  
}

useEffect(()=>{
  getReports()
},[endDate, startDate, type])


const groupedLoans = useMemo(()=> {
  return (reports || []).reduce((acc, loan) => {
  (acc[loan.reportName] = acc[loan.reportName] || []).push(loan);
  return acc;
}, {})
}, [reports])

const financialPositionReports= (reports || []).reduce((acc, loan) => {
  (acc[loan.reportCategory] = acc[loan.reportCategory] || []).push(loan);
  return acc;
}, {});

const financialPositionNoteReports= (reports || []).reduce((acc, loan) => {
  (acc[loan.itemDesc] = acc[loan.itemDesc] || []).push(loan);
  return acc;
}, {});

const fundDisbursedReports= (reports || []).reduce((acc, loan) => {
  (acc[loan.itemDescription] = acc[loan.itemDescriptions] || []).push(loan);
  return acc;
}, {});

const getComponent =()=>{
   if (selected === 'balances') {
    return <ListOfBalances groupedLoans={groupedLoans}/>
  }else if (selected === 'financial') {
    return <FinancialPosition
    startDate={startDate}
    endDate={endDate}
     financialPositionReports={financialPositionReports}/>
  }else if (selected === 'income') {
    return <ComprehensiveIncome startDate={startDate}
    endDate={endDate}
     financialPositionReports={financialPositionReports}/>
  }else if (selected === 'notes') {
    return <FinancialPositionNote startDate={startDate}
    endDate={endDate}
     financialPositionNoteReports={financialPositionNoteReports}/>
  }else if (selected === 'incomeNotes') {
    return <ComprehensiveIncomeNote startDate={startDate}
    endDate={endDate} financialPositionNoteReports={financialPositionNoteReports}/>
  }else if (selected === 'operating') {
    return <OperatingStatement  startDate={startDate}
    endDate={endDate} financialPositionNoteReports={financialPositionNoteReports}/>
  }else if (selected === 'surplus') {
    return <SurplusFund groupedLoans={fundDisbursedReports}/>
  }else if (reports.length === 0 )
    return <div className='d-flex text-center'>No data for the selected report</div>
  
}
  return (
    <div className='mt-2'>
      <h3 className="fs-6">Statutory Report</h3>
      <div className='admin-task-forms mb-4'>
      <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            End Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Report type<sup className="text-danger">*</sup>
          </label>
          <select
            name={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 rounded-3"
            style={{ border: "solid 1px #ddd", outline: "none" }}
          >
            <option value="">Select</option>
            {
              types.map((type)=>(
                <option value={type.value}  key={type.value}>{type.name}</option>
              ))
            }
            </select>
        </div>
      </div>
      {
        getComponent()
      }
    </div>
  )
}

export default StatutoryReports
