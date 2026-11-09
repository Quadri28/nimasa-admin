import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaAngleRight, FaEyeSlash, FaEye } from "react-icons/fa";
import * as Yup from "yup";
import ErrorText from "./agentForms/ErrorText";
import "./Cooperative.css";
import Logo from "../assets/Logo.png";
import Union from "../assets/Union.png";
import axios from "./axios";
import { UserContext } from "./AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { ColorRing } from "react-loader-spinner";
import { render } from "react-dom";

const CooperativeSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [input, setInput] = useState({});
  const [show, setShow] = useState(false)

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const navigate = useNavigate();

  const { setCredentials, setSidebarState } = useContext(UserContext);
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  const initialValues = {
    cooperativeId: "1",
    userId: "",
    password: "",
    agreement: false,
  };
  const validationSchema = Yup.object({
    userId: Yup.string().required("Required"),
    agreement: Yup.boolean(),
    password: Yup.string().required("Required"),
  });

  const captchaRef = useRef(null);

const onSubmit = async (values) => {
    const payload={
        cooperativeId: 2,
        userId: values.userId,
        password: values.password
    }
    setLoading(true)
    try {const resp =  await axios.post('Account/cooperative-login', payload, {
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    sessionStorage.setItem("cooperative-details", JSON.stringify(resp.data));
    sessionStorage.setItem('sidebarState', 'general')
    setCredentials(resp.data)
    setSidebarState('general')
    const nodeId=resp.data.logInfo.nodeId
    const token = captchaRef?.current?.getValue();
    // if (token) {
    if (resp.data.responseCode === 0 ) {
    navigate("/admin-dashboard")
    }
    else if (resp.data.responseCode === -30) {
      toast(resp.data.message, {type:'error', autoClose:false})
    }else if (resp.data.responseCode === -60) {
      navigate('/reset-password')
    }else if (resp.data.responseCode === -11) {
      toast(resp.data.message, {type:'error', autoClose:false})
      setTimeout(() => {
        navigate(`/subscription-renewal?nodeId=${resp.data.logInfo.payNodeId}&userId=${resp.data.logInfo.userId}`, )
      }, 5000);
    }
      else if (resp.data.responseCode === -12) {
        toast(resp.data.message, {type:'error', autoClose:false})
    }else if (resp.data.responseCode === -66) {
      toast(resp.data.message, {type:'error', autoClose:false})
    }else if (resp.data.responseCode === -70) {
      toast(resp.data.message, {type:'error', autoClose:false})
      setTimeout(() => {
      navigate('/reset-password')
      }, 5000);
    }else if (resp.data.responseCode === -80) {
      toast(resp.data.message, {type:'error', autoClose:false})
    }
    // }
    // captchaRef.current.reset();
    setLoading(false)
    // if (!token) {
    //   setCaptchaError(true);
    //   toast.error("Please verify the reCAPTCHA.");
    //   return;
    // }
    setCaptchaError(false);
    } catch (error) {
      setLoading(false)
      if (error?.response?.status === 400) {
        setError(error.response.data.errorMessage)
      }else if (error) {
        setError(error.message)
      }
    }
  }; 


  const handleRecaptchaChange = (value) => {
    // You can use the 'value' in your form submission logic
  };

  //Forgot password functionality

  const forgotPassword = (e) => {
    e.preventDefault();
    const payload = {
      email: input.email,
      cooperativeId: input.cooperativeId,
    };
    axios
      .post("Account/forget-password", payload)
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
      });
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        minHeight: "110vh",
        position: "relative",
        fontFamily: "General Sans",
         paddingBottom: "5rem",
      }}
    >
      <div className="d-flex justify-content-between container pt-2 mb-4">
       
        
      </div>
      <div className="cooperative-form-container">
        <div className="text-center">
          <Link to="/">
          <img src={Logo} alt="Logo" className="img-fluid logo-img" />{" "}
        </Link>
          <p className="mt-1">
            Welcome back, sign in to your Cooperative portal
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="bg-white mx-auto d-flex flex-column">
              {loading ? (
                <div className="d-flex justify-content-center">
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#E8F1FF',"#4CB8E6","#3785FB",  "#F6911E", '#0452C8']}
                  />
                  </div>
              ) : (
                <p className="text-danger mb-1 text-center">{error}</p>
              )}
              <div style={{ width: "100%" }} className="inputs-container">
                <label htmlFor="userId" className="mb-1">
                  User ID <sup className="text-danger fw-bold">*</sup>
                </label>
                <br />
                <Field
                  type="text"
                  name="userId"
                  placeholder="Enter your user ID"
                  id="userId"
                  className="w-100"
                />
                <ErrorMessage name="userId" component={ErrorText} />
              </div>
               <div style={{ width: "100%" }} className="inputs-container">
                <label htmlFor="password" className="mb-1">
                  Password <sup className="text-danger fw-bold">*</sup>
                </label>
                <br />
                <div style={{position:'relative'}}>
                <Field
                  required
                  type={show ? 'text' : "password"}
                  name="password"
                  className="w-100"
                />
                {show ? <FaEyeSlash style={{position:'absolute', top:'50%', right:'0%', cursor:'pointer',
                   transform:'translate(-50%, -50%)'}} onClick={()=>setShow(!show)}/> :
                <FaEye style={{position:'absolute', top:'50%', right:'0%', cursor:'pointer',
                   transform:'translate(-50%, -50%)'}}  onClick={()=>setShow(!show)}/>}
                </div>
                <ErrorMessage name="password" component={ErrorText} />
              </div>
              <div className="text-center mt-1">
                <label htmlFor="agreement">
                  <Field
                    name="agreement"
                    type="checkbox"
                    checked={values.agreement}
                    onChange={() =>
                      setFieldValue("agreement", !values.agreement)
                    }
                  />
                  {""} Remember me
                </label>
                <ErrorMessage name="agreement" component={ErrorText} />
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  ref={captchaRef}
                />
                {captchaError && (
                  <p className="text-danger text-center mt-1">
                    Please complete the reCAPTCHA
                  </p>
                )}
              </div>
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="sign-cooperative member border-0 btn-md w-100"
                  disabled={loading}
                >
                  Proceed <FaAngleRight />
                </button>
              </div>
              <span
                className="text-center mt-3"
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => openModal()}
              >
                Forgot password?
              </span>
            </Form>
          )}
        </Formik>
      </div>
      <Modal
        onRequestClose={closeModal}
        isOpen={open}
        className="setting-modal"
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="form-header-container d-flex justify-content-between px-4">
          <h6>Forgot password </h6>
        </div>
        <form onSubmit={forgotPassword}>
          <div className="bg-white form" style={{ padding: "15px 24px 24px" }}>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="cooperativeId">Cooperative ID</label>
              <input
                type="text"
                name="cooperativeId"
                onChange={handleChange}
                className="border-0"
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: "1rem",
                  padding: "10px 15px",
                }}
              />
            </div>
            <div className="d-flex flex-column gap-2 mt-2">
              <label htmlFor="email">Enter your email</label>
              <input
                type="text"
                name="email"
                onChange={handleChange}
                className="border-0"
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: "1rem",
                  padding: "10px 15px",
                }}
              />
            </div>
            <button className="btn-md member border-0 mt-4 w-100">
              Proceed
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CooperativeSignIn;
