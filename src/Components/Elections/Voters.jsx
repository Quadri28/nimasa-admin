import React,{useEffect, useMemo, useState} from 'react'
import axios from '../../Components/axios';
import UnpaginatedTable from '../DashboardComponents/Reports/UnpaginatedTable';

const Voters = () => {
  const [data, setData]= useState([])
  const getVoters=()=>{
    axios('Election/get-election-voters').then(resp=>setData(resp.data.data))
  }
    
  useEffect(()=>{
    getVoters()
  }, [])
    const column=[
        {Header:'S/N', accessor:'', Cell:(({cell})=>{
          const No= cell.row.index
          return <span>{No + 1}</span>
        })},
        {Header: 'Member ID', accessor:'memberId'},
        {Header: 'Name of Voter', accessor:"nameOfVoter"},
        {Header: 'Name of candidates voted', accessor: 'nameOfCandidateVotedFor', Cell:(({value})=>{
  return (
    <span className="text-capitalize" style={{textTransform:'capitalize'}}>
       {value.map(v => v.charAt(0) + v.slice(1)).join(', ')}
    </span>
  );
})},
        {Header: 'Date and time voted', accessor:'dateAndTimeVoted'},
    ]
    
    const columns = useMemo(() => column, []);
    
  return (
    <div className='table-responsive'>    
           <UnpaginatedTable data={data} columns={columns} isSearch={true} isExport={true} filename={'Election report'}/>
    </div>
  )
}

export default Voters
