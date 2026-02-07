import React from "react";
import { Link } from "react-router-dom";
import { ErrorMessage, Field } from "formik";
import ErrorText from './ErrorText'

const AgentFormOne = ({values, setFieldValue}) => {
  return (
    <>
      <div className="agent-form-container">
        <h4>Account Information </h4>
      </div>
      <div className="bg-white px-3 py-4 form">
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="firstName" className="mb-1">
            First Name <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="firstName"
            placeholder="First Name"
            className="w-100"
          />
          <ErrorMessage component={ErrorText} name="firstName"/>
        </div>
        <div className="gap-2 mt-1 agent-input-container">
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="email" className="mb-1">
              Email Address <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              type="text"
              name="email"
              placeholder="Enter email address"
              className="w-100"
            />
            <ErrorMessage component={ErrorText} name="email"/>
          </div>
          <div style={{ width: "100%" }} className="inputs-container mt-1">
            <label htmlFor="phone" className="mb-1">
              Phone Number <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              name="phone"
              placeholder="Enter Phone Number"
              className="w-100"
            />
            <ErrorMessage component={ErrorText} name="phone"/>
          </div>
        </div>
        <div className="text-center mt-4">
          <Field type="radio" name="agreement" checked={values.agreement} onChange={()=>setFieldValue('agreement', !values.agreement)}/> <label htmlFor="agreement">
            Agree to <Link to="/terms">terms</Link> and <Link to="/terms">condition</Link>
          </label>
          <ErrorMessage name="agreement" component={ErrorText}/>
        </div>
      </div>
    </>
  );
};

export default AgentFormOne;
