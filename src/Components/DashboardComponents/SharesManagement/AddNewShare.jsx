import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from '../../../Components/axios'
import {UserContext} from '../../../Components/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import ErrorText from '../ErrorText'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'


const AddNewShareType = () => {
    const {credentials}= useContext(UserContext)
    const [sharesCode, setShareCode]= useState('')
    const [ledgers, setLedgers]= useState([])
  const getShareCode=()=>{
    axios('ShareManagement/share-code', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setShareCode(resp.data.data.shareCode))
  }
  const fetchLedgerAccounts = () => {
      axios("Acounting/general-ledger-customer-enquiry?SearchOption=1", {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }).then((resp) => setLedgers(resp.data.data));
    };
useEffect(()=>{
getShareCode()
fetchLedgerAccounts()
},[])

    const initialValues={
      shareProductName:'',
      maximumWithdrawalPercentage:'',
      noOfShares:'',
      sharePrice:'',
      description:'',
      shareGl:'',
      lockShareWithdrawal: false
    }
    const validationSchema= Yup.object({
      shareProductName: Yup.string().required().label('Shares product name'),
      maximumShareUnit: Yup.string().required().label('Max. percentage'),
      noOfShares: Yup.string().required().label('No of shares'),
      sharePrice: Yup.string().required().label('Shares price'),
      shareGl: Yup.string().required().label('Shares GL account'),
      lockShareWithdrawal: Yup.bool().label('Lock Share Withdrawal')
    })
    const navigate= useNavigate()

    const onSubmit=(values)=>{
      console.log(values)
      const payload={
      shareCode: sharesCode,
      shareProductName: values.shareProductName,
      maximumSharedUnit: values.maximumShareUnit,
      noOfShares: values.noOfShares,
      sharePrice: values.sharePrice,
      shareDescription: values.shareDescription,
      shareTypeGL: values.shareGl,
      lockShareWithdrawal: values.lockShareWithdrawal
      }
      axios.post('ShareManagement/create-share-type', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
       setTimeout(() => {
        navigate(-1)
       }, 5000);
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true})
      }).catch(error=>toast(error.response.data.message))
    }
  return (
    <>
      <div className="mt-4 bg-white px-3 py-3 rounded-4">
    <div className="my-3">
      <span className="active-selector">Add new shares type</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <p style={{ fontWeight: "500", fontSize: "16px" }}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Add New Shares Type
          </p>
      </div>
      <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      >
        <Form>
        <div>
          <div className="px-4 admin-task-forms  bg-white pt-2 pb-4">
            <div className="d-flex flex-column gap-2 ">
              <label htmlFor="sharesCode" style={{ fontWeight: "500" }}>
                Shares Code
              </label>
              <input name="sharesCode" value={sharesCode} disabled/>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="shareProductName" style={{ fontWeight: "500" }}>
                Share Product Name<sup className="text-danger">*</sup>
              </label>
              <Field name="shareProductName" id="shareProductName" placeholder='Enter product name'/>
              <ErrorMessage component={ErrorText} name='shareProductName'/>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="sharePrice" style={{ fontWeight: "500" }}>
                Share Price<sup className="text-danger">*</sup>
              </label>
              <Field name="sharePrice" id="sharePrice" placeholder='Enter share price'/>
              <ErrorMessage component={ErrorText} name='sharePrice'/>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="noOfShares" style={{ fontWeight: "500" }}>
                Number of Shares<sup className="text-danger">*</sup>
              </label>
              <Field name="noOfShares" id="noOfShares" placeholder='Enter no of share'/>
              <ErrorMessage component={ErrorText} name='noOfShares'/>
            </div>
            <div className="d-flex flex-column gap-2 ">
              <label htmlFor="maximumShareUnit" style={{ fontWeight: "500" }}>
                Max. unit allowed<sup className="text-danger">*</sup>
              </label>
              <Field name="maximumShareUnit" placeholder='Enter percentage'/>
              <ErrorMessage component={ErrorText} name='maximumShareUnit'/>
            </div>
            <div className="d-flex flex-column gap-2 ">
              <label htmlFor="sharesAccount" style={{ fontWeight: "500" }}>
                Shares Account<sup className="text-danger">*</sup>
              </label>
              <Field name="shareGl" as='select'>
              <option value="">Select Account</option>
              {ledgers.map((enquiry) => (
                    <option
                      value={enquiry.accountNumber}
                      key={enquiry.accountNumber}
                    >
                      {enquiry.acctName} {`>> ${enquiry.product}`}
                    </option>
                  ))}
              </Field>
              <ErrorMessage component={ErrorText} name='sharesAccount'/>
            </div>
          </div>
             <div className="d-flex gap-2 align-items-center px-4">
              <label htmlFor="lockShareWithdrawal" style={{ fontWeight: "500" }}>
                Lock Share Withdrawal <sup className="text-danger">*</sup>
              </label>
              <Field name="lockShareWithdrawal" type='checkbox'/>
              <ErrorMessage component={ErrorText} name='lockShareWithdrawal'/>
            </div>
            <div className="admin-task-forms px-4 pb-4">
            <div className="d-flex flex-column gap-2 ">
              <label htmlFor="shareDescription" style={{ fontWeight: "500" }}>
                Share Description<sup className="text-danger">*</sup>
              </label>
              <Field name="shareDescription" as='textarea'/>
              <ErrorMessage component={ErrorText} name='shareDescription'/>
            </div>
            </div>
    <div
        className="d-flex justify-content-end gap-3 py-4 px-2"
        style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
      >
        <button
          className="btn btn-md rounded-5 py-2 px-3"
          style={{ backgroundColor: "#F7F7F7", fontSize:'14px' }}
          type="reset" >
          Discard
        </button>
        <button
          className="btn btn-md text-white rounded-5"
          style={{ backgroundColor: "#0452C8", fontSize:'14px' }}
          type="submit"
        >
        Add Share
        </button>
       </div>
      </div>
        </Form>
      </Formik>
    </div>
    <ToastContainer/>
  </div>
    </>
  )
}

export default AddNewShareType
