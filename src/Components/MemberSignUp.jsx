import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, } from "formik";
import Logo from "../assets/Logo.png";
import "./Member.css";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import FormOne from "./MemberRegForm/FormOne";
import FormTwo from "./MemberRegForm/FormTwo";
import FormThree from "./MemberRegForm/FormThree";
import axios from "./axios";
import { toast, ToastContainer } from "react-toastify";

const MemberSignUp = () => {
  const [steps, setSteps] = useState(0);
  const initialValues = {
    cooperative: "",
    regNumber: "",
    terms: false,
    firstName:'',
    lastName:'',
    email:'',
    gender:'',
    address:'',
    residentialCountry:'',
    state:'',
    residentialState:'',
    phone:'',

  };

  const validationSchema = Yup.object({
    cooperative: Yup.string().required("Required*"),
    regNumber: Yup.string().required("Required*"),
    terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
    firstName: Yup.string().required("Required*"),
    lastName: Yup.string().required("Required*"),
    address: Yup.string().required("Required*"),
    residentialCountry: Yup.string().required("Required*"),
    state: Yup.string().required("Required*"),
    residentialState: Yup.string().required("Required*"),
    phone: Yup.number().required("Required*"),
    email: Yup.string().email().required("Required*"),
    gender: Yup.string()
    .oneOf(['male', 'female']).required('Gender field is required'),
  });

  const onSubmit = (values) => {
    const payload ={
  cooperativeId: values.cooperative,
  firstName: values.firstName,
  lastName: values.lastName,
  email: values.email,
  phoneNumber: values.phone,
  gender: values.gender,
  address: values.address,
  countryId: Number(values.residentialCountry),
  stateId: Number(values.state),
  residentialStateId: Number(values.state),
  }
const toastOptions={
  autoClose: false,
  closeOnClick: true,
  theme: 'colored',
  type: 'success'
}
    axios.post('Account/member-signup', payload, {headers:{
      Accept: 'application/json'
    }})
    .then(()=>{
      toast('Your registration was successful', toastOptions)
    })
  };

  const fetchForm = (props) => {
    if (steps === 0) {
      return <FormOne />;
    } else if (steps === 1) {
      return <FormTwo />;
    } else if (steps === 2) {
      return <FormThree form={props}/>;
    }
  };

  return (
    <div style={{ backgroundColor: "#f2f2f2", minHeight: "130vh" , position:'relative',  fontFamily:'General Sans'}}>
      <div className="d-flex justify-content-between container pt-2">
        <Link to="/">
          <img src={Logo} alt="Logo" className="img-fluid logo-img" />
        </Link>
        <div className="justify-self-end">
          <span className="dont">Already have a UCP account?</span>
          <p>
            <Link to="/member-signin" className="sign-link">
              Sign-in to your Cooperative portal
            </Link>
          </p>
        </div>
      </div>
      <div className="cooperative-form-container">
        <div className="text-center">
          <img src={Logo} alt="App Logo" width="40px" className="img-fluid " />
          <strong style={{ fontSize: "18px", marginLeft: "5px" }}>
            UCP Member portal
          </strong>
          <p className="mt-1">
            Great to have you, sign up to UCP Member portal
          </p>
        </div>
        <div className="form-header-container d-flex justify-content-between">
          <h6>Cooperative details </h6>
          <span>{steps +1} of 3</span>
        </div>
        <div className="bg-white px-3 py-3 form">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            { 
            (props) =>
            
            <Form>
              {fetchForm(props)}

              <div className="text-center d-flex gap-2 mt-3">
               {steps > 0 ?
              <button
                type="button"
                className="sign-cooperative cooperative btn btn-md w-100 mt-2"
                onClick={()=>setSteps((prev)=> prev - 1)}
                style={{color:'#0452C8'}}
                >
                  <FaAngleLeft />Previous
                </button>: null
                }
                { steps < 2 ?
                <button
                  type="button"
                className="sign-cooperative member btn btn-md w-100 mt-2"
                onClick={()=>setSteps((prev)=> prev + 1)}
                >
                  Proceed <FaAngleRight />
                </button> : null}
                { steps === 2 ?
                <button
                  type="submit"
                className="sign-cooperative member btn btn-md w-100 mt-2"
                >
                  Proceed <FaAngleRight />
                </button> : null}
              </div>
            </Form>
          }
          </Formik>
          <ToastContainer/>
        </div>
      </div>
    </div>
  );
};

export default MemberSignUp;
