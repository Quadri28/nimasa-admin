import React, { useEffect, useState } from 'react'
import axios from '../../axios'

const ViewCooperativeLoanFormTwo = ({details}) => {
  const [loanClasses, setLoanClasses] = useState([])
  const [repaymentTypes, setRepaymentTypes] = useState([])
  const [methods, setMethods]= useState([])
  const [productCharges, setProductCharges]= useState([])
  const [options, setOptions]= useState([])
  const getLoanClasses =()=>{
    axios('Common/getloanclass')
    .then((resp)=>setLoanClasses(resp.data))
  }

  const getMethods=()=>{
    axios('Common/calculation-method')
    .then((resp)=>setMethods(resp.data))
  }

  const getPenalOption=()=>{
    axios('Common/penal-option')
    .then(resp=>setOptions(resp.data))
  }
  const getRepaymentTypes=()=>{
    axios('Common/principal-repayment-type')
    .then((resp)=>setRepaymentTypes(resp.data))
  }
  const getProductCharges =()=>{
    axios('Common/getcharges')
    .then((resp)=>setProductCharges(resp.data))
  }
  useEffect(()=>{
    getLoanClasses()
    getRepaymentTypes()
    getProductCharges()
    getMethods()
    getPenalOption()
  },[])
  return (
    <>
    <div className="px-4 admin-task-forms">
    <div className="row g-2">
      <label htmlFor="repaymentType" style={{ fontWeight: "500" }}>
        Repayment Types
      </label>
      <select name="repaymentType" id="repaymentType"  value={details.repaymentType} > 
      <option value="">Select</option>
      {
        repaymentTypes.map((type)=>(
          <option value={type.value} key={type.value}>
            {type.name}
          </option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="penalize" style={{ fontWeight: "500" }}>
        Penalty Rate
      </label>
      <input name="penalize" id="penalize" as='select' value={details?.penalize}/>
     
    </div>
    <div className="row g-2">
      <label htmlFor="loanClass" style={{ fontWeight: "500" }}>
        Loan Class 
      </label>
      <select name="loanClass" id="loanClass" value={details?.loanClass}>
        <option value="">Select</option>
        {
          loanClasses.map((loanClass)=>(
            <option value={loanClass.code} key={loanClass.code}>{loanClass.loandesc}</option>
          ))
        }
        </select>
    </div>
    <div className="row g-2">
      <label htmlFor="collateralValue" style={{ fontWeight: "500" }}>
        Collateral Value
      </label>
      <input name="collateralValue" id="collateralValue" type="number" 
      value={details?.collateralValue} readOnly/>
    </div>
    <div className="row g-2">
      <label htmlFor="productCharges" style={{ fontWeight: "500" }}>
        Product Charges
      </label>
      <select name="productCharges" id="productCharges"
       value={details.productCharges} readOnly>
      <option value="" disabled>Select</option>
      {
      productCharges?.map((charge)=>(
          <option value={charge.chargeCode} key={charge.chargeCode}>
            {charge.chargeDesc}</option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="calculationMethod" style={{ fontWeight: "500" }}>
        Calculation Method
      </label>
      <select name="calculationMeth" id="calculationMeth" value={details?.calculationMeth} readOnly > 
      <option value="">Select</option>
      {
        methods.map((method)=>(
          <option value={method.value} key={method.value}>{method.name}</option>
        ))
      }
      </select>
    </div>
   
    <div className="row g-2">
      <label htmlFor="principalRepaymentType" style={{ fontWeight: "500", fontSize:'14px' }}>
        Principal repayment type
      </label>
      <select name="principalRepaymentType" id="principalRepaymentType"  value={details.repaymentType2} > 
      <option value="">Select</option>
      {
        repaymentTypes.map((type)=>(
          <option value={type.value} key={type.value}>
            {type.name}
          </option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="penalOptions" style={{ fontWeight: "500" }}>
     Penal Options
      </label>
      <select name="penalOptions" id="penalOptions" readOnly value={details.penalize}> 
        <option value="">Select</option>  
       {
        options.map((option)=>(
          <option value={option.value} key={option.value}>{option.name}</option>
        ))
       }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="principalBal" style={{ fontWeight: "500" }}>Principal Balance  </label>
      <input name="principalBalance"  value={details.principalBalance}/> 
  </div>
  <div className="row g-2">
      <label htmlFor="suspendedInterest" style={{ fontWeight: "500" }}>Suspended interest</label>
      <input name="suspendedInterest" id="suspendedInterest"  value={details.suspendedInterest}/> 
    </div>
  <div className="row g-2">
      <label htmlFor="interestIncome" style={{ fontWeight: "500" }}> Interest income </label>
      <input name="interestIncome" id="interestIncome"  value={details.interestIncome} /> 
    </div>
  <div className="row g-2">
      <label htmlFor="interBranch" style={{ fontWeight: "500" }}> InterBranch GL   </label>
      <input name="interBranch" id="interBranch"  value={details.interBranch}/> 
    </div>
  <div className="row g-2">
      <label htmlFor="suspendedPrincipal" style={{ fontWeight: "500" }}> Suspended Principal  </label>
      <input name="suspendedPrincipal" id="suspendedPrincipal"  value={details.suspendedPrincipal}/> 
     </div>
  <div className="row g-2">
      <label htmlFor="incomeUnearned"  style={{ fontWeight: "500" }}> Unearned income GL </label>
      <input name="incomeUnearned" id="incomeUnearned"  value={details.incomeUnearned}/> 
      </div>
  <div className="row g-2">
      <label htmlFor="miscIncome" style={{ fontWeight: "500" }}> Miscellaneous income   </label>
      <input name="miscIncome" id="miscIncome"  value={details.miscIncome}/> 
    </div>
    </div>
  </>
  )
}

export default ViewCooperativeLoanFormTwo
