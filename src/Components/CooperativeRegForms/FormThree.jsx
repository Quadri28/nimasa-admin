import React from 'react'
import { Field, ErrorMessage } from 'formik'
import ErrorText from '../agentForms/ErrorText'
import { Link } from 'react-router-dom'

const FormThree = () => {
  return (
    <>
       <div className='inputs-container  mb-1'>
              <label htmlFor="contactPerson">Full Name of Contact person<sup className="text-danger fw-bold">*</sup></label>
           <Field className='w-100' name='contactPerson' id='contactPerson' 
           placeholder='Enter contact person full name'/>
           <ErrorMessage name='contactPerson' component={ErrorText}/>
          </div>
          <div className='inputs-container'>
        <label htmlFor="designation">Contact Person designation<sup className="text-danger fw-bold">*</sup></label>
     <Field className='w-100' name='designation' id='designation' placeholder='Enter designation'/>
     <ErrorMessage name='designation' component={ErrorText}/>
    </div>
    <div className='inputs-container'>
        <label htmlFor="contactPersonAlternativeEmail">Contact Person Email<sup className="text-danger fw-bold">*</sup></label>
     <Field className='w-100' name='contactPersonAlternativeEmail' id='contactPersonAlternativeEmail'  placeholder='user2@gmail.com'/>
     <ErrorMessage name='contactPersonAlternativeEmail' component={ErrorText}/>
    </div>
    <div className='inputs-container'>
        <label htmlFor="contactPersonAlternativeEmail1">Contact person phone<sup className="text-danger fw-bold">*</sup></label>
     <Field className='w-100'  placeholder='08131215177' name='contactPersonAlternativeEmail1' id='contactPersonAlternativeEmail1' 
    />
     <ErrorMessage name='contactPersonAlternativeEmail1' component={ErrorText}/>
    </div>
    <div className='inputs-container'>
        <label htmlFor="agentName">Referer Name</label>
     <Field className='w-100' name='agentName' id='agentName' placeholder='Agent name'/>
     <ErrorMessage name='agentName' component={ErrorText}/>
    </div>
    <div className="text-center mt-2">
        <label htmlFor="terms">
          <Field name="terms" id="terms" type="checkbox" /> Agree to <Link to='/agreement'
          style={{textDecoration:'none'}}>terms & conditions</Link>
        </label>
        <ErrorMessage name="terms" component={ErrorText} />
      </div>
    </>
  )
}

export default FormThree
