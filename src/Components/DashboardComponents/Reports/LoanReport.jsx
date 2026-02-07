import React,{useContext, useEffect, useState} from 'react'
import {FaAngleDown, FaAngleUp } from 'react-icons/fa';
import axios from '../../../Components/axios'
import {UserContext} from '../../AuthContext'
import { CSVLink } from 'react-csv'
import { LiaTimesCircle } from 'react-icons/lia';

const LoanReport = () => {
  const [statuses, setStatuses] = useState([])
  const [reports, setReports] = useState([])
  const [status, setStatus] = useState('')
  const {credentials} = useContext(UserContext)
  const [clicked, setClicked]= useState('')

  const getReports =()=>{
    axios(`Reports/loan-report?SelectLoanStatus=${status}`, {headers:{
      Authorization: `Bearer ${credentials.token}`}
    }).then(resp=>{
      if (resp.data.data.loanReport) {
        setReports(resp.data.data.loanReport)
      }
      })
  }

  const getStatuses = ()=>{
     axios('Reports/loan-status', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>  setStatuses(resp.data))
  }
  
  useEffect(()=>{
    getStatuses()
  },[])

  const handleClicked=(productName)=>{
    setClicked(productName)
  }

  const groupedLoans = reports?.reduce((acc, loan) => {
    (acc[loan.productName] = acc[loan.productName] || []).push(loan);
    return acc;
  }, {});
  
  useEffect(()=>{
    if (status) {
    getReports()
    }
  }, [status])
  return (
    <div className='mt-4' style={{overflow:'hidden'}}>
   <div className='admin-task-forms'>
    <select name={status} id="" className='mb-3' 
    onChange={(e)=>setStatus(e.target.value)}>
      <option value="">Select</option>
      {
        statuses.map(status=>(
          <option value={status.value} key={status.value}>{status.name}</option>
        ))
      }
    </select>
    </div>
   {reports?.length > 0 ? 
    <div className='d-flex justify-content-end'>
      <CSVLink data={reports ? reports : ''} filename={"loanReports.csv"}>
      <button
        className="border-0 member btn-md text-white"
        style={{fontSize:'14px' }}
      >
        Export
      </button>
      </CSVLink>
      </div> : ''}
   <div className="table-responsive mt-3"  id='customers'>
     <table className="table table-bordered" style={{textTransform:'capitalize'}}>
      <thead className="thead-dark">
              <tr>
                <th>Acct. No</th>
                <th>Full Name</th>
                <th>Loan Amount</th>
                <th>Principal Balance</th>
                <th>Int. Balance</th>
                <th>Principal + Int. Balance</th>
                <th>Start Date</th>
                <th>Maturity Date</th>
                <th>Int. Rate</th>
                <th>Duration</th>
                <th>Status</th>
                {/* <th>Guarantors</th>  */}
              </tr>
            </thead>
  {Object?.keys(groupedLoans)?.map(productName => (
    <>
   {reports?.length > 0 &&
    <tbody key={productName}>
        
            <td colSpan={11} style={{fontSize:'12px', cursor:'pointer', backgroundColor:'#D8EDE0', }}
             onClick={()=>handleClicked(productName)}>
              {clicked != productName? <FaAngleDown style={{color:'black', backgroundColor:'#D8EDE0',}}/>
              : <FaAngleUp style={{color:'black', backgroundColor:'#D8EDE0',}}/>} {productName} </td>
                      
              {groupedLoans[productName]?.map(loan => (
                <tr key={loan.accountNo} className={clicked === productName ? 'clicked' : ''}>
                  <td>{loan.accountNo}</td>
                  <td>{loan.fullname}</td>
                  <td>  {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3,}).format(
                    loan.loanAmount)}</td>
                  <td>  {new Intl.NumberFormat('en-US').format(loan.printcBal)}</td>
                  <td>{new Intl.NumberFormat('en-US').format(loan.intBal)}</td>
                  <td>{new Intl.NumberFormat('en-US').format(loan.prinIntBal)}</td>
                  <td>{loan.startDate}</td>
                  <td>{loan.maturityDate}</td>
                  <td>{loan.interestRate}</td>
                   <td>{loan.duration}</td>
                  <td>{loan.status}</td>
                  {/* <td>{loan.guarantors}</td>  */}
                </tr>
              ))}
        </tbody>  }
        </>
      ))}
          </table>
    </div> 
    {reports.length < 1 && <div className="d-flex justify-content-center flex-column">
                  <LiaTimesCircle className='mx-auto' size={30}/>
                  <p className="text-center">No record yet</p>
                  </div> }
     </div>   
    
    )
}

export default LoanReport
