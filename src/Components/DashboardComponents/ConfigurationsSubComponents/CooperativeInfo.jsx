import React, { useState, useEffect, useContext } from "react";
import CoopLogo from "../../../assets/CoopLogo.png";
import axios from "../../../Components/axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { Formik, Form, Field } from "formik";

const CooperativeInfo = ({
  details,
  handleChange,
  getProfile,
  openModal,
  handleOpenModal,
}) => {
  const [types, setTypes] = useState([]);
  const [states, setStates] = useState([]);

  const { credentials } = useContext(UserContext);

  const getCooperativeTypes = () => {
    axios("Common/cooperative-types").then((resp) => {
      setTypes(resp.data);
    });
  };
  const getStates = () => {
    axios("Common/get-states-by-countryId?countryCode=001").then((resp) =>
      setStates(resp.data)
    );
  };
  useEffect(() => {
    getCooperativeTypes();
    getStates();
  }, []);

  const onSubmit = () => {
    const payload = {
      bankCode: details.bankCode,
      bankName: details.bankName,
      bankFax: details.bankFax,
      address: details.address,
      phone: details.phone,
      email: details.email,
      slogan: details.slogan,
      pAndLAccount: details.pAndLAccount,
      priorpandlacct: details.priorpandlacct,
      lastFinancialYear: details.lastFinancialYear,
      nextFinancialYear: details.nextFinancialYear,
      state: details.state,
      smsreq: details.smsreq,
      multiacct: details.multiacct,
      acctOpenSms: details.acctOpenSms,
      regFee: Number(details.regFee),
      regFeeMode: Number(details.regFeeMode),
      regFeeAccount: details.regFeeAccount,
      logoPathId: details.logoPathId,
      documentPathID: details.documentPathID,
      cooperativeType: Number(details.cooperativeType),
      cooperativeCategory: details.cooperativeCategory,
      currencyCode: details.currencyCode,
      incomeAccount: details.incomeAccount,
      cashAccount: details.cashAccount,
      payableAccount: details.payableAccount,
      expenseAccount: details.expenseAccount,
    };
    const toastOptions = {
      pauseOnHover: true,
      type: "success",
      autoClose: 5000,
    };
    axios
      .post("SetUp/update-general-setup", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() =>
        toast("Cooperative information updated successfully", toastOptions)
      ).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  };

  return (
    <div
      className="bg-white mt-4 rounded-4"
      style={{ border: "solid .5px #fafafa" }}
    >
      <div
        className="py-3 px-3 justify-content-between align-items-center form-header"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
      >
        <div className="d-flex gap-3">
          <img
            src={details?.logoImage ? details?.logoImage : CoopLogo}
            alt="Cooperative Logo"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="coop-title-wrapper row">
            <span style={{ fontWeight: "500", fontSize: "18px" }}>
              {details?.bankName ? details?.bankName : "Cooperative name here"}{" "}
            </span>
            <span>
              {details?.slogan
                ? details.slogan
                : "Cooperative slogan goes here"}
            </span>
          </div>
        </div>
        <div className="btn-upload-container">
          {/* Modal to upload logo */}

          <div data-bs-toggle="modal" data-bs-target="#logo">
            <button
              onClick={() => openModal()}
              className="btn btn-sm p-2"
              style={{
                backgroundColor: "#E6F0FF",
                color: "#0452C8",
                fontSize: "12px",
                borderRadius: "1.2rem",
              }}
            >
              Upload logo
            </button>
          </div>

          {/* Button to upload By-Law */}

          <button
            onClick={() => handleOpenModal()}
            className="btn btn-sm p-2"
            style={{
              backgroundColor: "var(--custom-color)",
              color: "#fff",
              borderRadius: "1.2rem",
              fontSize: "12px",
            }}
            type="submit"
          >
            Upload by-law
          </button>
        </div>
      </div>
      <Formik onSubmit={onSubmit} initialValues={details}>
        <Form>
          <div className="px-3 admin-task-forms mt-4">
            <div className="d-flex flex-column gap-2">
              <label htmlFor="bankName" style={{ fontWeight: "500" }}>
                Cooperative name:
              </label>
              <Field
                name="bankName"
                id="bankName"
                value={details?.bankName}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="state" style={{ fontWeight: "500" }}>
                Head office state:
              </label>
              <Field
                name="state"
                id="state"
                as="select"
                value={details?.state}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {states.map((state) => (
                  <option value={state.stateCode} key={state.stateCode}>
                    {state.stateName}
                  </option>
                ))}
              </Field>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="cooperativeSlogan" style={{ fontWeight: "500" }}>
                Cooperative slogan:
              </label>
              <Field
                name="slogan"
                id="slogan"
                value={details?.slogan}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="emailAddress" style={{ fontWeight: "500" }}>
                Email address:
              </label>
              <Field
                name="email"
                id="email"
                value={details?.email}
                type="email"
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="cooperativeType" style={{ fontWeight: "500" }}>
                Type of Cooperative:
              </label>
              <select
                name="cooperativeType"
                id="cooperativeType"
                value={details?.cooperativeType}
                onChange={handleChange}
              >
                {types.map((type) => (
                  <option value={type?.id} key={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="phone" style={{ fontWeight: "500" }}>
                Contact number:
              </label>
              <Field
                name="phone"
                id="phone"
                value={details?.phone}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="registrationNumber" style={{ fontWeight: "500" }}>
                Registration number:
              </label>
              <Field
                name="registrationNumber"
                id="registrationNumber"
                value={details?.registrationNumber}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="regFee" style={{ fontWeight: "500" }}>
                Registration fee:
              </label>
              <NumericFormat
                name="regFee"
                id="regFee"
                value={details?.regFee}
                thousandSeparator={true}
                fixedDecimalScale={true}
                decimalScale={2}
                onValueChange={(values) => {
                  const { value, formattedValue } = values; // value = "1000", formattedValue = "1,000"
                  handleChange({
                    target: {
                      name: "regFee",
                      value: value, // store unformatted numeric value
                    },
                  });
                }}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor="address" style={{ fontWeight: "500" }}>
                Address:
              </label>
              <Field
                name="address"
                id="address"
                value={details?.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Category of Cooperative:</label>
              <select
                name="cooperativeCategory"
                onChange={handleChange}
                value={details?.cooperativeCategory}
                id="cooperativeCategory"
                className="w-100"
              >
                <option value={1}>Department</option>
                <option value={2}>Community</option>
              </select>
            </div>
          </div>
          <div className="px-3 statutory-list">
            <div>
              Registration fee collection:
              <div
                role="group"
                className="d-flex align-items-center justify-content-between mt-1"
              >
                <div className="gap-1 d-flex align-items-center">
                  <Field
                    name="regFeeMode"
                    id="regFeeMode"
                    type="radio"
                    value={2}
                    checked={
                      details.regFeeMode === 2 ? details.regFeeMode : null
                    }
                    onChange={handleChange}
                  />
                  <label htmlFor="regFeeMode"> Upon acceptance</label>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Field
                    name="regFeeMode"
                    id="regFeeMode"
                    type="radio"
                    value={1}
                    checked={
                      details.regFeeMode === 1 ? details.regFeeMode : null
                    }
                    onChange={handleChange}
                  />
                  <label htmlFor="regFeeMode"> Upfront </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-end gap-3 mt-3 p-3 flex-wrap"
            style={{ backgroundColor: "#FAFAFA" }}
          >
            <button
              className="btn btn-md py-2"
              style={{
                backgroundColor: "var(--custom-color)",
                color: "#fff",
                borderRadius: "1.5rem",
                fontSize: "14px",
              }}
              type="submit"
            >
              Save changes
            </button>
          </div>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default CooperativeInfo;
