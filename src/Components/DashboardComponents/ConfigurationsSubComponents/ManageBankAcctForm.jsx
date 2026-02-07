import React from 'react'
import { ErrorMessage, Field } from 'formik'
import ErrorText from '../../agentForms/ErrorText'

const ManageBankAcctForm = () => {
  return (
    <div className='row g-2'>
    <div className="col-md-6 inputs-container">
        <label htmlFor="" className='mb-1'>Account Number</label> <sup className='text-danger'>*</sup> <br />
      <Field name='accountNumber' id='accountNumber' className='w-100' as='select'>
        <option value="">Select</option>
        <option value="4337289018">4337289018</option>
        <option value="0938729383">0938729383</option>
        </Field>
      <ErrorMessage name='accountNumber' component={ErrorText}/>
      </div>
      <div className="col-md-6 inputs-container">
        <label htmlFor="" className='mb-1'>Select Bank</label> <sup className='text-danger'>*</sup> <br />
      <Field name='bank' id='bank' className='w-100' as='select'>
        <option value="">Select Bank</option>
        <option value="FCMB">F.C.M.B</option>
        <option value="JAIZ">JAIZ</option>
        </Field>
      <ErrorMessage name='bank' component={ErrorText}/>
      </div>
      <div className="col-md-6 inputs-container">
        <label htmlFor="" className='mb-1'>Account Name</label> <sup className='text-danger'>*</sup> <br />
      <Field name='accountName' id='accountName' className='w-100' as='select'>
        <option value="">Select</option>
        <option value="Opeloyeru">Opeloyeru</option>
        <option value="Erundupe">Erundupe</option>
        </Field>
      <ErrorMessage name='accountName' component={ErrorText}/>
      </div>
    </div>
  )
}

export default ManageBankAcctForm
