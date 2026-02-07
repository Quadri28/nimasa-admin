import { ErrorMessage, Field } from "formik";
import React, { useEffect, useState } from "react";
import ErrorText from "./ErrorText";
import axios from "../axios";


const AgentFormThree = ({values}) => {

  return (
    <>
      <div className="agent-form-container">
        <h5 className="fs-small">Qualification Information </h5>
      </div>
      <div className="bg-white px-2 py-4 form form-three">
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="qualification" className="mb-1">
            Qualification <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="qualification"
            placeholder="Qualification"
            className="w-100"
           /> 
         
         <ErrorMessage name="qualification" component={ErrorText}/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="microsoft" className="mb-1">
            Microsoft Excel Proficiency
            <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field 
            name="microsoft"
            placeholder="Select"
            className="w-100"
            as='select'
            >
              <option value=""> Select</option>
              <option value="Beginner"> Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              </Field> 
        <ErrorMessage name="microsoft" component={ErrorText}/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="word" className="mb-1">
            Microsoft Word Proficiency
            <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="word"
            placeholder="Select"
            className="w-100"
            as='select'
            >
              <option value=""> Select</option>
              <option value="Beginner"> Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              </Field> 
          <ErrorMessage component={ErrorText} name="word"/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container">
          <label htmlFor="english" className="mb-1">
            English Language Proficiency
            <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="english"
            placeholder="Enter proficiency"
            className="w-100"
            as='select'
            >
              <option value=""> Select</option>
              <option value="Beginner"> Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              </Field> 
            <ErrorMessage component={ErrorText} name="english"/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container col-md-5">
          <label htmlFor="dialect" className="mb-1">
            Dialect Spoken <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="dialect"
            className="w-100"
          />
           <ErrorMessage component={ErrorText} name="dialect"/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container col-md-5">
          <label htmlFor="laptop" className="mb-1">
            Do you have a Laptop? <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            as='select'
            name="laptop"
            placeholder="Select"
            className="w-100"
          > 
          <option value="No">No</option>
          <option value="Yes">Yes</option>
          </Field>
          <ErrorMessage component={ErrorText} name="laptop"/>
        </div>
        <div style={{ width: "100%" }} className="inputs-container col-md-5">
          <label htmlFor="availability" className="mb-1">
            Availability <sup className="text-danger fw-bold">*</sup>
          </label>
          <br />
          <Field
            name="availability"
            className="w-100"
            type='date'
          />
           <ErrorMessage component={ErrorText} name="availability"/>
        </div>
      </div>
    </>
  );
};

export default AgentFormThree;
