import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import React, { useContext, useEffect, useState, useMemo } from 'react'
import UnpaginatedTable from './UnpaginatedTable';
import { Link } from 'react-router-dom';
import { BsViewList } from 'react-icons/bs';

const TransactionReports = () => {
    const [startDate, setStartDate]= useState('')
    const [endDate, setEndDate]= useState('')
    const [reports, setReports] = useState([])
    const {credentials} = useContext(UserContext)

    const getReport=()=>{
        axios(`Reports/transactions-report?StartDate=${startDate}&EndDate=${endDate}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
            if (resp.data.data.transactionReports) {
            setReports(resp.data.data.transactionReports)
            }
    })
    }
    useEffect(()=>{
        getReport()
      },[ endDate,startDate])

      const column=[
        {Header: 'Account No', accessor:'accountNo'},
        {Header: 'Account Name', accessor:'accountName'},
        {Header: 'Transaction Date', accessor:'transactionDate'},
        {Header: 'Value Date', accessor: 'valueDate'},
        {Header: 'Account Type', accessor:'accountType'},
        {Header: 'User ID', accessor:'userId'},
        {Header: 'Dr', accessor:'dr', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {}).format(value)}</span>
        })},
        {Header: 'Cr', accessor:'cr', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {}).format(value)}</span>
        })},
        {Header: 'Narration', accessor:'narration'},
        {Header: 'Action', accessor:'', Cell:(props)=>{
          const params = props.row.original
          return <Link to={`transaction/${params.batchno}`}
           className='text-dark text-center'>
            <BsViewList/>
            </Link>
        }},
    ]

const columns = useMemo(() => column, []);

  return (
    <div className='card py-3 px-2 mt-3 rounded-4 border-0'>
        <span style={{fontWeight:'700', fontSize:'20px', color:'#0452C8',}}>Ensure of interval of a month !!!</span>
      <div className='admin-task-forms mb-3'>
      <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='w-100'
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
            className='w-100'
          />
        </div>
      </div>
      <div style={{fontSize:'14px'}}>
      <UnpaginatedTable
        data={reports}
        columns={columns}
        filename="Transactions.csv"
      />
    </div>
    </div>
  )
}

export default TransactionReports
