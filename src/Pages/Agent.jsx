import React, { useState, useEffect, Suspense } from "react";
import "./Agent.css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import "@splidejs/react-splide/css";
import education from "../assets/education.png";
import fingers from "../assets/fingers.png";
import AgentFormOne from "../Components/agentForms/AgentFormOne";
import AgentFormTwo from "../Components/agentForms/AgentFormTwo";
import AgentFormThree from "../Components/agentForms/AgentFormThree";
import { Formik, Form } from "formik";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Responsibility from "../Components/Responsibility";
import Requirement from "../Components/Requirement";
import * as Yup from "yup";

const Agent = () => {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState("responsibility");

  useEffect(()=>{
    if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
    }
  }, [])

  const initialValues = {
    firstName: "",
    email: "",
    phone: "",
    agreement: "",
    address: "",
    origin: "",
    residence: "",
    lga: "",
    gender: "",
    qualification: "",
    microsoft: "",
    word: "",
    english: "",
    dialect: "",
    laptop: "",
    availability: "",
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required*"),
    email: Yup.string()
      .matches(emailRegex, "Invalid email address")
      .required("Required*"),
    phone: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Required*"),
    agreement: Yup.boolean().required("Required*"),
    address: Yup.string().required("Required*"),
    origin: Yup.string().required("Required*"),
    residence: Yup.string().required("Required*"),
    lga: Yup.string().required("Required*"),
    gender: Yup.string().required("Required*"),
    qualification: Yup.string().required("Required*"),
    microsoft: Yup.string().required("Required*"),
    word: Yup.string().required("Required*"),
    english: Yup.string().required("Required*"),
    dialect: Yup.string().required("Required*"),
    laptop: Yup.string().required("Required*"),
    availability: Yup.string().required("Required*"),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  const formStepChanger = ({ values, setFieldValue }) => {
    if (step === 0) {
      return <AgentFormOne values={values} setFieldValue={setFieldValue} />;
    } else if (step === 1) {
      return <AgentFormTwo />;
    } else if (step === 2) {
      return <AgentFormThree values={values}/>;
    }
  };

  const getAgent = () => {
    if (active === "responsibility") {
      return <Responsibility />;
    } else {
      return <Requirement />;
    }
  };
  return (
    <>
      <div className="agent-container py-5 " style={{fontFamily:'General Sans'}}>
        <div className="text-center mb-5 agent-header-container">
          <h2>Who is a UCP agent?</h2>
          <p className="mt-2">
            UCP empowers cooperatives, thrift collectors, trade unions,
            associations, and groups to automate and oversee the complete
            process of member savings collections, contributions, as well as
            loan booking and repayment from their members and customers.
          </p>
          <button
            className="btn btn-md my-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            style={{ borderRadius: "15px" }}
          >
            Be an agent
          </button>
        </div>
        <div className="container">
          <Splide
            options={{
              type: "loop",
              gap: "10px",
              drag: "free",
              arrows: false,
              pagination: false,
              perPage: 2,
              autoScroll: {
                pauseOnHover: false,
                pauseOnFocus: false,
                rewind: false,
                speed: 1,
              },
            }}
            extensions={{ AutoScroll }}
          >
            <SplideSlide className="slide">
             <Suspense fallback={ <div>Image loading...</div> }>
              <img src={education} alt="slide-image" className="img-fluid" loading="lazy" />
              </Suspense>
            </SplideSlide>
            <SplideSlide className="slide">
             <Suspense fallback={ <div>Image loading...</div> }>
              <img src={fingers} alt="slide-image" className="img-fluid" loading="lazy"/>
              </Suspense>
            </SplideSlide>
            <SplideSlide className="slide">
             <Suspense fallback={ <div>Image loading...</div> }>
              <img src={education} alt="slide-image" className="img-fluid " loading="lazy"/>
              </Suspense>
            </SplideSlide>
          </Splide>
        </div>
        <div>
          <div className="justify-content-center d-sm-flex gap-3 mx-auto mt-5 py-3">
            <p
              onClick={() => setActive("responsibility")}
              className={active === "responsibility" ? "activated" : null}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
             UCP Agent Requirements
            </p>
            <p
              onClick={() => setActive("requirement")}
              className={active === "requirement" ? "activated" : null}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              UCP Agent Responsibilities
            </p>
          </div>
          {getAgent()}
        </div>
        <div
          className="text-center mt-4"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <button className="btn btn-md" style={{ borderRadius: "15px" }}>
            Be an agent
          </button>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="px-4 mt-3 d-flex justify-content-between">
              <h5 className="modal-title fs-5" id="exampleModalLabel">
                UCP Agent Form
              </h5>
              <span>{step + 1}/3</span>
            </div>
            <Formik
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="mt-3 px-4">
                  {formStepChanger({ values, setFieldValue })}
                  <div className=" d-flex gap-2 mb-3 justify-content-between mt-3">
                    {step > 0 ? (
                      <button
                        type="button"
                        className="btn-md modal-previous px-3 py-2 border-0 rounded-5"
                        onClick={() => setStep((prev) => prev - 1)}
                      >
                        Previous
                      </button>
                    ) : null}
                    {step === 2 ? null : (
                      <button
                        type="button"
                        className="btn-md modal-next px-3 py-2 border-0"
                        onClick={() => setStep((prev) => prev + 1)}
                      >
                        Proceed
                      </button>
                    )}
                    {step === 2 ? (
                      <a
                        type="submit"
                        className="btn btn-md modal-next"
                        href={`mailto:ucp-support@thefifthlab.com?subject=Application for UCP agent role&body=Hello Fifthlab. %0D%0A %0D%0A I am ${values.firstName} applying for the role of UCP agent, please, find below my application details: %0D%0A %0D%0A Name: ${values.firstName} %0D%0A Phone No: ${values.phone}%0D%0A Email: ${values.email} %0D%0A Gender: ${values.gender} %0D%0A State of residence: ${values.residence} %0D%0A LGA: ${values.lga} %0D%0A Home Address: ${values.address} %0D%0A State of Origin: ${values.origin} %0D%0A Qualification: ${values.qualification} %0D%0A Excel Proficiency: ${values.microsoft} %0D%0A Word Proficiency: ${values.word} %0D%0A English Proficiency: ${values.english} %0D%0A Dialect spoken: ${values.dialect} %0D%0A Have a laptop?: ${values.laptop} %0D%0A Role Applying for: ${values.role} %0D%0A Availability: ${values.availability} %0D%0A %0D%0A Kind Regards %0D%0A ${values.firstName}`}
                      >
                        Submit
                      </a>
                    ) : null}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Agent;
