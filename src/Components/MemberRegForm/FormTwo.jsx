import React from "react";
import { Field, ErrorMessage } from "formik";
import ErrorText from "../agentForms/ErrorText";

const FormTwo = () => {
  return (
    <>
      <div style={{ width: "100%" }} className="inputs-container ">
        <label htmlFor="firstName" className="mb-1">
          First Name <sup className="text-danger fw-bold">*</sup>
        </label>
        <br />
        <Field
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          className="w-100"
        />
        <ErrorMessage name="firstName" component={ErrorText} />
      </div>
      <div style={{ width: "100%" }} className="inputs-container">
        <label htmlFor="lastName" className="mb-1">
          Last Name
        </label>
        <br />
        <Field
          name="lastName"
          placeholder="Enter your last name"
          className="w-100"
        />
        <ErrorMessage name="lastName" component={ErrorText} />
      </div>
      <div style={{ width: "100%" }} className="inputs-container">
        <label htmlFor="email" className="mb-1">
          Email Address <sup className="text-danger fw-bold">*</sup>
        </label>
        <br />
        <Field
          name="email"
          placeholder="Enter your email address"
          className="w-100"
        />
        <ErrorMessage name="email" component={ErrorText} />
      </div>
      <div style={{ width: "100%" }} className="inputs-container">
        <label htmlFor="phone" className="mb-1">
          Phone Number <sup className="text-danger fw-bold">*</sup>
        </label>
        <br />
        <Field
          name="phone"
          placeholder="Enter your phone number"
          className="w-100"
        />
        <ErrorMessage name="phone" component={ErrorText} />
      </div>
      <div className="radio-group  mt-2">
        Gender
        <div className="text-center d-flex justify-content-between">
          <label htmlFor="gender">
            <Field type="radio" name="gender" id="gender" value="male" /> Male
          </label>
          <label htmlFor="gender">
            <Field type="radio" name="gender" id="gender" value="female" /> Female
          </label>
        </div>
        <ErrorMessage name="gender" component={ErrorText} />
      </div>
    </>
  );
};

export default FormTwo;
