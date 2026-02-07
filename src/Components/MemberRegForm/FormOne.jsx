import React, { useEffect, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import ErrorText from '../agentForms/ErrorText'
import { Link } from 'react-router-dom'
import axios from '../axios'

const FormOne = () => {

const [cooperatives, setCooperatives] = useState([])

const fetchCooperatives =()=>{
  axios('Common/cooperatives')
  .then(resp=>setCooperatives(resp.data))
}
useEffect(()=>{
  fetchCooperatives()
}, [])

  return (
    <> 
    <div style={{ width: "100%" }} className="inputs-container ">
    <label htmlFor="cooperative" className="mb-1">
      Cooperative <sup className="text-danger fw-bold">*</sup>
    </label>
    <br />
    <Field
    as='select'
      type="text"
      name="cooperative"
      required
      className="w-100"
    > 
    <option value=""disabled>Select</option>
    {
      cooperatives.map((cooperative)=>(
        <option value={cooperative.id} key={cooperative.id}>{cooperative.name}</option>
      ))
    }
    </Field>
 <ErrorMessage name='cooperative' component={ErrorText}/>
  </div>
    <div style={{ width: "100%" }} className="inputs-container">
      <label htmlFor="regNumber" className="mb-1">
      Registration Number <sup className="text-danger fw-bold">*</sup>
      </label>
      <br />
      <Field
        name="regNumber"
        placeholder="Enter your registration Number"
        className="w-100"
      />
   <ErrorMessage name='regNumber' component={ErrorText}/>
    </div>
  <div className="text-center mt-3">
    <Field type="radio" name="terms" id='terms' value={true} className='text-dark'/> 
    <span> Agree to <Link to='/'> terms </Link>and <Link to='/'>conditions</Link></span>
    <ErrorMessage name='terms' component={ErrorText}/>
  </div>
  </>
  )
}

export default FormOne
