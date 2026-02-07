import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import UnpaginatedTable from './UnpaginatedTable'
import { GoArrowLeft } from 'react-icons/go'

const FinancialDetail = () => {
    const {id} = useParams()
    const [details, setDetails]= useState([])
    const{credentials} = useContext(UserContext)
    const getDetails=()=>{
        axios(`Reports/product-summary-analysis-details?ProductCode=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setDetails(resp.data.data.productSummaryAnalysisDetailReports))
    }
    useEffect(()=>{
        getDetails()
    },[id])

    const column=[
        {Header: 'Branch Name', accessor:'branchName'},
        {Header: 'Account Number', accessor:'accountNumber'},
        {Header: 'Account Title', accessor:'accountTitle'},
        {Header: 'Date Opened', accessor: 'dateOpened'},
        {Header: 'Book Balance', accessor: 'bookBalance'},
        {Header: 'Available Balance', accessor:'availableBalance'},
        {Header: 'Last Movt.', accessor:'lastMovt'},
        {Header: 'Uncleared Bal.', accessor:'unclearedBalance'},
        {Header: 'Pending Charges', accessor:'pendingCharge'},
    ]

    const navigate = useNavigate()

const columns = useMemo(() => column, []);
  return (
    <div className='card p-3 mt-3 border rounded-4'>
    <span onClick={()=>navigate(-1)} style={{cursor:'pointer'}}><GoArrowLeft /> Back</span>
    <UnpaginatedTable 
    data={details}
    columns={columns}
    />
    </div>
  )
}

export default FinancialDetail
