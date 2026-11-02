import { Field, ErrorMessage } from "formik";
import ErrorText from "../agentForms/ErrorText";


const FormOne = ({form}) => {
  
  return (
    <>
      <div style={{ width: "100%" }} className="inputs-container">
        <label htmlFor="nameOfCooperative" className="mb-1">
          Cooperative Name <sup className="text-danger fw-bold">*</sup>
        </label>
        <br />
        <Field
          type="text"
          name="nameOfCooperative"
          id="nameOfCooperative"
          placeholder="Cooperative Name"
          className="w-100"
        />
        <ErrorMessage name="nameOfCooperative" component={ErrorText} />
      </div>
      <div style={{ width: "100%" }} className="inputs-container mt-2">
        <label htmlFor="registrationNumber" className="mb-1">
          Cooperative Reg. Number <sup className="text-danger fw-bold">*</sup>
        </label>
        <br />
        <Field
          type="text"
          name="registrationNumber"
          id="registrationNumber"
          placeholder="Cooperative Reg. Number"
          className="w-100"
        />
        <ErrorMessage name="registrationNumber" component={ErrorText} />
      </div>
      <div style={{ width: "100%" }} className="inputs-container mb-2">
      <label htmlFor="contactAddress" className="mb-1">
        Cooperative's Address <sup className="text-danger fw-bold">*</sup>
      </label>
      <br />
      <Field
        type="text"
        name="contactAddress"
        id="contactAddress"
        placeholder="Cooperative Address"
        className="w-100"
      />
      <ErrorMessage name="contactAddress" component={ErrorText} />
    </div>
    <div className='inputs-container  mb-1'>
            <label htmlFor="numberOfMembers">Total Number of Members<sup className="text-danger fw-bold">*</sup></label>
         <Field className='w-100' name='numberOfMembers' id='numberOfMembers' type='number'  placeholder='50'/>
         <ErrorMessage name='numberOfMembers' component={ErrorText}/>
        </div>
    </>
  );
};

export default FormOne;
