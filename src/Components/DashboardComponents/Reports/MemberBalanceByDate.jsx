import React,{useState, useEffect, useContext, useMemo} from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { CSVLink } from 'react-csv'
import { LiaTimesCircle } from 'react-icons/lia'

const MemberBalanceByDate = () => {
    const [reports, setReports] = useState([])
    const [product, setProduct]= useState('')
    const [startDate, setStartDate]= useState('')
   const [endDate, setEndDate]= useState('')
 const [clicked, setClicked]= useState('')
const {credentials} = useContext(UserContext)

const getReports=()=>{
   axios(`Reports/member-balance?SelectDateType=${product}&TransactionDateFrom=${startDate}&TransactionDateTo=${endDate}`, {headers:{
       Authorization: `Bearer ${credentials.token}`
   }})
   .then(resp=>{
       if (resp.data.data.memberBalance) {
       setReports(resp.data.data.memberBalance)
       }
   })
}
   useEffect(()=>{
       getReports()
   },[product, startDate, endDate])

   const groupedLoans = reports?.reduce((acc, loan) => {
       (acc[loan.productName] = acc[loan.productName] || []).push(loan);
       return acc;
     }, {});

     const handleClicked=(productName)=>{
       setClicked(productName)
     }

    

 return (
   <div className='card py-3 px-3 mt-3 rounded-4'>
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
           Select date type<sup className="text-danger">*</sup>
         </label>
         <select
           name={product}
           onChange={(e) => setProduct(e.target.value)}
         >
           <option value="">Select</option>
           <option value="1">By Posting Date</option>
           <option value="2">By Value Date</option>
           </select>
       </div>
     </div>
    {reports.length && <div className='my-3 px-2 d-flex justify-content-end'>
       <CSVLink data={reports} filename='loanMemberBalance.csv'>
           <button   className="border-0 member btn-md text-white"
       >Export</button>
       </CSVLink>
     </div>}
     <div className="table-responsive mt-3 px-2"  style={{fontSize:'12px'}} id='customers'>
    <table className="table table-bordered">
     <thead className="thead-dark">
             <tr>
               <th>Employee ID</th>
               <th>Account No</th>
               <th>Full Name</th>
               <th>Previous Balance</th>
               <th>Debit</th>
               <th>Credit</th>
               <th>Current Balance</th>
             </tr>
           </thead>
 {Object?.keys(groupedLoans)?.map(productName => (
  <>
     {reports.length > 0 ? 
       < tbody key={productName}>
         
           <tr  style={{cursor:'pointer', border:'solid 1px #ddd', color:'var(--custom-color)'}}
            onClick={()=>handleClicked(productName)}>
             {clicked != productName? <FaAngleDown style={{color:'black'}}/>: <FaAngleUp/>} {productName} </tr>
                      
             {groupedLoans[productName]?.map(loan => (
               <tr key={loan.accountNo} className={clicked === productName ? 'clicked' : ''}>
                 <td>{loan.employeeId}</td>
                 <td>{loan.accountNo}</td>
                 <td>{loan.fullName}</td>
                 <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.previousBalance)}</td>
                 <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.debit)}</td>
                 <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.credit)}</td>
                 <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(loan.currentBalance)}</td>
               </tr>
             ))}
            
                <tr>
                <td></td>
                </tr>
       </tbody> : null}
       </>
     ))}
         </table>
                   {reports.length < 1 && <div className="d-flex justify-content-center flex-column">
                                 <LiaTimesCircle className='mx-auto' size={30}/>
                                 <p className="text-center">No record yet</p>
                                 </div>} 

   </div> 
   </div>
 )
}

export default MemberBalanceByDate
