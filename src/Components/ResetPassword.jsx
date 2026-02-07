import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaAngleRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as Yup from 'yup'
import ErrorText from "./agentForms/ErrorText";
import './Cooperative.css'
import Logo from '../assets/Logo.png'
import Union from '../assets/Union.png'
import axios from "./axios"
import { Circles } from "react-loader-spinner";
import { UserContext } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
    const[loading, setLoading]= useState(false)
    const[error, setError]= useState('')
    const {credentials} = useContext(UserContext)
    const initialValues={
  newPassword: '',
  confirmPassword:''
    }
const validationSchema= Yup.object({
newPassword: Yup.string()
.required('Password is required')
.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
.matches(/\d/, 'Password must contain at least one number')
.matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
confirmPassword: Yup.string()
.required('Confirm password is required')
.oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
})
const navigate = useNavigate()
    const onSubmit=(values)=>{
const payload={
  userId: credentials?.logInfo?.userId,
  nodeId: credentials?.logInfo?.payNodeId,
  oldPassword: values.currentPassword,
  newPassword: values.newPassword,
  confirmNewPassword: values.confirmPassword
    }
    setLoading(true)
    axios.post('Account/un-authenticated-change-password', payload )
    .then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
      navigate('/cooperative-signin')
      }, 5000);
      setLoading(false)
    })
    .catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
      setLoading(false)
    })
    }
  return (
    <div style={{backgroundColor:'#f5f5f5', minHeight:'135vh', position:'relative', fontFamily:'General Sans'}}>
      <div className="d-flex justify-content-between container pt-2">
      <Link to='/'><img src={Logo} alt="Logo"  className="img-fluid"/> </Link>
        <div className="justify-self-end">
          <span className="dont">Don't have a UCP account?</span>
          <p>
          <Link to='/cooperative-signup' className="sign-link">Create your Cooperative portal</Link>
          </p>
        </div>
      </div>
    <div className="reset-password">
    <div style={{marginInline:'auto'}}>
      <div className="text-center">
        <img src={Union} alt="App Logo" width='40px' className="img-fluid " /> 
        <strong style={{fontSize:'18px', marginLeft:'5px', color:'#333'}}>UCP Cooperative portal</strong>
        <p className="mt-1" style={{color:'#333'}}>Welcome back, sign in to your Cooperative portal</p>
      </div>
      <Formik 
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      { ({values})=>(
      <Form>
    <div style={{padding:'1rem', backgroundColor:'#F2F2F2', color:'#0d0d0d', fontWeight:'500', borderRadius:'20px 20px 0 0'}}>
        Reset password
    </div>
     <div className="bg-white px-2 pb-2  mx-auto row reset-password-container" 
     style={{borderRadius:'0 0 20px  20px'}}>
      {loading ?  (
       <div className="text-center mx-auto w-25">
           loading...
             </div>
        ) : (
          <p className="text-danger text-center">
            {error}
          </p>
        )}
        <div style={{ width: "100%" }}>
          <label htmlFor="userId" className="mb-1">
            User ID
          </label>
          <br />
          <input
            type="text"
            name="userId"
            id='userId'
            placeholder="Enter User ID"
            className="w-100 mb-2"
            value={credentials?.logInfo?.userId}
            readOnly
          />
        </div>
        <div style={{ width: "100%" }} >
          <label htmlFor="currentPassword" className="mb-1">
            Current password </label>
          <Field
            type="password"
            name="currentPassword"
            placeholder="Enter your user ID"
            id='currentPassword'
            className="w-100 mb-2"
          />
         <ErrorMessage name="userId" component={ErrorText}/>
        </div>
        <div style={{ width: "100%" }} >
          <label htmlFor="password" className="mb-1">
            New password  </label>
            <div className="d-flex justify-content-between my-2 flex-wrap">
                <span style={{fontSize:'10px', color:'#4d4d4d'}}>Must include:</span>
                <div className="d-flex gap-2 flex-wrap" style={{fontSize:'10px'}}>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 8px', backgroundColor: /[A-Z]/.test(values.newPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px', color: /[A-Z]/.test(values.newPassword)?'#0B5125' :'#9A1B1B' }}>{/[A-Z]/.test(values.newPassword) ? <FaCheckCircle/>:<FaTimesCircle/>} Uppercase</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 8px', backgroundColor: /[a-z]/.test(values.newPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px', color: /[a-z]/.test(values.newPassword)?'#0B5125' :'#9A1B1B' }}>{/[a-z]/.test(values.newPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Lowercase</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 5px', backgroundColor: /\d/.test(values.newPassword) ? '#D8EDE0' :'#F6DADA', borderRadius:'10px', color: /\d/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/\d/.test(values.newPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Number</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 5px', backgroundColor: /[@$!%*?&#]/.test(values.newPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px', color:/[@$!%*?&#]/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/[@$!%*?&#]/.test(values.newPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Special character</span>
                </div>
            </div>
          <Field
            type="password"
            name="newPassword"
            placeholder="Enter your password"
            id='newPassword'
            className="w-100 mb-2"
          />
         <ErrorMessage name="newPassword" component={ErrorText}/>
        </div>
        <div style={{ width: "100%" }} >
          <label htmlFor="confirmPassword" className="mb-1">
            Confirm new password 
          </label>
          <div className="d-flex justify-content-between flex-wrap my-2">
                <span style={{fontSize:'10px', color:'#4d4d4d'}}>Must include:</span>
                <div className="d-flex gap-2 flex-wrap" style={{fontSize:'10px'}}>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 8px', backgroundColor: /[A-Z]/.test(values.confirmPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px', color: /[A-Z]/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/[A-Z]/.test(values.confirmPassword) ? <FaCheckCircle/>:<FaTimesCircle/>} Uppercase</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 8px', backgroundColor: /[a-z]/.test(values.confirmPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px',  color: /[a-z]/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/[a-z]/.test(values.confirmPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Lowercase</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 5px', backgroundColor: /\d/.test(values.confirmPassword) ? '#D8EDE0' :'#F6DADA', borderRadius:'10px', color: /\d/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/\d/.test(values.confirmPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Number</span>
                    <span className="d-flex align-items-center gap-1" style={{padding:'2px 5px', backgroundColor: /[@$!%*?&#]/.test(values.confirmPassword) ? '#D8EDE0' : '#F6DADA', borderRadius:'10px', color:/[@$!%*?&#]/.test(values.newPassword)?'#0B5125' :'#9A1B1B'}}>{/[@$!%*?&#]/.test(values.confirmPassword) ? <FaCheckCircle/>:<FaTimesCircle/>}Special character</span>
                </div>
            </div>
          <Field
            type="password"
            name="confirmPassword"
            placeholder="Enter your password"
            id='confirmPassword'
            className="w-100"
          />
         <ErrorMessage name="confirmPassword" component={ErrorText}/>
        </div>
        <div className="text-center mt-4 mb-2">
          <button
            type="submit"
            className="sign-cooperative member border-0 btn-md w-100"
            disabled={loading}
              >
            Proceed <FaAngleRight />
          </button>
        </div>
        </div>
      </Form>
    )}
      </Formik>
    </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default ResetPassword
