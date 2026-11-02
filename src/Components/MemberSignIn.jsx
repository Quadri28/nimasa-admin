import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorText from "./agentForms/ErrorText";
import Logo from '../assets/Logo.png'
import { Link, useNavigate } from "react-router-dom";
import './Member.css'
import axios from "./axios";
import {Circles} from 'react-loader-spinner'
import { UserContext } from "./AuthContext";

const MemberSignIn = () => {
  const [cooperatives, setCooperatives] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getCooperatives=()=>{
    axios('Common/cooperatives').then(resp=>setCooperatives(resp.data))
  }
  useEffect(()=>{
    getCooperatives()
  }, [])
  const initialValues = {
    username: "",
    cooperativeType: "",
    password: "",
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validationSchema = Yup.object({
    username: Yup.string().required("Required*"),
    password: Yup.string()
      .matches(
        passwordRegex,
        "Invalid password. Password requires at least 8 characters with an uppercase, lowercase and a special character"
      )
      .required("Required*"),
    cooperativeType: Yup.string().required("Required*"),
  });

  const navigate = useNavigate();
  const user = useContext(UserContext)

  const onSubmit = async (values) => {
  const payload={
  cooperativeId: '9334FF3F-B0AE-4E46-ABF2-08DBF82CD53C',
  username: values.username,
  password: values.password
}
try {
  const resp = await axios.post('Account/member-login', payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  setLoading(true);
  localStorage.setItem("userCredentials", JSON.stringify(resp.data.data));
  navigate("/admin");
} catch (error) {
  console.log(error)
  if (error?.response?.status === 400) {
    setError(error.response.data.errorMessage)
  }else if (error) {
    setError(error.message)
  }
}
}
  
const refreshToken =()=>{
  const payload ={
    refreshToken: user.refreshToken
  }
if(user.refreshToken){
  axios.post('Account/refresh-token', payload, {headers:{
    Accept:'application/json'
  }}).then(resp=>console.log(resp))
}
}

useEffect(()=>{
  setInterval(()=>{
    refreshToken()
  }, 300000)
}, [])

  return (
    <div style={{backgroundColor:'#f2f2f2', minHeight:'130vh',  fontFamily:'General Sans'}}>
    <div className="d-flex justify-content-between container pt-2">
    <Link to='/'><img src={Logo} alt="Logo" width='20px' className="img-fluid logo-img" /> </Link>
      <div className="justify-self-end">
        <span className='dont'>Already have a UCP account?</span>
        <p>
        <Link to='/member-signup' className='sign-link'>Create UCP Member account</Link>
        </p>
      </div>
    </div>
  <div className="cooperative-form-container mt-5">
    <div className="text-center">
   <img src={Logo} alt="App Logo" width='40px' className="img-fluid" />
      <strong style={{fontSize:'18px', marginLeft:'5px'}}>UCP Member portal</strong>
      <p className="mt-1">Welcome back, sign-in to UCP Member portal</p>
    </div>
    <div className="bg-white px-3 py-3 form " style={{borderRadius:'15px'}}>
     
    {loading && !error ? (
       <div className="text-center mx-auto w-25">
             <Circles            
             height="80"
             width="80"
             color="#0452C8"
             ariaLabel="circles-loading"
             wrapperStyle={{}}
             wrapperClass=""
             visible={loading ? true : false}
             />
             </div>
        ) : (
          <p className="text-danger mb-2 text-center">
            {error}
          </p>
        )}
        
      <Formik 
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      >
      <Form className="row gap-2 g-2">
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="username" className="mb-1">
              Username <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              type="text"
              name="username"
              required
              placeholder="Username"
              className="w-100"
            />
            <ErrorMessage name="username" component={ErrorText} />
          </div>
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="cooperativeType" className="mb-1">
              Select Cooperative <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              as="select"
              type="text"
              name="cooperativeType"
              placeholder="Select"
              required
              className="w-100"
            >
              <option value="" >Select</option>
              {
                cooperatives.map(cooperative=> (
                  <option value={cooperative.nodeId} key={cooperative.nodeId}>{cooperative.tenantName}</option>
                ))
              }
            </Field>
            <ErrorMessage name="cooperativeType" component={ErrorText} />
          </div>
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="firstName" className="mb-1">
              Password <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field required type="password" name="password" className="w-100" />
            <ErrorMessage name="password" component={ErrorText} />
          </div>
          <div className="text-center mt-3">
            <input type="radio" name="agreement" /> <span> Remember me </span>
          </div>
          <div className="text-center ">
            <button
              type="submit"
              className="sign-cooperative member mt-2 btn btn-md w-100"
            >
              Proceed 
            </button>
          </div>
        </Form>
      </Formik>
    </div>
    </div>
    </div>
  );
};

export default MemberSignIn;
