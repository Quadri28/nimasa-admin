import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from '../../axios'
import { ToastContainer, toast } from 'react-toastify'
import ErrorText from '../ErrorText'
import { UserContext } from '../../AuthContext'
import { Combobox } from 'react-widgets/cjs'

const AccountReactivation = () => {
const {credentials}= useContext(UserContext)
const [reactivateAccountNumbers, setReactivateAccountNumbers] = useState({})
const [accountNumber, setAccountNumber] = useState('')
const [accts, setAccts] = useState([])

const getAccts=()=>{
    axios('MemberManagement/account-enquiry', {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setAccts(resp.data.data))
}
const reactivateAccount =()=>{
  axios(`MemberManagement/account-reactivation-account-number-text-changed?AccountNumber=${accountNumber}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setReactivateAccountNumbers(resp.data.data.bankAccount))
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

const initialValues={
    valueDate: "",
    narration: ""
}
useEffect(()=>{
getAccts()
},[])

useEffect(()=>{
  if (accountNumber) {
  reactivateAccount()
  }
},[accountNumber])

const validationSchema= Yup.object({
    valueDate: Yup.string().required().label('Value Date'),
})
const onSubmit=(values)=>{
    const payload ={
        accountNumber: accountNumber,
        valueDate: values.valueDate,
        narration: reactivateAccountNumbers.narration
    }
axios.post('MemberManagement/account-reactivation', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
}}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true}))
.catch(error=>toast(error.response.data.message, {type:'error', autoClose:false, pauseOnHover:true}))
}

 const formattedInfo = accts.map((e) => ({
    ...e,
    label: `${e.fullName} >> ${e.accountNumber}`,
  }));
  return (
    <div
    style={{
      border: "solid 1px #f7f4fa",
      borderRadius: "10px",
      marginTop: "1.5rem",
    }}
  >
    <div
      style={{ backgroundColor: "#F5F9FF", borderRadius: "10px 10px 0 0" }}
      className="p-3"
    >
      <h5>Account Reactivation</h5>
    </div>
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="admin-task-forms px-3  mt-3">
           <div className="d-flex flex-column gap-1 ">
                       <label htmlFor="accountNumber">Account Number:</label>
                       <Combobox
                         data={formattedInfo}
                         value={accountNumber}
                         valueField="accountNumber"
                         textField="label" 
                         filter="contains"
                         onChange={(val) => {
                           if (val && typeof val === "object") {
                             setAccountNumber(val.accountNumber);
                           } else {
                             setAccountNumber(val); 
                           }
                         }}
                       />
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="valueDate">Value Date:</label>
            <Field name="valueDate" type='date' />
            <ErrorMessage name="valueDate" component={ErrorText}/>
          </div>
        </div>
        <div className="px-3 pt-2">
        <div className="d-flex flex-column gap-1 ">
            <label htmlFor="narration">Narration:</label>
            <Field name="narration" as='textarea' value={reactivateAccountNumbers.narration}
            style={{
              outlineColor:  '#69A4FC',
              outlineWidth: '.2px',
              border: 'none',
              backgroundColor: '#F5F5F5',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '14px',
            }}/>
            <ErrorMessage name="narration" component={ErrorText}/>
          </div>
        </div>
        <div className="my-3 px-3">
              <div
                className="d-flex flex-column gap-1 gap-2 p-0"
                style={{
                  boxShadow: "3px 3px 3px 3px #ddd",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EDF4FF",
                    paddingTop: "10px",
                    paddingInline: "15px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <p>Debit Account Info</p>
                </div>
                <div className="px-3 py-2 d-flex flex-column gap-1 gap-2">
                  <div className="d-flex gap-3 discourse">
                    <span>Account Name:</span>
                    <p>{reactivateAccountNumbers?.accountName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Product Name:</span>
                    <p>{reactivateAccountNumbers?.productName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Branch:</span>
                    <p>{reactivateAccountNumbers?.branch}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Book Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(reactivateAccountNumbers?.bookBalance)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Effective Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(reactivateAccountNumbers?.effectiveBalance)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Usable Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(reactivateAccountNumbers?.usableBalance)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Source Type:</span>
                    <p>{reactivateAccountNumbers?.sourceType}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Source:</span>
                    <p>{reactivateAccountNumbers?.source}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Account Status:</span>
                    <p>{reactivateAccountNumbers?.accountStatus}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Total Charge</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(reactivateAccountNumbers?.totalCharge)}</p>
                  </div>
                </div>
              </div>
            </div>

        <div className="d-flex gap-3 justify-content-end p-3 mt-5"
         style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 10px 10px', fontSize:'13px'}}>
          <button type='reset' className="border-0 px-4 rounded-4 btn-md" style={{backgroundColor:'#f7f4fa'}}>Reset</button>
          <button type="submit" className="border-0 btn-md member">Submit</button>
        </div>
      </Form>
    </Formik>
    <ToastContainer/>
  </div>
  )
}

export default AccountReactivation
