
import React, { useEffect, useState, useMemo, useContext } from 'react'
import UnpaginatedTable from './UnpaginatedTable'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'

const LoanRepayment = () => {
    const [products, setProducts] = useState([])
    const [reports, setReports] = useState([])
     const [product, setProduct]= useState('')
     const [startDate, setStartDate]= useState('')
    const [endDate, setEndDate]= useState('')
const {credentials} = useContext(UserContext)

const getReports=()=>{
    axios(`Reports/loan-repayment-paid-report?ProductCode=${product}&TransactionDateFrom=${startDate}&TransactionDateTo=${endDate}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }})
    .then(resp=>{
        if (resp.data.data.loanRepaymentPaidReport) {
        setReports(resp.data.data.loanRepaymentPaidReport)
        }
    })
}
    const getProducts=()=>{
        axios('LoanProduct/loan-products',{headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setProducts(resp.data.data))
      }
    useEffect(()=>{
        getProducts()
    },[])

    useEffect(()=>{
        getReports()
    },[product, startDate, endDate])
    const column=[
        {Header: 'Cust. ID', accessor:'customerId'},
        {Header: 'Loan Acct No', accessor:'accountNumber'},
        {Header: 'Deposit Acct', accessor:'depositAccount'},
        {Header: 'Acct. Title', accessor:'accountTitle'},
        {Header: 'Facility Amt.', accessor: 'facilityAmount', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header: 'Princ. Due', accessor: 'principalAmountDue', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header: 'Int. Due', accessor:'interestAmountDue', Cell:(({value})=>{
          return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
        })},
        {Header: 'Date Due', accessor:'dateDue'},
        {Header: 'Loan Term (Month)', accessor:'loanTerm'},
        {Header: 'Date Opened', accessor:'dateOpened'},
        {Header: 'Maturity Date', accessor:'maturityDate'},
        {Header: 'Created By', accessor:'createdby'},
        {Header: 'Status', accessor:'status'},
    ]

const columns = useMemo(() => column, []);

  return (
    <div className='bg-white py-4 px-3 mt-3 rounded-4' style={{border:'solid 1px #fafafa'}}>
      <div className='admin-task-forms'>
      <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Start Date<sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            name={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
          />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="startDate">
            Select product type<sup className="text-danger">*</sup>
          </label>
          <select
            type="date"
            name={endDate}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">Select</option>
            {
                products.map((product)=>(
                    <option value={product.productCode} key={product.productCode}>{product.productName.replace(/\s/g, "")}</option>
                ))
            }
            </select>
        </div>
      </div>
      <div style={{fontSize:'14px', marginTop:'1rem'}}>
      <UnpaginatedTable
        data={reports}
        columns={columns}
        filename="LoanRepaymentPaidReports.csv"
      />
    </div>
    </div>
  )
}

export default LoanRepayment
