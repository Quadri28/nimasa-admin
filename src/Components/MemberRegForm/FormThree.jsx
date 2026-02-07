import React, { useEffect, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import ErrorText from '../agentForms/ErrorText'
import axios from '../axios'

const FormThree = ({form}) => {

const [countries, setCountries] = useState([])
const [states, setStates] = useState([])


const getCountries=()=>{
  axios('Common/countries')
  .then(resp=> setCountries(resp.data))
}

const getStates=()=>{
  axios(`Common/get-states-by-countryId?countryId=${form.values.residentialCountry}`)
  .then(resp=>setStates(resp.data))
}

useEffect(()=>{
  getCountries()
}, [])

useEffect(()=>{
  getStates()
}, [form.values.residentialCountry])

  return (
    <>
    <div style={{ width: "100%" }} className="inputs-container ">
      <label htmlFor="address" className="mb-1">
        Address <sup className="text-danger fw-bold">*</sup>
      </label>
      <br />
      <Field
        type="text"
        name="address"
        placeholder="Enter your address"
        className="w-100"
      />
      <ErrorMessage name="address" component={ErrorText} />
    </div>
    <div style={{ width: "100%" }} className="inputs-container">
      <label htmlFor="residentialCountry" className="mb-1">
        Residential Country
      </label>
      <br />
      <Field
        name="residentialCountry"
        as='select'
        placeholder="Select your country"
        className="w-100"
      >
        <option value="" disabled>Select Country</option> 
        {
          countries.map(country=> (
            <option value={country.id} key={country.id}>{country.name}</option>
          ))
        } 
       </Field>
      <ErrorMessage name="residentialCountry" component={ErrorText} />
    </div>
    <div style={{ width: "100%" }} className="inputs-container">
      <label htmlFor="state" className="mb-1">
        State <sup className="text-danger fw-bold">*</sup>
      </label>
      <br />
      <Field
        name="state"
        as='select'
        placeholder="Select your state"
        className="w-100"
      > 
      <option value="" disabled> Select State</option>
     {
          states.map(state=>(
          <option key={state.id} value={state.id}>{state.name}</option>
          ))
     }
      </Field>
      <ErrorMessage name="state" component={ErrorText} />
    </div>
    <div style={{ width: "100%" }} className="inputs-container">
      <label htmlFor="residentialState" className="mb-1">
        Residential State <sup className="text-danger fw-bold">*</sup>
      </label>
      <br />
      <Field
        name="residentialState"
        placeholder="Enter your residential state"
        className="w-100"
      />
      <ErrorMessage name="residentialState" component={ErrorText} />
    </div>
    </>
  )
}

export default FormThree
