import React,{Fragment} from "react";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage, Field } from "formik";
import ErrorText from "./agentForms/ErrorText";

const Demo = () => {
  
  const initialStates = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cooperative: "",
    time: "",
    date: "",
  };
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string()
      .matches(phoneRegex, "Invalid phone number")
      .required("Required"),
    cooperative: Yup.string().required("Required"),
    date: Yup.string().required('Required*'),
    time: Yup.string().required('Required*')
  });

  const onSubmit = () => {
  
  };
  return (
    <Fragment>
      <div className="text-center in-touch" style={{ backgroundColor:'#fafafa'}}>
        <h2>Book a Demo.</h2>
        <p>Would you like to gain insight into how UCP works? </p>
      </div>
      <div className="mx-auto p-4 form-container">
        <Formik
          initialValues={initialStates}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({values})=><Form>
            <div className="justify-content-center initial-input">
              <div style={{ width: "100%" }}>
                <label htmlFor="firstName">First Name</label> <br />
                <Field
                  type="text"
                  required
                  name="firstName"
                  placeholder="Enter first name"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="firstName" component={ErrorText}/>
              </div>
              <div style={{ width: "100%" }}>
                <label htmlFor="lastName">Last Name</label> <br />
                <Field 
                  type="text"
                  required
                  name="lastName"
                  placeholder="Enter last name"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="lastName" component={ErrorText}/>
              </div>
            </div>
            <div className="d-flex flex-column gap-1 justify-content-center mt-2">
              <div style={{ width: "100%" }}>
                <label htmlFor="cooperative" className="mb-2">
                  Cooperative Name
                </label>
                <br />
                <Field 
                  type="text"
                  required
                  name="cooperative"
                  placeholder="Enter Cooperative Name"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="cooperative" component={ErrorText}/>
              </div>
            </div>
            <div className="justify-content-center my-4 gap-4 g-3 initial-input">
              <div style={{ width: "100%" }}>
                <label htmlFor="email">Select Time</label> <br />
                <Field 
                  type="time"
                  required
                  name="time"
                  placeholder="Time"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="time" component={ErrorText}/>
              </div>
              <div style={{ width: "100%" }}>
                <label htmlFor="date">Select Date</label>
                <Field 
                  type="date"
                  required
                  name="date"
                  placeholder="Enter Demo Date"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="date" component={ErrorText}/>
              </div>
            </div>
            <div className="justify-content-center gap-4 my-3 g-3 initial-input">
              <div style={{ width: "100%" }}>
                <label htmlFor="email">Email</label> <br />
                <Field 
                  type="email"
                  required
                  name="email"
                  placeholder="Your email"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="email" component={ErrorText}/>
              </div>
              <div style={{ width: "100%" }}>
                <label htmlFor="phone">Phone Number</label>
                <Field 
                  required
                  name="phone"
                  placeholder="Enter phone number"
                  style={{ width: "100%" }}
                />
                <ErrorMessage name="phone" component={ErrorText}/>
              </div>
            </div>
            <div className="text-center d-flex">
              <a type="submit" className="btn-md mt-3 in-touch-btn p-2 rounded-3" 
               href={`mailto:ucpsupport@cwg-plc.com?subject=Demo Request&body=Hello Fifthlab.%0D%0A %0D%0A
               My name is ${values.firstName} ${values.lastName}. My cooperative name is ${values.cooperative}, my phone number is ${values.phone} and my email is ${values.email}. %0D%0A I would like to have a demonstration with you at ${values.time} on ${values.date}
               %0D%0A %0D%0A Kind Regards, %0D%0A ${values.firstName} ${values.lastName}`} style={{textDecoration:'none'}}>
                Book Demo
              </a>
            </div>
          </Form>}
        </Formik>
      </div>
    </Fragment>
  );
};

export default Demo;
