import React, { useState, useEffect, useContext, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import ErrorText from "../../ErrorText";
import { useNavigate } from "react-router-dom";
import {CiSearch} from 'react-icons/ci'
import {LiaTimesCircle} from 'react-icons/lia'
import Modal from 'react-modal'
import useScreenSize from "../../../ScreenSizeHook";
import GeneralLedgerTable from "./GeneralLedgerTable";
import { Multiselect } from "react-widgets";
import { NumericFormat } from "react-number-format";


const AddNewLoan = () => {
  const { credentials } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [types, setTypes] = useState([]);
  const [category, setCategory] = useState(null);
  const [classes, setClasses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [loanClasses, setLoanClasses] = useState([]);
  const [repaymentTypes, setRepaymentTypes] = useState([]);
  const [methods, setMethods] = useState([]);
  const [productCharges, setProductCharges] = useState([]);
  const [options, setOptions] = useState([]);
  const [glOptions, setGlOptions] = useState([]);
  const [modalShow, setModalShow]= useState(false)
  const [glTypes, setGlTypes] = useState([]);
  const [glNodes, setGlNodes] = useState([]);
  const [glClasses, setGlClasses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [input, setInput]= useState({})
  const [data, setData]= useState([])
  const [loanRepayments, setLoanRepayments]=useState([])
  const [accountSelector, setAccountSelector]= useState('')
  const [text, setText]= useState({})

  const handleTextChange=(e)=>{
    const name =e.target.name;
    const value = e.target.value;
    setText({...text, [name]:value})
  }
  const handleChange =(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setInput({...input, [name]:value})
  }
  const fetchLoanRepaymentTypes= async()=>{
    await axios('Common/getloanrepayments')
    .then(resp=>setLoanRepayments(resp.data))
  }
  const fetchGlTypes = async () => {
  await axios.get("GlAccount/gl-type", {
        headers: { Authorization: `Bearer ${credentials.token}` },
      }).then(resp=>setGlTypes(resp.data));
  }

  const fetchGlNodes = async () => {
 await axios.get(
        `GlAccount/gl-type-node?prodTypeCode=${input.glType}`,
        {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }
      ).then(resp=>setGlNodes(resp.data.data))
  };

  const fetchNodeClasses = () => {
    axios(
      `GlAccount/gl-type-class?glTypeNodeCode=${input.glNode}`,
      {
        headers: { Authorization: `Bearer ${credentials.token}` },
      }
    ).then((resp) => {
      setGlClasses(resp.data.data)
    });
  };

  const fetchGlAccounts = () => {
    axios(
      `LoanProduct/gl-account-number?glClass=${input.glClass}`,
      {
        headers: { Authorization: `Bearer ${credentials.token}` },
      }
    ).then((resp) => {
      setAccounts(resp.data.data)
  })
  };

  useEffect(() => {
    fetchGlTypes();
    fetchLoanRepaymentTypes()
  }, []);

  useEffect(() => {
        fetchGlNodes();
  }, [input.glType]);

  useEffect(() => {
      fetchNodeClasses();
  }, [input.glNode]);

  useEffect(() => {
      fetchGlAccounts(category);
  }, [input.glClass]);

  const handleIconClick = (category) => {
    setCategory(category);
    handleOpen();
  };

  const getCurrencies = async () => {
    await axios("Common/get-currencies").then((resp) =>
      setCurrencies(resp.data)
    );
  };
  const navigate = useNavigate();
  const getFrequencies = () => {
    axios("Common/getloanfrequencies").then((resp) =>
      setFrequencies(resp.data)
    );
  };

  const getLoanTypes = () => {
    axios(`LoanProduct/list-product-type-by-product-class?productClassCode=${input.productClass}`,
       {headers:{Authorization: `Bearer ${credentials.token}`
    }})
    .then((resp) => setTypes(resp.data.data));
  };

  useEffect(()=>{
    getLoanTypes();
  }, [input?.productClass])
  const getClasses = () => {
    axios("LoanProduct/list-product-class", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setClasses(resp.data.data);
    });
  };
  const getProductCode = () => {
    axios("LoanProduct/GetLoanProductCode", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setCode(resp.data.data);
    });
  };
  const getLoanClasses = () => {
    axios("Common/getloanclass").then((resp) => setLoanClasses(resp.data));
  };

  const getMethods = () => {
    axios("Common/calculation-method").then((resp) => setMethods(resp.data));
  };
  const getPenalOption = () => {
    axios("Common/penal-option").then((resp) => setOptions(resp.data));
  };
  const getRepaymentTypes = () => {
    axios("Common/principal-repayment-type").then((resp) =>
      setRepaymentTypes(resp.data)
    );
  };
  const getProductCharges = () => {
    axios("Common/getcharges").then((resp) => setProductCharges(resp.data));
  };
  useEffect(() => {
    getLoanClasses();
    getRepaymentTypes();
    getProductCharges();
    getMethods();
    getPenalOption();
  }, []);

  useEffect(() => {
    getCurrencies();
    getClasses();
    getFrequencies();
    getProductCode();
  }, []);

  const { width } = useScreenSize();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "65%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 900 ? "800px" : "320px",
      overFlowY: "scroll",
      padding: 0,
      border:'solid 1px #f2f2f2'
    },
  };
  const glCategories = [
    { name: "principalBalance", label: "Principal Balance" },
    { name: "suspinterest", label: "Suspended Interest" },
    { name: "interestReceivable", label: "Interest Receivable" },
    { name: "interestIncome", label: "Interest Income" },
    { name: "interestAccrual", label: "Interest Accrual" },
    { name: "interBranchGL", label: "InterBranch GL" },
    { name: "suspPrincipal", label: "Suspended Principal" },
    { name: "unearnedIncomeGL", label: "Unearned Income" },
    { name: "miscIncome", label: "Miscellaneous Income" },
  ];
  const initialValues = {
    productCode: "",
    productName: "",
    currencyCode: "",
    startDate: "",
    expiryDate: "",
    productType: "",
    loanFrequency: "",
    maximumLoanAmount: null,
    shortName: "",
    numberOfGauratorRequired: null,
    minimumInterestPerMonth: null,
    maximumInterestPerMonth: null,
    minimumTerm: null,
    maximumTerm: null,
    interestRate: null,
    loanInterestRepaymentType: null,
    calculationMethod: null,
    principalRepaymentType: null,
    repaymentMethod: null,
    loanClass: null,
    loanType: null,
    penalOption: null,
    collateralValue: null,
    penaltyRate: null,
    allowODOnAccount: true,
    allowCommercialPapper: true,
    repaymentType: "",
    principalBalance: "",
    interestReceivable: "",
    suspinterest: "",
    suspPrincipal: "",
    interestAccrual: "",
    unearnedIncomeGL: "",
    interestIncome: "",
    miscIncome: "",
    interBranchGL: "",
  };
  const validationSchema = Yup.object({
    productCode: Yup.string(),
    productName: Yup.string().required(),
    currencyCode: Yup.string(),
    startDate: Yup.string().required(),
    expiryDate: Yup.string().required(),
    productType: Yup.string().required(),
    loanType: Yup.string().required(),
    loanFrequency: Yup.string(),
    shortName: Yup.string(),
    allowODOnAccount: Yup.boolean(),
    allowCommercialPapper: Yup.boolean(),
    repaymentType: Yup.string(),
    principalBalance: Yup.string(),
    interestReceivable: Yup.string(),
    suspinterest: Yup.string(),
    suspPrincipal: Yup.string(),
    interestAccrual: Yup.string(),
    unearnedIncomeGL: Yup.string(),
    interestIncome: Yup.string(),
    miscIncome: Yup.string(),
    interBranchGL: Yup.string(),
    repaymentMethod: Yup.string(),
  });

  const onSubmit = (values) => {
    const payload = {
      productCode: code.loanProductCode,
      productName: values.productName,
      productType: values.productType,
      loanType: Number(values.loanType),
      interestRate: values.interestRate,
      startDate: values.startDate,
      shortName: values.shortName,
      minimumLoanAmount: Number(text.minimumLoanAmount.replace(/,/g, "")),
      productClass: input.productClass,
      loanFrequency: values.loanFrequency,
      maximumLoanAmount: Number(text.maximumLoanAmount.replace(/,/g, "")),
      currencyCode: values.currencyCode,
      minimumTerm: Number(values.minimumTerm),
      maximumTerm: Number(values.maximumTerm),
      minimumInterestPerMonth: values.minimumInterest,
      maximumInterestPerMonth: values.maximumInterest,
      expiryDate: values.expiryDate,
      repaymentMethod: values.repaymentMethod,
      penaltyRate: Number(values.penaltyRate),
      loanClass: Number(values.loanClass),
      collateralValue: Number(text.collateralValue.replace(/,/g, "")),
      productCharges: data,
      calculationMethod: Number(values.calculationMethod),
      principalRepaymentType: Number(values.principalRepaymentType),
      loanInterestRepaymentType: Number(values.loanInterestRepaymentType),
      penalOption: Number(values.penalOptions),
      allowODOnAccount: values.allowODOnAccount,
      numberOfGauratorRequired: values.numberOfGauratorRequired,
    };
    axios
      .post("LoanProduct/create-loan-product", {...payload, ...result}, {
        headers: {
          authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
          setTimeout(() => {
            navigate(-1)
        }, 5000)
      }
      )
      .catch((error) => {
        toast(error.response.data.message, {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
        });
      });
  };
  function handleOpen (){
    setModalShow(true)
  }
  function handleClose (){
    setModalShow(false)
  }

  const column = [
    {Header: 'Select', accessor:'', Cell: (({cell})=>{
      const acctNumber=  cell.row.original.glNumber
      return  <div className="d-flex justify-content-center align-items-center">
      <input type="radio" name="accountSelector"   onChange={()=>{
        setAccountSelector(acctNumber)
        }}/>
      </div>
    })},
    {Header: 'Gl acct No', accessor:'glNumber'},
    {Header: 'Acct title', accessor:'accountName'},
    {Header: 'Branch office', accessor:'branch'},
    {Header: 'Date opened', accessor:'dateOpened'},
    {Header: 'Bk balance', accessor:'bookBalance', Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
  
  ]

    const columns = useMemo(() => column, []);

    const saveSelectedGL= (array, item)=>{
      return [...array, item]      
    }
    const restructureArray = (array) => {
      return array.reduce((acc, item) => {
        const [key, value] = item.split(": ");
        acc[key] = value; // Assign key-value pair
        return acc;
      }, {}); // Start with an empty object
    };
    const result= restructureArray(glOptions)
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
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
                <span style={{ fontSize: "16px" }}>Add loan product </span>
              </div>
            </div>
            <div className="px-4 admin-task-forms">
              <div className="row g-2">
                <label htmlFor="code" style={{ fontWeight: "500" }}>
                  Product Code<sup className="text-danger">*</sup>
                </label>
                <Field
                  name="code"
                  id="code"
                  value={code.loanProductCode}
                  readOnly
                />
                <ErrorMessage component={ErrorText} name="code" />
              </div>
              <div className="row g-2">
                <label htmlFor="productClass" style={{ fontWeight: "500" }}>
                  Product Class <sup className="text-danger">*</sup>
                </label>
                <select name="productClass" as="select" onChange={handleChange} required>
                  <option value="">Select</option>
                  {classes.map((clas) => (
                    <option value={clas.moduleCode} key={clas.moduleCode}>
                      {clas.moduleDescription}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row g-2">
                <label htmlFor="productType" style={{ fontWeight: "500" }}>
                  Product Type <sup className="text-danger">*</sup>
                </label>
                <Field name="productType" id="productType" as="select">
                  <option value="">Select</option>
                  {types.map((type) => (
                    <option value={type.productTypeId} key={type.productTypeId}>
                      {type.productTypeDesc}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="productType" />
              </div>
              <div className="row g-2">
                <label htmlFor="productName" style={{ fontWeight: "500" }}>
                  Product Name <sup className="text-danger">*</sup>
                </label>
                <Field name="productName" id="productName" required/>
                <ErrorMessage component={ErrorText} name="productName" />
              </div>
              <div className="row g-2">
                <label htmlFor="interestRate" style={{ fontWeight: "500" }}>
                  Interest Rate <sup className="text-danger">*</sup>
                </label>
                <Field name="interestRate" id="interestRate" type="number" min={0}/>
                <ErrorMessage component={ErrorText} name="interestRate" />
              </div>
              <div className="row g-2">
                <label htmlFor=" startDate" style={{ fontWeight: "500" }}>
                  Start Date <sup className="text-danger">*</sup>
                </label>
                <Field name="startDate" id=" startDate" type="date" required />
                <ErrorMessage component={ErrorText} name=" startDate" />
              </div>
              <div className="row g-2">
                <label htmlFor="expiryDate" style={{ fontWeight: "500" }}>
                  Expiry Date <sup className="text-danger">*</sup>
                </label>
                <Field name="expiryDate" id="expiryDate" type="date" required/>
                <ErrorMessage component={ErrorText} name="expiryDate" />
              </div>
              <div className="row g-2">
                <label htmlFor="shortName" style={{ fontWeight: "500" }}>
                  Short Name <sup className="text-danger">*</sup>
                </label>
                <Field name="shortName" id="shortName" />
                <ErrorMessage component={ErrorText} name="shortName" />
              </div>
              <div className="row g-2">
                <label
                  htmlFor="minimumLoanAmount"
                  style={{ fontWeight: "500" }}
                >
                  Minimum Loan Amount <sup className="text-danger">*</sup>
                </label>
                <NumericFormat name="minimumLoanAmount" component={NumericFormat} onChange={handleTextChange} 
                thousandSeparator={true} fixedDecimalScale={true} decimalScale={2} required/>
              </div>
              <div className="row g-2">
                <label
                  htmlFor="maximumLoanAmount"
                  style={{ fontWeight: "500" }}
                >
                  Maximum Loan Amount <sup className="text-danger">*</sup>
                </label>
                <NumericFormat name="maximumLoanAmount" required component={NumericFormat} 
                thousandSeparator={true} fixedDecimalScale={true} decimalScale={2} onChange={handleTextChange}/>
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
                <label htmlFor="minimumTerm" style={{ fontWeight: "500" }}>
                  Minimum Term (month)<sup className="text-danger">*</sup>
                </label>
                <Field name="minimumTerm" type='number' min={0} required/>
                <ErrorMessage component={ErrorText} name="minimumTerm" />
              </div>
              <div className="row g-2">
                <label htmlFor="maximumTerm" style={{ fontWeight: "500" }}>
                  Maximum Term (month) <sup className="text-danger">*</sup>
                </label>
                <Field name="maximumTerm" type='number' min={0} required/>
                <ErrorMessage component={ErrorText} name="maximumTerm" />
              </div>
              <div className="row g-2">
                <label htmlFor="repaymentMethod" style={{ fontWeight: "500" }}>
                  Repayment Types<sup className="text-danger">*</sup>
                </label>
                <Field name="repaymentMethod" as="select">
                  <option value="">Select</option>
                  {loanRepayments.map((type) => (
                    <option value={type.repayId} key={type.repayId}>
                      {type.repayDesc}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="repaymentMethod" />
              </div>
              <div className="row g-2">
                <label htmlFor="loanType" style={{ fontWeight: "500" }}>
                  Loan Type<sup className="text-danger">*</sup>
                </label>
                <Field name="loanType" as="select">
                  <option value="">Select</option>
                 <option value={1}>Non Discounted</option>
                 <option value={2}>Discounted</option>
                </Field>
                <ErrorMessage component={ErrorText} name="loanType" />
              </div>
              <div className="row g-2">
                <label htmlFor="penaltyRate" style={{ fontWeight: "500" }}>
                  Penalty Rate <sup className="text-danger">*</sup>
                </label>
                <Field name="penaltyRate" type='number' min={0} required/>
                <ErrorMessage component={ErrorText} name="penaltyRate" />
              </div>
              <div className="row g-2">
                <label htmlFor="loanClass" style={{ fontWeight: "500" }}>
                  Loan Class <sup className="text-danger">*</sup>
                </label>
                <Field name="loanClass" id="loanClass" as="select">
                  <option value="">Select</option>
                  {loanClasses.map((loanClass) => (
                    <option value={loanClass.code} key={loanClass.code}>
                      {loanClass.loandesc}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="loanClass" />
              </div>
              <div className="row g-2">
                <label htmlFor="loanFrequency" style={{ fontWeight: "500" }}>
                  Loan Frequency <sup className="text-danger">*</sup>
                </label>
                <Field name="loanFrequency" as="select">
                  <option value="">Select</option>
                  {frequencies.map((frequency) => (
                    <option value={frequency.freqCode} key={frequency.freqCode}>
                      {frequency.freqName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="loanClass" />
              </div>
              <div className="row g-2">
                <label htmlFor="collateralValue" style={{ fontWeight: "500" }}>
                  Collateral Value <sup className="text-danger">*</sup>
                </label>
                <NumericFormat
                  name="collateralValue"
                  thousandSeparator={true}
                  fixedDecimalScale={true}
                  decimalScale={2}
                  onChange={handleTextChange}
                />
                <ErrorMessage component={ErrorText} name="collateralValue" />
              </div>
              <div className="row g-2">
                <label htmlFor="minimumInterest" style={{ fontWeight: "500" }}>
                  Minimum Interest Rate<sup className="text-danger">*</sup>
                </label>
                <Field
                  name="minimumInterest"
                  type="number"
                  min={0}
                  required
                />
                <ErrorMessage component={ErrorText} name="minimumInterest" />
              </div>
              <div className="row g-2">
                <label htmlFor="maximumInterest" style={{ fontWeight: "500" }}>
                  Maximum Interest Rate <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="maximumInterest"
                  type="number"
                  min={0}
                  required
                />
                <ErrorMessage component={ErrorText} name="maximumInterest" />
              </div>
              <div className="row g-2">
                <label
                  htmlFor="calculationMethod"
                  style={{ fontWeight: "500" }}
                >
                  Calculation Method <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="calculationMethod"
                  id="calculationMethod"
                  as="select"
                >
                  <option value="">Select</option>
                  {methods.map((method) => (
                    <option value={method.value} key={method.value}>
                      {method.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="circulationMethod" />
              </div>
              <div className="row g-2">
                <label
                  htmlFor="numberOfGauratorRequired"
                  style={{ fontWeight: "500" }}
                >
                  No Of Guarantor Required <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="numberOfGauratorRequired"
                  id="numberOfGauratorRequired"
                  type="number"
                  min={0}
                />
                <ErrorMessage
                  component={ErrorText}
                  name="numberOfGauratorRequired"
                />
              </div>
              <div className="row g-2">
                <label
                  htmlFor="principalRepaymentType"
                  style={{ fontWeight: "500", fontSize: "14px" }}
                >
                  Principal repayment type <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="principalRepaymentType"
                  id="principalRepaymentType"
                  as="select"
                >
                  <option value="">Select</option>
                  {repaymentTypes.map((type) => (
                    <option value={type.value} key={type.value}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                 component={ErrorText} name="principalRepaymentType"/>
              </div>
              <div className="row g-2">
                <label
                  htmlFor="loanInterestRepaymentType"
                  style={{ fontWeight: "500", fontSize: "14px" }}
                >
                  interest repayment type <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="loanInterestRepaymentType"
                  id="loanInterestRepaymentType"
                  as="select"
                  required
                >
                  <option value="">Select</option>
                  {repaymentTypes.map((type) => (
                    <option value={type.value} key={type.value}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  component={ErrorText}
                  name="loanInterestRepaymentType"
                />
              </div>
              <div className="row g-2">
                <label htmlFor="penalOptions" style={{ fontWeight: "500" }}>
                  Penal Options <sup className="text-danger">*</sup>
                </label>
                <Field name="penalOptions" id="penalOptions" as="select">
                  <option value="">Select</option>
                  {options.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="penalOptions" />
              </div>
              <div className="row g-2">
                <label htmlFor="productCharges" style={{ fontWeight: "500" }}>
                  Product Charges <sup className="text-danger">*</sup>
                </label>
                <Multiselect 
                 data={productCharges}
                 textField='chargeDesc'
                name={data}
                onChange={(value) => {
                  setData(value.map((val) => val.chargeCode));
                }}
                 />
              </div>
            </div>
            <div className="statutory-list px-3 mb-3 mt-2">
            <div className="d-flex gap-2 align-items-center">
                <label
                  htmlFor="numberOfGauratorRequired"
                  style={{ fontWeight: "500" }}
                >
                  Allow OD on account
                </label>
                <Field
                  name="allowODOnAccount"
                  id="allowODOnAccount"
                  type="checkbox"
                />
                <ErrorMessage component={ErrorText} name="allowODOnAccount" />
              </div>
            </div>
            <div className="px-3">
              <span style={{ fontWeight: "500" }}>
                General Ledger<sup className="text-danger">*</sup>
              </span>
              <div className="admin-task-forms">
              {
                glCategories.map(category=>(
                  <div className="d-flex flex-column gap-1">
                    <label className="">{category.label}</label>
                    <div style={{position:'relative'}} >
                    <CiSearch size={20} style={{position:'absolute', cursor:'pointer', right:'0%', 
                      top:'50%', transform:'translate(-50%, -50%)'}}  
                      onClick={() => handleIconClick(category.name, category.label)}/>
                    <input type="text" name={category.name} disabled className="w-100"
                       value={result[category.name] || "Not set"}
                       />
                    </div>
                  </div>
                ))
              }
            </div>
            {/* Modal to get gl Account */}
            <Modal
            isOpen={modalShow}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
            >
             <div style={{backgroundColor:'#F5F9FF', borderRadius:'15px  15px 0 0',
               padding:'15px 20px'}} >
                <div className="d-flex justify-content-between">
                <div>
             <BsArrowLeft/> <span style={{fontSize:'14px', fontWeight:'400', color:'#4D4D4D'}}></span>General ledger enquiry
             </div>
             <LiaTimesCircle onClick={()=>handleClose()} style={{cursor:"pointer"}}/>
             </div>
             </div>
             <div className="admin-task-forms px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glTypes">GL type</label>
                <select type="text" name="glType" onChange={handleChange}>
                <option value="">Select</option>
                {
                  glTypes.map(type=>(
                    <option value={type.prodTypeCode} key={type.prodTypeCode}>{type.prodTypeName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glNode">GL node</label>
                <select type="text" name="glNode" onChange={handleChange}>
                <option value="">Select</option>
                {
                  glNodes?.map(node=>(
                    <option value={node.gl_NodeCode} key={node.gl_NodeCode}>{node.gl_NodeName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glClass">GL class</label>
                <select type="text" name="glClass" onChange={handleChange}>
                <option value="">Select</option>
                {
                  glClasses.map(clas=>(
                    <option value={clas.gl_ClassCode} key={clas.gl_ClassCode}>{clas.gl_ClassName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glAccount">GL account</label>
                <input name="glAccount" value={accountSelector} />
              </div>
             </div>
             <div className="px-3 my-2">
             <GeneralLedgerTable
             data={accounts}
             columns={columns}/> 
            </div>
            <div className="d-flex justify-content-end px-3 mb-4">
            <button onClick={()=>{
            saveSelectedGL(glOptions, glOptions.push(`${category}: ${accountSelector}`))
            handleClose()
            }} className="member border-0 btn-md">Proceed</button>
            </div>
            </Modal>
            </div>
            <div
              className="d-flex justify-content-end gap-3 p-3 mt-4 flex-wrap"
              style={{
                backgroundColor: "#F2f2f2",
                borderRadius: "0 0 15px 15px",
              }}
            >
              <button
                className="py-2 px-3 rounded-4 border-0 btn-md"
                style={{ backgroundColor: "#fafafa" }}
                type="reset"
              >
                Discard changes
              </button>
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "var(--custom-color)",
                  color: "#fff",
                  padding: "8px 10px",
                  borderRadius: "1.5rem",
                }}
                type="submit"
              >
                Add Product
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer/>
    </div>
  );
};

export default AddNewLoan;
