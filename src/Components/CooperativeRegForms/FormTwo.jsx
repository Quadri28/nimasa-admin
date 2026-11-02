import React, { useState, useEffect, } from 'react'
import { Field, ErrorMessage } from 'formik'
import ErrorText from '../agentForms/ErrorText'
import axios from "../axios";

const FormTwo = ({form}) => {

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])

  const getCountries=()=>{
    axios('Common/countries').then((resp)=>{
      setCountries(resp.data)
    })
  }

  const getStatesById = async ()=>{
    await axios(`Common/get-states-by-countryId?countryCode=${form.values.country}`)
    .then((resp)=>{
      setStates(resp.data)
    })
  }
  console.log(form.values)

  useEffect(()=>{
    getCountries()
  }, [])

  useEffect(()=>{
    getStatesById()
  }, [form.values.country])
  return (
    <>
    <div className='inputs-container'>
     <label htmlFor="email">Cooperative Email Address<sup className="text-danger fw-bold">*</sup></label>
     <Field className='w-100' name='email' id='email' placeholder='user@gmail.com'/>
     <ErrorMessage name='email' component={ErrorText}/>
    </div>
    <div className='inputs-container'>
     <label htmlFor="phone">Cooperative Phone No<sup className="text-danger fw-bold">*</sup></label>
     <Field className='w-100' name='phone' id='phone'  placeholder='08123456789'/>
     <ErrorMessage name='phone' component={ErrorText}/>
    </div>
    <div className="inputs-container  mb-2">
      <label required htmlFor="country" className="mb-1">
        Select Cooperative Country<sup className="text-danger fw-bold">*</sup>
      </label>
      <Field name='country' id='country' as='select' className="w-100"> 
      <option value="" disabled>Select Country</option>
      { 
          countries.map((country)=>(
            <option value={country.countryCode} key={country.countryCode}>{country.countryName}</option>
          ))
      }
      </Field>
      <ErrorMessage name='country' component={ErrorText}/>
    </div>
    <div className="inputs-container mb-2">
        <label htmlFor="cooperativeLocation" className='mb-1'>Select Cooperative Location<sup className="text-danger fw-bold">*</sup></label>
        <Field name='cooperativeLocation' id='cooperativeLocation' as='select' className='w-100'> 
        <option value="">Select State</option>
        {
          states.map((state)=>(
            <option value={state.stateCode} key={state.stateCode}>{state.stateName}</option>
          ))
        }
        </Field>
      <ErrorMessage name="cooperativeLocation" component={ErrorText} />
    </div>
    </>
  )
}

export default FormTwo
