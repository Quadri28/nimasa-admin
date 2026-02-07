import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from '../../axios'
import {UserContext} from '../../AuthContext'
import * as Yup from 'yup'
import { Multiselect } from "react-widgets";
import { toast, ToastContainer } from "react-toastify";
import ErrorText from "../ErrorText";
import { NumericFormat } from "react-number-format";

const LoanApplication = () => {
  const [sources, setSources]= useState([])
  const [loans, setLoans] = useState([])
  const [groups, setGroups]= useState([])
  const [calcMethods, setCalcMethods]= useState([])
  const [frequencies, setFrequencies]=useState([])
  const [loanSources, setLoanSources]=useState([])
  const [guarantors, setGuarantors]=useState([])
  const [colTypes, setColTypes]= useState([])
  const [repayTypes, setRepayTypes]= useState([])
  const [members, setMembers]=useState([])
  const [frequency, setFrequency]= useState('')
  const [term, setTerm]= useState(null)
  const [noOfDays, setNoOFDays]=useState(null)
  const [data, setData]= useState([])
  const [loading, setLoading]= useState(false)
  const [maturityDate, setMaturityDate]= useState({})
  const [loanAmount, setLoanAmount] = useState(0)
  const [collateralValue, setCollateralValue] = useState(0)
  const [firstPaymentDate, setFirstPaymentDate] = useState('')
const {credentials} = useContext(UserContext)

const getMaturityDate =()=>{
  axios(`Common/calculate-maturity-date-by-first-payment-date?Value=${term}&FreqCode=${frequency}&FirstPaymentDate=${firstPaymentDate}`, {
    headers: {
      Authorization: `Bearer ${credentials.token}`
    }
  }).then(resp=>{
    setMaturityDate(resp.data.data.maturityDate)
  })
}
useEffect(()=>{
getMaturityDate()
}, [term, frequency, firstPaymentDate])

const getMembers=()=>{
  axios('Acounting/general-ledger-customer-enquiry?SearchOption=2', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setMembers(resp.data.data))
}
const getRepaymentTypes=()=>{
  axios('LoanApplication/loan-repayment-type', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setRepayTypes(resp.data.data))
}
const getCollateralTypes=()=>{
  axios('LoanApplication/get-collateral-type', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setColTypes(resp.data.data))
}
const getGuarantors=()=>{
  axios('LoanApplication/get-loan-gaurators', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setGuarantors(resp.data.data))
}
const getLoanSources=()=>{
  axios('LoanApplication/get-loan-source-type', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setLoanSources(resp.data.data))
}
const getFrequencies=()=>{
  axios('LoanApplication/loan-frequency-type', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setFrequencies(resp.data.data))
}
const getCalculationMethods=()=>{
  axios('Common/calculation-method', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setCalcMethods(resp.data))
}
const getGroups=()=>{
  axios('LoanApplication/get-loan-group', {headers:{ 
    Authorization:`Bearer ${credentials.token}`
}}).then(resp=>setGroups(resp.data.data))
}

  const getSources=()=>{
    axios('LoanApplication/get-loan-funding-source',  {headers:{
      Authorization: `Bearer ${credentials.token}`}})
      .then(resp=>setSources(resp.data.data))
  }
  const getLoans=()=>{
    axios('LoanApplication/get-loan-product', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setLoans(resp.data.data))
  }

  const getNoOfDays= ()=>{
    if (frequency === '001') {
      setNoOFDays(7)
      setTerm(7) 
    }else if (frequency === '002') {
      setNoOFDays(7 * term)
    }else if (frequency === '003') {
       setNoOFDays(14 * term)
    }else if (frequency === '004') {
      setNoOFDays(30 * term)
    }
  }
  
  useEffect(()=>{
getNoOfDays()
  }, [term, frequency])
  useEffect(()=>{
    getLoans()
    getSources()
    getGroups()
    getFrequencies()
    getCollateralTypes()
    getGuarantors()
    getLoanSources()
    getRepaymentTypes()
    getMembers()
    getCalculationMethods()
  },[])

  const initialValues={
      customerId: '',
      group: '',
      loanProduct: '',
      loanFundingSource: '',
      loanRate: '',
      calcMethod: '',
      repaymentType: '',
      collateralValue:'',
      collateralType: '',
      drawDownDate: '',
      startDate: '',
      loanSource: '',
      collateralDetail: '',
      loanPurpose:''
  }

  const validationSchema= Yup.object({
    customerId: Yup.string().required().label('Customer ID'),
    group: Yup.string().label('Group'),
    loanProduct: Yup.string().required().label('Loan product'),
    loanFundingSource: Yup.string().required().label('Loan funding source'),
    loanRate: Yup.string().required().label('Loan Rate'),
    calcMethod: Yup.string().required().label('Calculation method'),
    repaymentType: Yup.string().required().label('Repayment type'),
    collateralType: Yup.string().required().label('Collateral type'),
    drawDownDate: Yup.string().required().label('Draw down date'),
    startDate: Yup.string().required().label('Start date'),
    firstPaymentDate: Yup.string().required().label('First payment date'),
    loanSource: Yup.string().required().label('Loan source'),
    collateralDetail: Yup.string().required().label('Collateral detail'),
    loanPurpose: Yup.string().required().label('Loan purpose')
  })
  const onSubmit=(values)=>{
    console.log(values)
    const payload={
      customerId: values.customerId,
      group: values.group,
      loanProduct: values.loanProduct,
      loanFundingSource: values.loanFundingSource,
      branch: '001',
      loanAmount: Number(loanAmount.replace(/,/g, "")),
      loanRate: values.loanRate,
      term: String(term),
      frequency: frequency,
      noOfDays: Number(noOfDays),
      postingDate: new Date(),
      calculationMethod: values.calcMethod,
      repaymentType: values.repaymentType,
      collateralValue: Number(collateralValue.replace(/,/g, "")),
      collateralType: values.collateralType,
      drawDownDate: values.drawDownDate,
      startDate: values.startDate,
      firstPaymentDate: firstPaymentDate,
      maturityDate: maturityDate,
      loanSource: values.loanSource,
      collateralDetail: values.collateralDetail,
      loanPurpose:values.loanPurpose,
      gaurators: data
    }
    setLoading(true)
    axios.post('LoanApplication/loan-application', payload, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }
    }).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true})
      setLoading(false)
    })
    .catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
      setLoading(false)
    })
  }
  return (
    <>
     
        <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        // validationSchema={validationSchema}
        >
          <Form className="bg-white rounded-4" style={{border:'solid .5px #fafafa'}}>
          <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <span style={{ fontWeight: "500", fontSize: "16px", color:'#333' }}>Loan Application</span>
        </div>
          <div className="p-3 admin-task-forms">
            <div className="d-flex flex-column gap-1" >
              <label htmlFor="customerId" style={{ fontWeight: "500" }}>
                Customer ID<sup className="text-danger">*</sup>
              </label>
              <Field name="customerId" required as='select'
               className="text-lowercase">
                <option value="">Select</option>
                {
                  members.map(member=>(
                    <option value={member.id} key={member.id} className="text-lowercase">
                      {`${member.acctName}>>${member.id}`} </option>
                  ))
                }
                </Field>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="group" style={{ fontWeight: "500" }}>
                Group
              </label>
              <Field name="group" id="group" as='select'>
                <option value="">Select</option>
                {
                  groups.map(group=>(
                    <option value={group.groupId} key={group.groupId}>{group.groupName}</option>
                  ))
                }
                </Field>
              <ErrorMessage name="group" component={ErrorText}/>
            </div>
            <div className="d-flex flex-column gap-1 ">
        <label htmlFor="loanProduct" style={{ fontWeight: "500" }}>
          Loan product<sup className="text-danger">*</sup>
        </label>
        <Field name="loanProduct" required as='select'>
            <option value="">Select</option>
            {
              loans.map(loan=>(
                <option value={loan.productCode} key={loan.productCode}>{loan.productName}</option>
              ))
            }
        </Field>
      </div>
      <div className="d-flex flex-column gap-1 ">
        <label htmlFor="loanFundingSource" style={{ fontWeight: "500" }}>
          Loan funding source<sup className="text-danger">*</sup>
        </label>
        <Field name="loanFundingSource" required as='select'>
            <option value="">Select</option>
            {
              sources.map(source=>(
                <option value={source.glNumber} key={source.glNumber}>{source.accountName}</option>
              ))
            }
        </Field>
        <ErrorMessage name="loanFundingSource" component={ErrorText}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="loanAmount" style={{ fontWeight: "500" }}>
         Loan Amount<sup className="text-danger">*</sup>
        </label>
        <NumericFormat name="loanAmount" thousandSeparator={true} decimalScale={2}
         fixedDecimalScale={2} required onChange={(e)=>setLoanAmount(e.target.value)}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="loanRate" style={{ fontWeight: "500" }}>
          Loan Rate<sup className="text-danger">*</sup>
        </label>
        <Field name="loanRate" required min={0} type='number'/>
        <ErrorMessage name="loanRate" component={ErrorText}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="frequency" style={{ fontWeight: "500" }}>
         Frequency<sup className="text-danger">*</sup>
        </label>
        <select name="frequency" required as='select' onChange={(e)=>setFrequency(e.target.value)}>
            <option value="">Select</option>
            {
              frequencies.map(freq=>(
                <option value={freq.frequencyCode} key={freq.frequencyCode}>{freq.frequencyName}</option>
              ))
            }
         </select>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="postingDate" style={{ fontWeight: "500" }}>
          Posting date<sup className="text-danger">*</sup>
        </label>
        <input name="postingDate"  disabled value={new Date().toLocaleDateString('en-US')}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="calcMethod" style={{ fontWeight: "500" }}>
         Calculation method<sup className="text-danger">*</sup>
        </label>
        <Field name="calcMethod" required as='select'>
            <option value="">Select</option>
            {
              calcMethods.map(method=>(
                <option value={method.value} key={method.value}>{method.name}</option>
              ))
            }
         </Field>
         <ErrorMessage name="calcMethod" component={ErrorText}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="term" style={{ fontWeight: "500" }}>
          Term<sup className="text-danger">*</sup>
        </label>
        <input name={term} id="term" type='number' required onChange={(e)=>
          { frequency === '001' ? setTerm(7) : setTerm(e.target.value)}}/>
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="repaymentType" style={{ fontWeight: "500" }}>
          Repayment type<sup className="text-danger">*</sup>
        </label>
        <Field name="repaymentType" required as='select'>
        <option value="">Select</option>
        {
          repayTypes.map(type=>(
            <option value={type.repaymentId} key={type.repaymentId}>{type.repaymentName}</option>
          ))
        }
        </Field>
      </div>
      <div className="d-flex flex-column gap-1 ">
        <label htmlFor="collateralType" style={{ fontWeight: "500" }}>
          Collateral type<sup className="text-danger">*</sup>
        </label>
        <Field name="collateralType" required as='select'>
          <option value="">Select</option>
          {
            colTypes.map(type=>(
              <option value={type.collateralId} key={type.collateralId}>{type.collateralName}</option>
            ))
          }
          </Field>  
      </div>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="collateralValue" style={{ fontWeight: "500" }}>
          Collateral value<sup className="text-danger">*</sup>
        </label>
        <NumericFormat name="collateralValue" fixedDecimalScale={true} decimalScale={2}
         thousandSeparator={true} required onChange={(e)=>setCollateralValue(e.target.value)}/>
      </div>
      <div className="d-flex flex-column gap-1 ">
              <label htmlFor="startDate" style={{ fontWeight: "500" }}>
                Start date<sup className="text-danger">*</sup>
              </label>
              <Field name="startDate" required type='date'/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="collateralDetail" style={{ fontWeight: "500" }}>
                Collateral detail<sup className="text-danger">*</sup>
              </label>
              <Field name="collateralDetail"  />
              <ErrorMessage name="collateralDetail" component={ErrorText}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="drawDownDate" style={{ fontWeight: "500" }}>
             Drawdown date<sup className="text-danger">*</sup>
              </label>
              <Field name="drawDownDate" required type='date' />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="noOfDays" style={{ fontWeight: "500" }}>
             Number of days<sup className="text-danger">*</sup>
              </label>
              <input name={noOfDays} id="noOfDays" value={noOfDays} disabled/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="firstPaymentDate" style={{ fontWeight: "500" }}>
              First payment date<sup className="text-danger">*</sup>
              </label>
              <input name="firstPaymentDate" required type='date' onChange={(e)=>setFirstPaymentDate(e.target.value)}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="maturityDate" style={{ fontWeight: "500" }}>
                Maturity date<sup className="text-danger">*</sup>
              </label>
              <Field name="maturityDate" value={new Date(maturityDate).toLocaleDateString('en-CA')}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="loanSource" style={{ fontWeight: "500" }}>
                Loan source<sup className="text-danger">*</sup>
              </label>
              <Field name="loanSource" required as='select'>
                <option value="">Select</option>
                {
                  loanSources.map(source=>(
                    <option value={source.loanSourceId} key={source.loanSourceId}>{source.loanSourceName}</option>
                  ))
                }
                </Field>
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="loanPurpose" style={{ fontWeight: "500" }}>
                Loan purpose<sup className="text-danger">*</sup>
              </label>
              <Field name="loanPurpose" required />
            </div>
          </div>
          <div className="admin-task-forms px-3 mt-1 mb-2">
            <div>
            <label htmlFor="">Search guarantor's name<sup className="text-danger">*</sup> </label>
        <Multiselect
      data={guarantors}
      textField='employeeName'
      name={data}
      onChange={(value) => {
        setData(value.map((val) => val.employeeId));
      }}
          placeholder="Search for a guarantor's name"        
        />
      </div>
      </div>
      <div
          className="d-flex justify-content-end gap-3 py-4 px-2"
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 15px 15px" }}
        >
          <button
            className="btn btn-md text-white rounded-5"
            style={{ backgroundColor: "var(--custom-color)" }}
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
      </div>
          </Form>
        </Formik>
        
      <ToastContainer/>
    </>
  );
};

export default LoanApplication;
