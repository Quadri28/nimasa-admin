import React,{useMemo, useState, useContext, useEffect} from 'react'
import '../ConfigurationsSubComponents/Table.css'
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import GrowthComponent from './GrowthComponent';
import PositionComponent from './PositionComponent';

const MemberGrowth = () => {
    const [reports, setReports] = useState([])
    const [positions, setPositions] = useState([])
   const [reportType, setReportType] = useState('')
   const [year, setYear] = useState(new Date().getFullYear())

    const {credentials} = useContext(UserContext)

    const getPositionReports=()=>{
      axios(`Reports/member-growth-report?ReportType=${reportType}&year=${new Date(year).getFullYear()}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        if(resp.data.data.memberGrowthPositionReport ){
          setPositions(resp.data.data.memberGrowthPositionReport)
    }else{
      setReports(resp.data.data.memberGrowthReport)
    }
  })
    }
  
  useEffect(()=>{
    getPositionReports()
  },[ year, reportType])
    const column=[
        {Header: 'Period/Year', accessor:'period'},
        {Header: 'Male', accessor:'male'},
        {Header: 'Male %', accessor:'malePercentage'},
        {Header: 'Female', accessor: 'female'},
        {Header: 'Female %', accessor: 'femalepercentage'},
        {Header: 'Total', accessor:'total'},
        {Header: 'Total %', accessor:'totalPercentage'},
        {Header: '% Growth', accessor:'growth'},
    ]

const columns = useMemo(() => column, []);

    const getComponent=()=>{
      if (reportType === '1') {
       return <GrowthComponent data={reports} columns={columns} filename='MemberGrowth.csv'/>
      }else if (reportType === '2') {
        return <PositionComponent data={positions}/>
    }
    }
  return (
    <div className='card px-3 py-4 mt-3 rounded-4'>
        <div className="admin-task-forms mb-1">
      <div className="d-flex flex-column gap-1" >
        <label htmlFor="reportType">Report Type</label>
        <select name={reportType} onChange={(e)=>setReportType(e.target.value)} 
      >
          <option value="">Select</option>
          <option value={1}>Member Growth from inception</option>
          <option value={2}>Member Growth as at a period</option>
        </select>
      </div>
      {reportType === '2' ?
      <div className="d-flex flex-column gap-1">
        <label htmlFor="year">Year</label>
        <input type="date" name={year} onChange={(e)=>setYear(e.target.value)} />
      </div> : null}
      </div>
     {
      getComponent()
     }
    </div>
    
    )
}

export default MemberGrowth
