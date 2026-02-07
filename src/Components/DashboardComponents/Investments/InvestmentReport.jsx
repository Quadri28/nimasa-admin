import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { CSVLink } from 'react-csv'

const InvestmentReport = () => {
    const [statuses, setStatuses]= useState([])
    const [status, setStatus]=useState({})
  const [clicked, setClicked]= useState('')
    const{credentials}= useContext(UserContext)
  
    const getStatuses= async()=>{
        try {
            await axios(`Investment/get-placement-report?PlacementStatus=${status}`, {headers:{
                Authorization: `Bearer ${credentials.token}`
            }}).then(resp=>setStatuses(resp.data.data.placementReports)) 
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getStatuses()
    }, [status])
    const groupedStatuses = statuses?.reduce((acc, status) => {
        (acc[status.productName] = acc[status.productName] || []).push(status);
        return acc;
      }, {});
    const navigate= useNavigate()
    const handleClicked=(productName)=>{
        setClicked(productName)
      }
    const onSubmit=(e)=>{
        e.preventDefault()
    }
  return (
    <>
    <form onSubmit={onSubmit}>
    <div
      className="p-3"
      style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
    >
      <div
        className=" d-flex align-items-center gap-2"
        style={{ width: "fit-content" }}
      >
        <span style={{ fontSize: "16px" }}>Investment report </span>
      </div>
    </div>
   
    <div
      className="px-3 pt-2 pb-4 bg-white" style={{ borderInline: "1px solid #fafafa" }}>
      <div className="admin-task-forms my-4">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Investment status</label>
            <select name='status' onChange={(e)=>setStatus(e.target.value)} required>
                <option value="">Select</option>
                <option value="1">Active</option>
                <option value="2">Completed</option>
            </select>
        </div>
      </div>
      <div>
      <CSVLink data={statuses ? statuses : ''} filename={"InvestmentReports.csv"}>
      <button
        className="btn btn-md text-white rounded-4" type='button'
        style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
      >
        Export
      </button>
      </CSVLink>
      </div>
      {statuses?.length > 0 ? 
   <div className="table-responsive mt-4"  id='customers'>
     <table className="table table-bordered" style={{textTransform:'capitalize'}}>
      <thead className="thead-dark">
              <tr>
                <th>Account Number</th>
                <th>Account Title</th>
                <th>Rate</th>
                <th>Term</th>
                <th>Start Date</th>
                <th>Maturity Date</th>
                <th>Principal</th>
                <th>Accrued Int.</th>
                <th>Current Val. Bal.</th>
            </tr>
        </thead>
        {Object?.keys(groupedStatuses)?.map(productName => {
            const totalPrincipal = groupedStatuses[productName]?.reduce((acc, status) => acc + status.principal, 0);
            const totalAccruedInterest = groupedStatuses[productName]?.reduce((acc, status) => acc + status.accruedInterest, 0);
            const totalCurrentValBalance= groupedStatuses[productName]?.reduce((acc, status)=>acc + status.currentValBalance, 0);
        
        return <tbody key={productName}>
          <tr>
            <td colSpan={10} style={{fontSize:'12px', cursor:'pointer', border:'none', backgroundColor:'#D8EDE0', }}
             onClick={()=>handleClicked(productName)}>
              {clicked != productName? <FaAngleDown style={{color:'black'}}/>:
               <FaAngleUp/>} {productName} </td>
            </tr>            
              {groupedStatuses[productName]?.map(status => (
                <tr key={status.accountNo} className={clicked === productName ? 'clicked' : ''}>
                  <td>{status.accountNumber}</td>
                  <td>{status.accountTitle}</td>
                  <td>  {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3,}).format(
                    status.rate)}</td>
                  <td>  {status.term}</td>
                  <td>{status.startDate}</td>
                  <td>{status.maturityDate}</td>
                  <td>{new Intl.NumberFormat('en-US').format(status.principal)}</td>
                  <td>{new Intl.NumberFormat('en-US').format(status.accruedInterest)}</td>
                  <td>{new Intl.NumberFormat('en-US').format(status.currentValBalance)}</td>
                  </tr>
                  ))} 
                    <tr>
                    <td colSpan={6} style={{ fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                    <td>{new Intl.NumberFormat('en-US').format(totalPrincipal)}</td>
                    <td>{new Intl.NumberFormat('en-US').format(totalAccruedInterest)}</td>
                    <td>{new Intl.NumberFormat('en-US').format(totalCurrentValBalance)}</td>
                    </tr>
                   </tbody>})}
        </table>
        </div>: ''}
    </div>
    <div
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }}
          className="d-flex justify-content-end gap-3 p-4">
        </div>
    </form>
    
    </>
  )
}

export default InvestmentReport
