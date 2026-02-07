import React, { useContext, useEffect, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import ErrorText from '../ErrorText'
import axios from '../../axios';
import { UserContext } from '../../AuthContext';
import { NumericFormat } from 'react-number-format';
import { Formik, Form } from "formik";

const IndividualMemberRegistration = ({
    validationSchema,
    initialValues,
    onSubmit,
    isLogin,
    setIsLogin,
    memberType,
    setMemberType,
    inputHandler
  }) => {
    const [memberTypes, setMemberTypes]= useState([])
    const [genders, setGenders]= useState([])
    const [sectors, setSectors]= useState([])
    const [products, setProducts]= useState([])
    const [states, setStates]= useState([])
    const [residentStates, setResidentStates]= useState([])
    const [towns, setTowns]= useState([])
    const [titles, setTitles]= useState([])
    const [idTypes, setIdTypes]= useState([])
    const [nationalities, setNationalities]= useState([])
    const [text, setText]= useState({})
  const {credentials} = useContext(UserContext)
  
  const changeHandler = (e)=>{
    const name =e.target.name;
    const value =e.target.value;
    setText({...text, [name]:value})
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
  const getTitles=()=>{
    axios('MemberManagement/get-title', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp)=>setTitles(resp.data.data))
  }
  const getSectors=()=>{
    axios('MemberManagement/get-sector', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setSectors(resp.data.data))
  }
  const getProducts=()=>{
    axios('MemberManagement/get-products', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setProducts(resp.data.data))
  }
  const getIdTypes=()=>{
    axios('MemberManagement/get-identification-type', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setIdTypes(resp.data.data))
  }
  const getResidentStates=()=>{
    axios('MemberManagement/get-states', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setResidentStates(resp.data.data))
  }
  const getStates=()=>{
    axios('MemberManagement/get-states', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setStates(resp.data.data))
  }
  const getNationalities=()=>{
    axios('MemberManagement/get-nationalities', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setNationalities(resp.data.data))
  }
  
  
  const getGenders=()=>{
    axios('MemberManagement/get-gender', {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>setGenders(resp.data.data))
  }
  const getTowns=()=>{
    axios(`Common/get-town-by-state-code?StateCode=${text?.residentState}`, {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>setTowns(resp.data))
  }
  useEffect(()=>{
  getMemberTypes()
  getGenders()
  getSectors()
  getTitles()
  getProducts()
  },[])
  
  useEffect(()=>{
  getNationalities()
  getStates()
  getIdTypes()
  getResidentStates()
  },[])
  
  useEffect(()=>{
    getTowns()
  }, [text?.residentState])
  
    return (
      <>
    <Formik
    validationSchema={validationSchema}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {({ values, setFieldValue }) => (
      <Form style={{border:'solid 1px #fafafa', borderRadius:'15px'}}>
        <div className="d-flex gap-3 px-3 mt-3">
          <span className={memberType === 'individual' ? `active-selector ${'header-links'}` : "header-links"}
          onClick={()=>setMemberType('individual')}>Individual</span>
          <span className={memberType === 'corporate' ? `active-selector ${'header-links'}` : "header-links"}
          onClick={()=>setMemberType('corporate')}>Corporate</span>
        </div>
      <div className='d-flex flex-column gap-2' >
        <div className='admin-task-forms px-3'>
        <h6 style={{fontSize:'18px'}}>Member Details</h6>
        <div></div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="memberId">Member ID<sup className='text-danger'>*</sup></label>
          <Field name='memberId' />
          <ErrorMessage name='memberId' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="firstName">First Name<sup className='text-danger'>*</sup></label>
          <Field name='firstName' placeholder='First name'/>
          <ErrorMessage name='firstName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="lastName">Last Name<sup className='text-danger'>*</sup></label>
          <Field name='lastName' placeholder='Last name'/>
          <ErrorMessage name='lastName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="middleName">Middle Name</label>
          <Field name='middleName' placeholder='Abiola'/>
          <ErrorMessage name='middleName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="dob">Date of Birth<sup className='text-danger'>*</sup></label>
          <Field name='dob' type='date'/>
          <ErrorMessage name='dob' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="gender">Gender<sup className='text-danger'>*</sup></label>
          <Field name='gender' as='select'>
            <option value="">Select</option>
            {
              genders?.map((gender)=>(
                <option value={gender.sexId} key={gender.sexId}>{gender.sexname}</option>
              ))
            }
            </Field>
          <ErrorMessage name='gender' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="dateJoined">Date Joined</label>
          <Field name='dateJoined' type='date'/>
          <ErrorMessage name='dateJoined' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="nationality">Nationality</label>
          <Field name='nationality' as='select'>
            <option value="">Select</option>
            {
              nationalities.map((nation)=>(
                <option value={nation.country_id} key={nation.country_id}>{nation.countryname}</option>
              ))
            }
            </Field>
          <ErrorMessage name='nationality' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="stateOfOrigin">State of Origin</label>
          <Field name='stateOfOrigin' as='select'>
            <option value="">Select</option>
            {
              states.map((state)=>(
                <option value={state.stateCode} key={state.stateCode}>{state.stateName}</option>
              ))
            }
            </Field>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="sector">Sector</label>
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
          <label htmlFor="memberImage">Member Image</label>
          <input name='memberImage' type='file' onChange={(e)=>{
            setFieldValue('memberImage', e.target.files[0])
        }}/>
          <ErrorMessage name='memberImage' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="title">Title</label>
          <Field name='title' as='select' required>
            <option value="">Select</option>
            {
              titles?.map((title)=>(
                <option value={title.code} key={title.name}>{title.name}</option>
              ))
            }
            </Field>
          <ErrorMessage name='title' component={ErrorText}/>
        </div>
        </div>
  
        <h6 style={{fontSize:'18px', marginTop:'15px', paddingInline:'20px'}}>Contact Details</h6>
        <div className="admin-task-forms px-3">
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="residentState">Resident State</label>
          <select name='residentState' as='select' onChange={changeHandler}>
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
          <label htmlFor="residentTown">Town</label>
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
          <label htmlFor="residentAddress">Resident Address<sup className='text-danger'>*</sup></label>
          <Field name='residentAddress' as='textarea'/>
          <ErrorMessage name='residentAddress' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="officeAddress">Office Address</label>
          <Field name='officeAddress' as='textarea'/>
          <ErrorMessage name='officeAddress' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="phone1">Phone Number1<sup className='text-danger'>*</sup></label>
          <Field name='phone1' placeholder='08131215178'/>
          <ErrorMessage name='phone1' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="phone2">Phone Number2</label>
          <Field name='phone2' placeholder='08131215178'/>
          <ErrorMessage name='phone2' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="officePhone">Office Phone Number</label>
          <Field name='officePhone' placeholder='08131215178'/>
          <ErrorMessage name='officePhone' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="email">Email Address<sup className='text-danger'>*</sup></label>
          <Field name='email' placeholder='fifthlab@gmail.com'/>
          <ErrorMessage name='email' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="idType">Identification Type</label>
          <Field name='idType' as='select'>
            <option value="">Select</option>
            {
              idTypes?.map((type)=>(
                <option value={type.idCardId} key={type.idCardId}>{type.idCardName}</option>
              ))
            }
            </Field>
          <ErrorMessage name='idType' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="idNumber">Identification Number</label>
          <Field name='idNumber' />
          <ErrorMessage name='idNumber' component={ErrorText}/>
        </div>
        <div className='col-lg-4  col-md-6  col-md-6 w-100'>
          <label htmlFor="uploadId">ID Card Upload</label>
          <input name='uploadId' className='w-100' type='file' onChange={(e)=>{
            setFieldValue('uploadId', e.target.files[0])
            }}/>
          <ErrorMessage name='uploadId' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="bvn">BVN</label>
          <Field name='bvn' placeholder='22332093876'/>
          <ErrorMessage name='bvn' component={ErrorText}/>
        </div>
        </div>
        <h6 style={{fontSize:'18px', marginTop:'15px', paddingInline:'20px'}}>Next of Kin Details</h6>
        <div className="admin-task-forms px-3">
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="nofName">Next Of Kin Name</label>
          <Field name='nofName' placeholder='Happiness Obimdi'/>
          <ErrorMessage name='nofName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="nofPhone">Next of kin phone</label>
          <Field name='nofPhone' placeholder='08123456789'/>
          <ErrorMessage name='nofPhone' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="nofAddress">Next of kin Address</label>
          <Field name='nofAddress' as='textarea'/>
          <ErrorMessage name='nofAddress' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="nofRelationship">Relationship with Next of kin</label>
          <Field name='nofRelationship' />
          <ErrorMessage name='nofRelationship' component={ErrorText}/>
        </div>
        </div>
        <div className="statutory-list px-3">
        <div className='d-flex gap-2 align-items-center' style={{height:'1rem'}}>
          <label htmlFor="isLogin">Enter Login Details?</label> 
          <input name='isLogin' type='checkbox' onChange={handleChange}/>
        </div>
        <div></div>
        </div>
        <div className="admin-task-forms px-3">
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
        <h6 style={{fontSize:'18px', marginTop:'15px'}}>Account Section</h6>
        <div></div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="acctBranch">Account Branch<sup className='text-danger'>*</sup></label>
          <Field name='acctBranch' as='select'>
            <option value="">Select</option>
            <option value="001">Head Office</option>
            </Field>
          <ErrorMessage name='acctBranch' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="acctProduct">Account Product<sup className='text-danger'>*</sup></label>
          <Field name='acctProduct' as='select'>
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
          <Field name='acctDesc' />
          <ErrorMessage name='acctDesc' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="contributionAmount">Contribution Amount<sup className='text-danger'>*</sup></label>
          <NumericFormat name='contributionAmount' placeholder='30000' thousandSeparator={true}
           fixedDecimalScale={true} decimalScale={2} onChange={inputHandler}/>
        </div>
        </div>
        <h6 style={{fontSize:'18px', marginTop:'15px', paddingInline:'20px'}}>Reg. Fee Details</h6>
        <div className="admin-task-forms px-3">
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
          <NumericFormat name='amount' placeholder='30,000'
           thousandSeparator={true} fixedDecimalScale decimalScale={2} onChange={inputHandler}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="tellerNo">Teller No</label>
          <Field name='tellerNo' />
          <ErrorMessage name='tellerNo' component={ErrorText}/>
        </div>
        </div>
        <h6 style={{fontSize:'18px', marginTop:'15px', paddingInline:'20px'}}>Referral Details</h6>
        <div className="admin-task-forms px-3">
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="refName">Referral Name</label>
          <Field name='refName' placeholder='Bamidele Ojekunle'/>
          <ErrorMessage name='refName' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="refPhone">Referral Phone Number</label>
          <Field name='refPhone' placeholder='08131215178'/>
          <ErrorMessage name='refPhone' component={ErrorText}/>
        </div>
        <div className='d-flex flex-column gap-1'>
          <label htmlFor="refAddress">Referral Address</label>
          <Field name='refAddress' placeholder='35, Oniru Lagos'/>
          <ErrorMessage name='refAddress' component={ErrorText}/>
        </div>
      </div>
      </div>
      <div className="d-sm-flex justify-content-end gap-4 mt-4 p-4"
       style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
          <button
            className="rounded-4 border-0 px-3 py-1 btn-md"
            style={{ backgroundColor: "#ddf" }}
            type="reset"
          >
            Discard
          </button>
          <button className="btn-md px-3 border-0 member" type="submit">
            Save
          </button>
        </div>
      </Form>
    )}
      </Formik>
      </>
      )
}

export default IndividualMemberRegistration
