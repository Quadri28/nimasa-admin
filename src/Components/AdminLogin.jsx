import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaAngleRight } from "react-icons/fa";
import * as Yup from "yup";
import ErrorText from "./agentForms/ErrorText";
import "./Cooperative.css";
import Logo from "../assets/Logo.png";
import axios from "./axios";
import { UserContext } from "./AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";

const REMEMBERED_USER_KEY = "remembered-userId";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [input, setInput] = useState({});

  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const { setCredentials, setSidebarState } = useContext(UserContext);

  /* ===============================
     Remembered username (SAFE)
  =============================== */
  const rememberedUserId = localStorage.getItem(REMEMBERED_USER_KEY);

  const initialValues = {
    cooperativeId: "",
    userId: rememberedUserId || "",
    password: "",
    agreement: !!rememberedUserId,
  };

  const validationSchema = Yup.object({
    nodeId: Yup.number().required('Required'),
    userId: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    agreement: Yup.boolean(),
  });

  const onSubmit = async (values) => {
    const payload = {
      cooperativeId: values.nodeId,
      userId: values.userId,
      password: values.password,
    };

    setLoading(true);
    setError("");

    try {
      const token = captchaRef?.current?.getValue();
      if (!token) {
        setCaptchaError(true);
        toast.error("Please verify the reCAPTCHA.");
        setLoading(false);
        return;
      }

      const resp = await axios.post("Account/cooperative-login", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      /* ===============================
         Remember username logic
      =============================== */
      if (values.agreement) {
        localStorage.setItem(REMEMBERED_USER_KEY, values.userId);
      } else {
        localStorage.removeItem(REMEMBERED_USER_KEY);
      }

      sessionStorage.setItem(
        "cooperative-details",
        JSON.stringify(resp.data),
      );
      sessionStorage.setItem("sidebarState", "general");

      setCredentials(resp.data);
      setSidebarState("general");

      const nodeId = resp.data?.logInfo?.nodeId;

      if (resp.data.responseCode === 0 && nodeId !== 1) {
        navigate("/admin-dashboard");
      } else if (nodeId === 1) {
        navigate("/global-admin-dashboard", { replace: true });
      } else if (resp.data.responseCode === -60) {
        navigate("/reset-password");
      } else if (resp.data.responseCode === -11) {
        toast.error(resp.data.message, { autoClose: 5000 });
        setTimeout(() => {
          navigate(
            `/subscription-renewal?nodeId=${resp.data.logInfo.payNodeId}&userId=${resp.data.logInfo.userId}`,
          );
        }, 5000);
      } else {
        toast.error(resp.data.message, { autoClose: false });
      }

      captchaRef.current.reset();
      setCaptchaError(false);
    } catch (error) {
      if (error?.response?.status === 400) {
        setError(error.response.data.errorMessage);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    const payload = {
      email: input.email,
      cooperativeId: input.cooperativeId,
    };

    axios
      .post("Account/forget-password", payload)
      .then((resp) =>
        toast.success(resp.data.message, { autoClose: 5000 }),
      )
      .catch((error) =>
        toast.error(error.response.data.message, { autoClose: false }),
      );
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        minHeight: "130vh",
        fontFamily: "General Sans",
        position:'relative'
      }}
    >
      <div className="container pt-2 mb-5">
        <Link to="/">
          <img src={Logo} alt="Logo" className="img-fluid" style={{width:'100px'}}/>
        </Link>
      </div>
      <div className="cooperative-form-container mt-3">
        <div className="text-center">
          <strong style={{ fontSize: 18 }}>
            NIMASA Cooperative portal
          </strong>
          <p className="mt-1">
            Welcome back, sign in to your Cooperative portal
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="bg-white mx-auto d-flex flex-column">
              {error && (
                <p className="text-danger text-center">{error}</p>
              )}
              <div className="inputs-container">
                <label>Cooperative ID <sup className="text-danger">*</sup></label>
                <Field
                  type="text"
                  name="nodeId"
                  className="border-0 w-100"
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                />
                <ErrorMessage name="ndoeId" component={ErrorText} />
              </div>
              <div className="inputs-container">
                <label>User ID <sup className="text-danger">*</sup></label>
                <Field
                  type="text"
                  name="userId"
                  className="border-0 w-100"
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                />
                <ErrorMessage name="userId" component={ErrorText} />
              </div>
              <div className="inputs-container">
                <label>Password  <sup className="text-danger">*</sup></label>
                <Field
                  type="password"
                  name="password"
                  className="border-0 w-100"
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                />
                <ErrorMessage name="password" component={ErrorText} />
              </div>

              <div className="text-center mt-1">
                <label>
                  <Field
                    type="checkbox"
                    name="agreement"
                    checked={values.agreement}
                    onChange={() =>
                      setFieldValue("agreement", !values.agreement)
                    }
                  />{" "}
                  Remember me
                </label>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  ref={captchaRef}
                />
              </div>

              {captchaError && (
                <p className="text-danger text-center mt-1">
                  Please complete the reCAPTCHA
                </p>
              )}

              <button
                type="submit"
                className="sign-cooperative member border-0 btn-md w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Processing..." : <>Proceed <FaAngleRight /></>}
              </button>

              <span
                className="text-center mt-3"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setOpen(true)}
              >
                Forgot password?
              </span>
            </Form>
          )}
        </Formik>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        className="setting-modal"
        ariaHideApp={false}
      >
        <form onSubmit={forgotPassword} className="p-4">
          <label>Cooperative ID</label>
          <input
            name="cooperativeId"
            onChange={handleChange}
            className="border-0 w-100 mb-2"
          />

          <label>Email</label>
          <input
            name="email"
            onChange={handleChange}
            className="border-0 w-100"
          />

          <button className="btn-md member border-0 mt-3 w-100">
            Proceed
          </button>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
