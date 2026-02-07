import React, { useContext, useEffect, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { Formik, Form, ErrorMessage, Field, FastField } from 'formik'
import ErrorText from '../ErrorText'
import * as Yup from 'yup'
import { NumericFormat } from 'react-number-format'

const CorporateMemberRegistration = ({memberType, setMemberType,}) => {
const {credentials}= useContext(UserContext)
const [memberTypes, setMemberTypes]= useState([])
const [residentStates, setResidentStates]= useState([])
const [sectors, setSectors]= useState([])
const [towns, setTowns]= useState([])
const [residentState, setResidentState]= useState('')
const [guidNo, setGuidNo]= useState('')
const [products, setProducts]= useState([])
const [isLogin, setIsLogin]= useState(false)




const getGuidNo= async()=>{
    await axios('Common/get-member-signatory-number', {headers:{
        Authorization: `Bearer ${credentials.token}`}
    }).then(resp=>setGuidNo(resp.data.batchNo))}


const getSectors =()=>{
    axios('MemberManagement/get-sector', {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setSectors(resp.data.data))
}
const getResidentStates=()=>{
    axios('MemberManagement/get-states', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setResidentStates(resp.data.data))
  }
   const getTowns=()=>{
      axios(`Common/get-town-by-state-code?StateCode=${residentState}`, {headers:{
        Authorization:`Bearer ${credentials.token}`
      }}).then(resp=>setTowns(resp.data))
    }
     
  const handleChange=(e)=>{
    setIsLogin(e.target.checked)
    }

const getMemberTypes=()=>{
    axios('MemberManagement/member-type', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setMemberTypes(resp.data)
    })
  }
    const getProducts=()=>{
      axios('MemberManagement/get-products', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setProducts(resp.data.data))
    }
  useEffect(()=>{
    getMemberTypes()
    getSectors()
    getResidentStates()
    getProducts()
    getGuidNo()
  }, [])
  useEffect(()=>{
    getTowns()
  },  [residentState])

const initialValues={
corporateName:'',
sector:'', 
residentState:'',
regDate:'',
regNo:'',
residentTown:'',
address:'', 
memberStrength:'',
fundSource:'',
town:'',
bvn:'',
email:'',
phone:'',
businessObjective:''

}
const validationSchema= Yup.object({
    corporateName: Yup.string().required(),
    sector: Yup.string(), 
    residentState: Yup.string(),
    regDate: Yup.string(),
    regNo: Yup.string(),
    residentTown: Yup.string(),
    address: Yup.string(),
    memberStrength: Yup.string(),
    fundSource: Yup.string(),
    town: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().required(),
    bvn: Yup.string(),
    businessObjective: Yup.string(),
    password: Yup.string(),
    confirmPassword: Yup.string(), 
    tellerNumber: Yup.string(),
    userName:Yup.string(),
    bank: Yup.string(),

})
const onSubmit=(values)=>{
    const payload={
CorporateName: values.corporateName,
RegisterNumber: values.regNo,
DateOfRegistration: values.regDate,
State: residentState,
Town: values.residentTown, 	
ContactAddress: values.address,
Sector: values.sector,
BusinessObjective: values.businessObjective,
SourceOfFunding: values.fundSource,
MemberStrength: Number(values.memberStrength),
BVN: values.bvn,
PhoneNumber: values.phone,
Email: values.email,	
Branch: '001',
AccountProduct: values.accountProduct,
AccountDescription: values.accountDescription,
SubBranch: '',
MonthlyContribution: Number(values.contributionAmount),
AccountNumber: values.accountNumber,
PaymentBank: values.bank,
Amount: Number(values.amount),
TellerNumber: values.tellerNumber,
HasLoginDetail: isLogin,
UserName: values.userName,
Password: values.password,
ConfirmPassword: values.confirmPassword,	
GuidNo: guidNo
}
    axios.post('MemberManagement/add-cooperate-member-registration', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}


  return (
    <>
     <Formik
    validationSchema={validationSchema}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
      <Form style={{border:'solid 1px #fafafa',}}>
        <div className="d-flex gap-3 px-3 mt-3">
          <span className={memberType === 'individual' ? `active-selector ${'header-links'}` : "header-links"}
          onClick={()=>setMemberType('individual')}>Individual</span>
          <span className={memberType === 'corporate' ? `active-selector ${'header-links'}` : "header-links"}
          onClick={()=>setMemberType('corporate')}>Corporate</span>
        </div>
      <div className='d-flex flex-column gap-2' >
        <div className='admin-task-forms px-3'>
        <h6 style={{fontSize:'18px'}}>Corporate Details</h6>
        <div></div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="corporateName">Contact Name<sup className='text-danger'>*</sup></label>
          <Field name='corporateName' placeholder='Corporate name'/>
          <ErrorMessage name='corporateName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="regNo">Registration No<sup className='text-danger'>*</sup></label>
          <Field name='regNo' />
          <ErrorMessage name='regNo' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="regDate">Date of Registration<sup className='text-danger'>*</sup></label>
          <Field name='regDate' type='date'/>
          <ErrorMessage name='regDate' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="residentState">State<sup className='text-danger'>*</sup></label>
          <select name='residentState' as='select' onChange={(e)=>setResidentState(e.target.value)}>
            <option value="">Select</option>
            {
              residentStates?.map((state)=>(
                <option value={state.stateCode} key={state.stateCode}>{state.stateName}</option>
              ))
            }
            </select>
          <ErrorMessage name='residentState' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="residentTown">Town<sup className='text-danger'>*</sup></label>
          <Field name='residentTown' as='select'>
            <option value="">Select</option>
            {
              towns?.map((town)=>(
                <option value={town.townCode} key={town.townCode}>{town.townName}</option>
              ))
            }
            </Field>
          <ErrorMessage name='residentTown' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="address">Contact address<sup className='text-danger'>*</sup></label>
          <Field name='address' as='textarea'/>
          <ErrorMessage name='address' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="businessObjective">Business objective</label>
          <Field name='businessObjective' as='textarea'/>
          <ErrorMessage name='businessObjective' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="sector">Sector<sup className='text-danger'>*</sup></label>
          <Field name='sector' as='select'>
            <option value="">Select</option>
            {
              sectors?.map((sector)=>(
                <option value={sector.sectorcode} key={sector.sectorcode}>{sector.sectorname}</option>
              ))
            }
            </Field>
          <ErrorMessage name='sector' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="fundSource">Source of funding</label>
          <Field name='fundSource'/>
          <ErrorMessage name='fundSource' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="memberStrength">Member strength</label>
          <Field name='memberStrength'/>
          <ErrorMessage name='memberStrength' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="phone">Phone number</label>
          <Field name='phone'/>
          <ErrorMessage name='phone' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="bvn">B.V.N</label>
          <Field name='bvn'/>
          <ErrorMessage name='bvn' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="email">Email<sup className="text-danger">*</sup> </label>
          <Field name='email'/>
          <ErrorMessage name='email' component={ErrorText}/>
        </div>
        </div>
        <div className="statutory-list px-3">
        <div className='d-flex gap-2 align-items-center'>
          <label htmlFor="isLogin">Has Login Details?</label> 
          <input name='isLogin' type='checkbox' onChange={handleChange}/>
        </div>
        <div></div>
        { isLogin &&
       ( <>
         <div className='d-flex flex-column gap-1'>
          <label htmlFor="userName">User Name<sup className='text-danger'>*</sup></label>
          <Field name='userName' placeholder='User28'/>
          <ErrorMessage name='userName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="password">Password</label>
          <Field name='password' type='password'/>
          <ErrorMessage name='password' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field name='confirmPassword' type='password'/>
          <ErrorMessage name='confirmPassword' component={ErrorText}/>
        </div>
        </>
        )}
        {isLogin && <div></div>}
        </div>
       
        <div className="admin-task-forms px-3">
        <h6 style={{fontSize:'18px'}}>Account Creation Section</h6>
        <div></div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="acctBranch">Account Branch<sup className='text-danger'>*</sup></label>
          <Field name='acctBranch' as='select'>
            <option value="">Select</option>
            <option value="001">Head Office</option>
            {/* {
            branches?.map((branch)=>(
            <option value={branch.branchCode} key={branch.branchCode}>{branch.branchName}</option>
            ))
            } */}
            </Field>
          <ErrorMessage name='acctBranch' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="accountProduct">Account Product<sup className='text-danger'>*</sup></label>
          <Field name='accountProduct' as='select'>
            <option value="">Select</option>
            {
              products?.map((product)=>(
                <option value={product.productCode} key={product.productCode}>{product.productName}</option>
              ))
            }
          </Field>
          <ErrorMessage name='acctProduct' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="acctDesc">Account Description<sup className='text-danger'>*</sup></label>
          <Field name='accountDescription' />
          <ErrorMessage name='accountDescription' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="contributionAmount">Contribution Amount<sup className='text-danger'>*</sup></label>
          <Field name='contributionAmount' placeholder='30000' 
        //   thousandSeparator={true} fixedDecimalScale={true} decimalScale={2}
          />
        </div>
        </div>
        
        <div className="admin-task-forms px-3">
        <h6 style={{fontSize:'18px'}}>Reg. Fee Details</h6>
        <div></div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="acctNo">Account Number</label>
          <Field name='acctNo' placeholder='4337611011'/>
          <ErrorMessage name='acctNo' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="paymentBank">Payment Bank</label>
          <Field name='paymentBank' placeholder='GTBank'/>
          <ErrorMessage name='paymentBank' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="amount">Amount</label>
          <Field name='amount' placeholder='30,000'
        //    thousandSeparator={true} fixedDecimalScale decimalScale={2}
           />
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="tellerNo">Teller No</label>
          <Field name='tellerNo' />
          <ErrorMessage name='tellerNo' component={ErrorText}/>
        </div>
        </div>
        </div>
        <div className="d-flex justify-content-end gap-3 p-3 mt-3" style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
            <button type='reset' className='btn-md px-3 rounded-5 border-0'>Discard</button>
            <button type='submit' className='border-0 member btn-md'>Submit</button>
        </div>
        </Form>
        </Formik>
       
        <ToastContainer/>
    </>
  )
}

export default CorporateMemberRegistration
