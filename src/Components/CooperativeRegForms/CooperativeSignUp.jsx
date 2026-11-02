import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import * as Yup from "yup";
import "./Cooperative.css";
import Logo from "../assets/Logo.png";
import Union from "../assets/Union.png";
import FormOne from "./CooperativeRegForms/FormOne";
import FormTwo from "./CooperativeRegForms/FormTwo";
import axios from "./axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormThree from "./CooperativeRegForms/FormThree";

const CooperativeSignUp = () => {
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initialValues = {
  terms: false,
  country:'',
  nameOfCooperative: "",
  contactAddress: "",
  contactPerson: "",
  designation: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  registrationNumber: "",
  cooperativeLocation: "",
  contactPersonAlternativeEmail1: "",
  contactPersonAlternativeEmail: "",
  agentName: "",
  numberOfMembers: 0
  };

  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/
  const validationSchema = Yup.object({
    terms: Yup.boolean().required().label('Terms and Agreement'),
    country: Yup.string().required('Required'),
    nameOfCooperative: Yup.string().min(3, 'Must be minimum of 3 characters' ).required('Required'),
    contactAddress: Yup.string().min(10, 'Must be minimum of 10 characters' ).required('Required'),
    contactPerson: Yup.string().required('Required'),
    designation: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().matches(phoneRegex, 'Invalid phone number').required('Required'),
    registrationNumber: Yup.string().required().label('Registration number'),
    cooperativeLocation: Yup.string().required().label('Cooperative location'),
    contactPersonAlternativeEmail1: Yup.string().required('Required'),
    contactPersonAlternativeEmail: Yup.string().required('Required'),
    agentName:  Yup.string(),
    numberOfMembers:  Yup.string().required('Required')
  });

  const onSubmit = (values) => {
    const payload={
      terms: values.terms,
      country: values.country,
      nameOfCooperative: values.nameOfCooperative,
      contactAddress: values.contactAddress,
      contactPerson: values.contactPerson,
      designation: values.designation,
      email: values.email,
      phone: values.phone,
      password: values.password,
      confirmPassword: values.confirmPassword,
      registrationNumber: values.registrationNumber,
      cooperativeLocation: values.cooperativeLocation,
      contactPersonAlternativeEmail1: values.contactPersonAlternativeEmail1,
      contactPersonAlternativeEmail: values.contactPersonAlternativeEmail,
      agentName: values.agentName,
      numberOfMembers: values.numberOfMembers
    }

    const toastOptions = {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type:'success',
      theme: "colored",
    };
    setLoading(true)
    axios
      .post("Account/cooperative-signup", payload)
      .then((resp) =>{
      setLoading(false)
        toast(resp.data.message,toastOptions)
        }). catch((error) =>{
        setLoading(false)
          toast(error.response.data.errorMessage, {type:'error', autoClose:false})
          toast(error.response.data.message, {type:'error', autoClose:false})
      });
  };

  const getForms = (props) => {
    if (steps === 0) {
      return <FormOne form={props}/>;
    } else if (steps === 1) {
      return <FormTwo form={props}/>;
    }else {
      return <FormThree/>
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        minHeight: "150vh",
        position: "relative",
        fontFamily:'General Sans'
      }}
    >
      <div className="d-flex justify-content-between container pt-1">
        <Link to="/">
          <img src={Logo} alt="Logo"  className="img-fluid " />{" "}
        </Link>
        <div className="justify-self-end">
          <span className="dont">Already have a UCP account?</span>
          <p>
            <Link to="/cooperative-signin" className="sign-link">
              Sign-in to your Cooperative portal
            </Link>
          </p>
        </div>
      </div>
      <div className="cooperative-signup-form-container">
        <div className="text-center">
          <img src={Union} alt="App Logo" width="16px" className="img-fluid" />
          <span style={{ fontSize: "18px", marginLeft: "5px", fontWeight:'500' }}>
            UCP Cooperative portal
          </span>
          <p className="great">
            Great to have you, sign up to UCP Cooperative portal
          </p>
        </div>
        <div className="form-header-container d-flex justify-content-between">
          <h5 style={{fontWeight:'500', color:'#0D0D0D', fontSize:'16px'}}>Cooperative signup form </h5>
          <span>{steps + 1} of 3</span>
        </div>
        <div className="bg-white form" style={{padding:'15px 24px 24px'}}>
            {
              error ? <p className="text-danger text-center">{error}</p> : null
            }
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form>
                {getForms(props)}
                <div className="text-center d-flex gap-2 mt-2">
                  {steps > 0 ? (
                    <button
                      type="button"
                      className="sign-cooperative cooperative border-0 btn-md w-100 mt-2"
                      onClick={() => setSteps((prev) => prev - 1)}
                      style={{ color: "#0452C8" }}
                    >
                      <FaAngleLeft />
                      Previous
                    </button>
                  ) : null}
                  {steps < 2 ? (
                    <button
                      type="button"
                      className="member sign-cooperative border-0 btn-md w-100 mt-2"
                      onClick={() => setSteps((prev) => prev + 1)}
                    >
                      Proceed <FaAngleRight />
                    </button>
                  ) : null}
                  {steps === 2 ? (
                    <button
                      type="submit"
                      className="sign-cooperative member border-0 btn-md w-100 mt-2"
                      disabled={loading}
                    >
                      Submit
                    </button>
                  ) : null}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CooperativeSignUp;
