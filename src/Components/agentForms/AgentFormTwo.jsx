import React from "react";
import { Field, ErrorMessage } from "formik";
import ErrorText from "./ErrorText";

const AgentFormTwo = () => {
  return (
    <>
      <div className="agent-form-container">
        <h4>Agent Residence </h4>
      </div>
      <div className="bg-white px-3 py-4 form">
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="address" className="mb-1">
            Home Address <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="address"
            placeholder="Home Address"
            className="w-100"
          />
         <ErrorMessage component={ErrorText} name="address"/>
        </div>
        <div className="d-sm-flex gap-3 mt-3">
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="origin" className="mb-1">
              State of Origin <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              name="origin"
              placeholder="State of Origin"
              className="w-100"
            /> 
          
            <ErrorMessage component={ErrorText} name="origin"/>
          </div>
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="residence" className="mb-1">
              State of Residence <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              name="residence"
              placeholder="State of Residence"
              className="w-100"
            /> 
             <ErrorMessage component={ErrorText}  name="residence"/>
          </div>
        </div>
        <div className="d-sm-flex gap-3 mt-3">
          <div style={{ width: "100%" }} className="inputs-container">
            <label htmlFor="lga" className="mb-1">
              LGA of State of Residence
              <sup className="text-danger fw-bold">*</sup>
            </label>
            <br />
            <Field
              name="lga"
              placeholder="LGA of State of Residence"
              className="w-100"
            />
            <ErrorMessage component={ErrorText} name="lga"/>
          </div>
          <div  style={{ width: "100%" }}>
            <label htmlFor="Gender" style={{fontSize:'15px', fontWeight:'500'}}>Gender <sup className="text-danger">*</sup></label> <br />
            <Field
          name="gender">
                      {({ field }) => (
            <div className="d-flex justify-content-between">
              <div className="radio-item">
                <input
                  {...field}
                  id="male"
                  value="male"
                  checked={field.value === 'male'}
                  name="gender"
                  type="radio"
                />
                <label htmlFor="male" style={{marginLeft:'3px'}}>Male</label>
              </div>

              <div className="radio-item ">
                <input
                  {...field}
                  id="female"
                  value="female"
                  name="gender"
                  checked={field.value === 'female'}
                  type="radio"
                />
                <label htmlFor="female" style={{marginLeft:'3px'}}> Female</label>
              </div>
              <div>
              <ErrorMessage name="gender" component={ErrorText}/>
              </div>
            </div>
          )}
            </Field>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentFormTwo;
