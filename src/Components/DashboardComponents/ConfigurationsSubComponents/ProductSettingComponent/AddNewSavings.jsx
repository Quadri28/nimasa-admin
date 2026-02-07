import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../axios";
import { toast, ToastContainer } from "react-toastify";
import ErrorText from "../../ErrorText";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AddNewSavings = () => {
  const [code, setCode] = useState("");
  const [types, setTypes]= useState([])
  const [currencies, setCurrencies] = useState([]);
  const [classes, setClasses] = useState([])
  const navigate = useNavigate();
  const { credentials } = useContext(UserContext);

  const getProductTypes=()=>{
    axios('SavingProduct/get-saving-product-type', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setTypes(resp.data.data)
    })
  }
  const getClasses=()=>{
    axios('SavingProduct/get-saving-product-class', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setClasses(resp.data.data))
  }
  const getCurrencies = async () => {
    await axios("Common/get-currencies").then((resp) =>
      setCurrencies(resp.data)
    );
  }
 
  useEffect(() => {
    getCurrencies();
    getClasses()
    getProductTypes()
  }, []);
  const getCodes = async () => {
    await axios("SavingProduct/get-saving-product-code", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCode(resp.data.data));
  };

  useEffect(() => {
    getCodes();
  }, []);
  const initialValues = {
    productCode: "",
    productName: "",
    productType: "",
    productClass: "",
    productStart: "",
    productExpire: "",
    currencyCode: "",
    openBalance: 0,
    closeBalance: 0,
    minintbalance: 0,
    drrate: 0,
    crrate: 0,
    withAllowed: false,
    stateInactive: false,
    checkBook: false,
    sweepIn: false,
    si: false,
    od: false,
    yrProcessMethod: 0,
    siFloor: false,
    penalRate: 0,
    productshort: "",
    lien: 0,
    dailyInterest: 0,
    interBranch: "",
    maximumAmount: 0,
  };
  const validationSchema = Yup.object({
    productCode: Yup.string(),
    productName: Yup.string().required("Required"),
    productStart: Yup.string().required("Required"),
    productClass: Yup.string().required("Required"),
    productExpire: Yup.string().required("Required"),
    currencyCode: Yup.string().required("Required"),
    drrate: Yup.string().required("Required"),
    crrate: Yup.string().required("Required"),
    openBalance: Yup.string(),
    closeBalance: Yup.string(),
    minintbalance: Yup.string(),
    productshort: Yup.string(),
    productType: Yup.string(),
    dailyInterest: Yup.string(),
    interBranch: Yup.string(),
    maximumAmount: Yup.string(),
  });
  const onSubmit = (values) => {
    const payload = {
      productCode: String(code.productCode),
      productName: values.productName,
      productType: values.productType,
      productClass: values.productClass,
      productStart: values.productStart,
      productExpire: values.productExpire,
      currencyCode: values.currencyCode,
      openBalance: values.openBalance,
      closeBalance: values.closeBalance,
      minintbalance: values.minintbalance,
      drrate: values.drrate,
      crrate: values.crrate,
      withAllowed: values.withAllowed,
      stateInactive: values.stateInactive,
      checkBook: values.checkBook,
      sweepIn: values.sweepIn,
      si: values.si,
      od: values.od,
      yrProcessMethod: values.yrProcessMethod ? 1 :0,
      siFloor: values.siFloor ? 1 :0,
      penalRate: values.penalRate,
      productshort: values.productshort,
      lien: values.lien,
      dailyInterest: Number(values.dailyInterest),
      interBranch: values.interBranch,
      maximumAmount: values.maximumAmount,
      lockSaving: values.lockSaving
    };
    console.log(values)
    axios
      .post("SavingProduct/create-saving-product",payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() =>{
        toast("Saving product created successfully", {
          autoClose: 5000,
          pauseOnHover: true,
          type: "success",
        })
        setTimeout(() => {
          navigate(-1)
        }, 5000);
      }
      )
      .catch((resp) => {
        toast(resp.message, {
          autoClose: 5000,
          pauseOnHover: true,
          type: "error",
        });
        
      });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form style={{ border: "solid .5px #fafafa", borderRadius: "15px" }}>
          <div
            className="p-3"
            style={{
              backgroundColor: "#F5F9FF",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div
              className=" d-flex align-items-center gap-2 title-link"
              style={{ width: "fit-content" }}
              onClick={() => navigate(-1)}
            >
              <BsArrowLeft />{" "}
              <span style={{ fontSize: "16px" }}>Add saving product </span>
            </div>
          </div>
          <div className="admin-task-forms px-4">
            <div className="row g-2">
              <label htmlFor="code" style={{ fontWeight: "500" }}>
                Product Code<sup className="text-danger">*</sup>
              </label>
              <Field
                name="productCode"
                id="productCode"
                value={code.productCode}
                readOnly
              />
              <ErrorMessage component={ErrorText} name="productCode" />
            </div>
            <div className="row g-2">
              <label htmlFor="productName" style={{ fontWeight: "500" }}>
                Product Name <sup className="text-danger">*</sup>
              </label>
              <Field name="productName" id="productName" required/>
              <ErrorMessage component={ErrorText} name="productName" />
            </div>
            <div className="row g-2">
              <label htmlFor="productClass" style={{ fontWeight: "500" }}>
                Product Class <sup className="text-danger">*</sup>
              </label>
              <Field name="productClass" id="productClass" as='select' required>
                <option value=''>Select</option>
                {
                  classes.map(clas=>(
                    <option value={clas.moduleCode} key={clas.moduleCode}>{clas.moduleDesc}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="productClass" />
            </div>
            <div className="row g-2">
              <label htmlFor="currencyCode" style={{ fontWeight: "500" }}>
                Currency <sup className="text-danger">*</sup>
              </label>
              <Field name="currencyCode" id="currencyCode" as="select" required>
                <option value="">Select Currency</option>
                {currencies.map((currency) => (
                  <option
                    value={currency.countryCode}
                    key={currency.countryCode}
                  >
                    {currency.currencyName}
                  </option>
                ))}
              </Field>
              <ErrorMessage component={ErrorText} name="currency" />
            </div>
            <div className="row g-2">
              <label htmlFor="productStart" style={{ fontWeight: "500" }}>
                Start Date <sup className="text-danger">*</sup>
              </label>
              <Field name="productStart" id="productStart" type="date" required/>
              <ErrorMessage component={ErrorText} name="productStart" />
            </div>
            <div className="row g-2">
              <label htmlFor="productExpire" style={{ fontWeight: "500" }}>
                Expiry Date <sup className="text-danger">*</sup>
              </label>
              <Field name="productExpire" id="productExpire" type="date" required/>
              <ErrorMessage component={ErrorText} name="productExpire" />
            </div>
            <div className="row g-2">
              <label htmlFor="productType" style={{ fontWeight: "500" }}>
                Product Type<sup className="text-danger">*</sup>
              </label>
              <Field name="productType" id="productType" as='select' required>
                <option value="">Select</option>
                {
                  types.map(type=>(
                    <option value={type.productTypeId} key={type.productTypeId}>{type.productTypeDesc}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="productType" />
            </div>
            <div className="row g-2">
              <label
                htmlFor="minimumInterestBalance"
                style={{ fontWeight: "500" }}
              >
                Min. Balance for Int.
              </label>
              <Field
                name="minimumInterestBalance"
                id="minimumInterestBalance"
                type='number'
                min={0}
              />
              <ErrorMessage
                component={ErrorText}
                name="minimumInterestBalance"
              />
            </div>
            <div className="row g-2">
              <label htmlFor="openBalance" style={{ fontWeight: "500" }}>
                Opening Balance
              </label>
              <Field name="openBalance" id="openBalance"  type='number'/>
              <ErrorMessage component={ErrorText} name="openBalance" />
            </div>
            <div className="row g-2">
              <label htmlFor="closeBalance" style={{ fontWeight: "500" }}>
                Closing Balance
              </label>
              <Field name="closeBalance" id="closeBalance"  type='number'/>
              <ErrorMessage component={ErrorText} name="closeBalance" />
            </div>
            <div className="row g-2">
              <label htmlFor="shortName" style={{ fontWeight: "500" }}>
                Short Name
              </label>
              <Field name="productshort" id="productshort" />
              <ErrorMessage component={ErrorText} name="shortName" />
            </div>
            <div className="row g-2">
              <label htmlFor="interestRate" style={{ fontWeight: "500" }}>
                Interest Calc. Basis (Days in year for processing)
              </label>
              <Field name="interestRate" id="interestRate" type='number'/>
              <ErrorMessage component={ErrorText} name="interestRate" />
            </div>
            <div className="row g-2">
              <label htmlFor="penalRate" style={{ fontWeight: "500" }}>
                OD Penalty Rate
              </label>
              <Field name="penalRate"  type="number" />
              <ErrorMessage component={ErrorText} name="penalRate" />
            </div>
            <div className="row g-2">
              <label htmlFor="crrate" style={{ fontWeight: "500" }}>
                Credit interest rate  (Per annum)<sup className="text-danger">*</sup>
              </label>
              <Field name="crrate" id="crrate" type='number' min={0} required/>
              <ErrorMessage component={ErrorText} name="crrate" />
            </div>
            <div className="row g-2">
              <label htmlFor="drrate" style={{ fontWeight: "500" }}>
                Debit interest rate (Per annum)<sup className="text-danger">*</sup>
              </label>
              <Field name="drrate" id="drrate" type='number' min={0} required/>
              <ErrorMessage component={ErrorText} name="drrate" />
            </div>
            <div className="row g-2">
              <label htmlFor="withAllowed" style={{ fontWeight: "500" }}>
              Maximum Withdrawal (Allowed for Interest)
              </label>
              <Field name="withAllowed" id="withAllowed" type='number'/>
              <ErrorMessage component={ErrorText} name="withAllowed" />
            </div>
            <div className="row g-2">
              <label htmlFor="dailyInterest" style={{ fontWeight: "500" }}>
                Interest Days
              </label>
              <Field name="dailyInterest" id="dailyInterest" />
              <ErrorMessage component={ErrorText} name="dailyInterest" />
            </div>
            </div>
              <span style={{ fontWeight: "500" }} className="px-4 mt-3">Others</span>
            <div className="general-ledger px-4 mt-2 mb-4">
                <label
                  htmlFor="others"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="checkBook"
                    id="checkBook"
                    type="checkbox"
                   
                  />{" "}
                  Allow cheque book
                </label>
                 <label
                  htmlFor="others"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="lockSaving"
                    id="checkBook"
                    type="checkbox"
                   
                  />{" "}
                  Lock withdrawal
                </label>
                <label
                  htmlFor="others"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="si"
                    type="checkbox"
                  />
                  Allow standing instructions
                </label>
                <label
                  htmlFor="others"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="od"
                    type="checkbox"
                  />
                  Allow OD
                </label>
                <label
                  htmlFor="others"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="sweepIn"
                    id="sweepIn"
                    type="checkbox"
                  />{" "}
                  Allow Sweep in
                </label>
                <label
                  htmlFor="lien"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="lien"
                    // id="lien"
                    type="checkbox"
                   
                  />{" "}
                  
                  Allow Lien
                </label>
                <label
                  htmlFor="stateInactive"
                  className="d-flex align-items-center gap-2"
                >
                  <Field
                    name="stateInactive"
                    type="checkbox"
                    // value="Stat to all Inactive/ Dormant A/C"
                  />{" "}
                  Stat to all Inactive/ Dormant A/C
                </label>
            </div>
          <div
            className="d-flex justify-content-end p-3 gap-3"
            style={{
              backgroundColor: "#F2f2f2",
              borderRadius: "0 0 15px 15px",
            }}
          >
            <button
              className="btn-md reset-btn rounded-4 px-3 border-0"
              type="reset"
            >
              Discard changes
            </button>

            <button className="border-0 btn-md member" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </Formik>
      <ToastContainer/>
    </div>
  );
};

export default AddNewSavings;
