import { Formik, Field, ErrorMessage, Form } from "formik";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { BsArrowLeft } from "react-icons/bs";
import ErrorText from "../../ErrorText";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import * as Yup from "yup";
import GeneralLedgerTable from "./GeneralLedgerTable";
import { CiSearch } from "react-icons/ci";
import Modal from 'react-modal'
import useScreenSize from "../../../ScreenSizeHook";
import { LiaTimesCircle } from "react-icons/lia";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddNewInvestment = () => {

  const [productCode, setProductCode] = useState("");
  const { credentials } = useContext(UserContext);
  const [currencies, setCurrencies] = useState([]);
  const [invtTypes, setInvtTypes] = useState([]);
  const [kinds, setKinds] = useState([]);
  const [productClasses, setProductClasses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [glOptions, setGlOptions] = useState([]);
  const [modalShow, setModalShow]= useState(false)
  const [glTypes, setGlTypes] = useState([]);
  const [glNodes, setGlNodes] = useState([]);
  const [glClasses, setGlClasses] = useState([]);
  const [input, setInput]= useState({})
  const [category, setCategory]= useState('')
  const [accountSelector, setAccountSelector]= useState('')
  
  //functions to handle modal opening and closing
  function handleOpen (){
    setModalShow(true)
  }
  function handleClose (){
    setModalShow(false)
  }
//Modal styles
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
    { name: "principal", label: "Principal Balance" },
    { name: "suspInt", label: "Suspended Interest" },
    { name: "upfront", label: "Upfront Interest (Discounted Instruments)" },
    { name: "intIncome", label: "Interest Income" },
    { name: "intAccrual", label: "Interest Accrual" },
    { name: "paymentGL", label: "Cash Payment GL" },
    { name: "suspPrinc", label: "Suspended Principal" },
    { name: "maturedGL", label: "Matured Placement GL" },
    { name: "tTax", label: "WithHolding Tax" },
  ];
  //Function to handle change in the ledger field
   const handleChange =(e)=>{
      const name= e.target.name;
      const value= e.target.value;
      setInput({...input, [name]:value})
    }


    const fetchRepaymentKinds=()=>{
      axios('Common/get-repayment-kind', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setKinds(resp.data))
    }
    useEffect(()=>{
      fetchRepaymentKinds()
    },[])


    const fetchGlTypes = async () => {
    await axios.get("GlAccount/gl-type", {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }).then(resp=>setGlTypes(resp.data));
    }
  
    const fetchGlNodes = async (category) => {
   await axios.get(
          `GlAccount/gl-type-node?prodTypeCode=${input.glType}`,
          {
            headers: { Authorization: `Bearer ${credentials.token}` },
          }
        ).then(resp=>setGlNodes(resp.data.data))
    };
  
    const fetchNodeClasses = (category) => {
      axios(
        `GlAccount/gl-type-class?glTypeNodeCode=${input.glNode}`,
        {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }
      ).then((resp) => {
        setGlClasses(resp.data.data)
      });
    };
  
    const fetchGlAccounts = (category) => {
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
  

  const getCurrencies = () => {
    axios("Common/get-currencies").then((resp) => setCurrencies(resp.data));
  };
  const getFrequencies = () => {
    axios("Common/getloanfrequencies").then((resp) =>
      setFrequencies(resp.data)
    );
  };
  const getInvestType = () => {
    axios("InvestmentProduct/get-investment-product-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setInvtTypes(resp.data.data));
  };

  const getProductClass = () => {
    axios("InvestmentProduct/get-investment-product-class", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProductClasses(resp.data.data));
  };

  const getProductCode = () => {
    axios("InvestmentProduct/get-investment-product-code", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProductCode(resp.data.data));
  };

  useEffect(() => {
    getCurrencies();
    getInvestType();
    getProductClass();
    getProductCode();
    getFrequencies();
  }, []);

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

      const navigate = useNavigate()
  const initialValues = {
    productCode: "",
    productName: "",
    productClass: 0,
    productType: "",
    productStart: "",
    productExpire: "",
    currencyCode: "",
    mnType: 0,
    mxType: 0,
    minTerm: 0,
    maxTerm: 0,
    repayMeth: "",
    term: "",
    shortName: "",
    intIncome: "",
    principal: "",
    tTax: "",
    upfront: "",
    paymentGL: "",
    maturedGL: "",
    suspInt: "",
    suspPrinc: "",
    intAccrual: "",
  };

  const validationSchema = Yup.object({
    code: Yup.string(),
    investmentTerm: Yup.string(),
    name: Yup.string(),
    productClass: Yup.string(),
    regDate: Yup.string(),
    interest: Yup.string(),
    type: Yup.string(),
    interestFrequency: Yup.string(),
    investmentAmount: Yup.string(),
    maturityDate: Yup.string(),
    currency: Yup.string(),
    expiryDate: Yup.string(),
    minInvestmentAmount: Yup.string(),
    shortName: Yup.string(),
    genLedger: Yup.string(),
  });
  const onSubmit = (values) => {
    
  const payload={
  productCode: String(productCode.productCode),
  productName: values.productName,
  productClass: values.productClass,
  productType: values.type,
  productStart: values.regDate,
  productExpire: values.expiryDate,
  currencyCode: values.currency,
  minimumInterest: values.minimumInterest,
  maximumInterest: values.maximumInterest,
  miniMumTerm: values.minTerm,
  maximumTerm: values.maxTerm,
  repayMeth: values.kind,
  term: values.term,
  shortName: values.shortName,
    }
    axios.post('InvestmentProduct/create-investment-product', {...payload, ...result}, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
      navigate(-1)
      }, 5000);
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
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
                <BsArrowLeft />
                <span style={{ fontSize: "16px" }}>Add investment product </span>
              </div>
            </div>
            <div className="px-4 admin-task-forms">
              <div className="row g-2">
                <label htmlFor="code" style={{ fontWeight: "500" }}>
                  Product Code<sup className="text-danger">*</sup>
                </label>
                <Field name="code" id="code" value={productCode.productCode} />
                <ErrorMessage component={ErrorText} name="code" />
              </div>
              <div className="row g-2">
                <label htmlFor="productClass" style={{ fontWeight: "500" }}>
                  Product Class <sup className="text-danger">*</sup>
                </label>
                <Field name="productClass" id="productClass" as="select" required>
                  <option value="">Select</option>
                  {productClasses.map((productClass) => (
                    <option
                      value={productClass.moduleCode}
                      key={productClass.moduleCode}
                    >
                      {productClass.moduleDesc}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="productClass" />
              </div>
              <div className="row g-2">
                <label htmlFor="productName" style={{ fontWeight: "500" }}>
                  Product Name <sup className="text-danger">*</sup>
                </label>
                <Field name="productName" id="productName" required/>
                <ErrorMessage component={ErrorText} name="productName" />
              </div>
              <div className="row g-2">
                <label htmlFor="shortName" style={{ fontWeight: "500" }}>
                  Short Name <sup className="text-danger">*</sup>
                </label>
                <Field name="shortName" id="shortName" />
                <ErrorMessage component={ErrorText} name="shortName" />
              </div>
              <div className="row g-2">
                <label htmlFor="currency" style={{ fontWeight: "500" }}>
                  Currency <sup className="text-danger">*</sup>
                </label>
                <Field name="currency" id="currency" as="select" required>
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
                <label htmlFor="term" style={{ fontWeight: "500" }}>
                  Investment Term <sup className="text-danger">*</sup>
                </label>
                <Field name="term" id="term" as="select" required>
                  <option value="">Select</option>
                  {frequencies.map((frequency) => (
                    <option value={frequency.freqCode} key={frequency.freqCode}>
                      {frequency.freqName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="investmentTerm" />
              </div>
              <div className="row g-2">
                <label htmlFor="minTerm" style={{ fontWeight: "500" }}>
                  Minimum Term (month)<sup className="text-danger">*</sup>
                </label>
                <Field name="minTerm" id="minTerm" type="number" min={0} required/>
                <ErrorMessage component={ErrorText} name="minTerm" />
              </div>
              <div className="row g-2">
                <label htmlFor="maxTerm" style={{ fontWeight: "500" }}>
                  Maximum Term (month) <sup className="text-danger">*</sup>
                </label>
                <Field name="maxTerm" id="maxTerm" min={0}/>
                <ErrorMessage component={ErrorText} name="maxTerm" required/>
              </div>
             
              <div className="row g-2">
                <label htmlFor="minimumInterest" style={{ fontWeight: "500" }}>
                 Minimum Interest <sup className="text-danger">*</sup>
                </label>
                <Field name="minimumInterest" id="minimumInterest" type="number" min={0} />
                <ErrorMessage component={ErrorText} name="minimumInterest" />
              </div>
              <div className="row g-2">
                <label htmlFor="maximumInterest" style={{ fontWeight: "500" }}>
                  Maximum Interest  <sup className="text-danger">*</sup>
                </label>
                <Field name="maximumInterest" id="maximumInterest" type="number" min={0} required/>
                <ErrorMessage component={ErrorText} name="maximumInterest" />
              </div>
              <div className="row g-2">
                <label htmlFor="type" style={{ fontWeight: "500" }}>
                  Investment Type <sup className="text-danger">*</sup>
                </label>
                <Field name="type" id="type" as="select">
                  <option value="">Select Invt. Type</option>
                  {invtTypes.map((invtType) => (
                    <option
                      value={invtType.productTypeId}
                      key={invtType.productTypeId}
                    >
                      {invtType.productTypeDesc}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="type" />
              </div>
              <div className="row g-2">
                <label htmlFor="type" style={{ fontWeight: "500" }}>
                  Repayment Kind <sup className="text-danger">*</sup>
                </label>
                <Field name="kind" id="type" as="select" required>
                  <option value="">Select Rept. Kind</option>
                  {kinds.map((kind) => (
                    <option
                      value={kind.repaymentId}
                      key={kind.repaymentId}
                    >
                      {kind.repaymentName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage component={ErrorText} name="kind" />
              </div>
              <div className="row g-2">
                <label htmlFor="regDate" style={{ fontWeight: "500" }}>
                  Start Date <sup className="text-danger">*</sup>
                </label>
                <Field name="regDate" id="regDate" type="date" required/>
                <ErrorMessage component={ErrorText} name="regDate" />
              </div>
              <div className="row g-2">
                <label htmlFor="expiryDate" style={{ fontWeight: "500" }}>
                  Expiry Date<sup className="text-danger">*</sup>
                </label>
                <Field name="expiryDate" id="expiryDate" type="date" required/>
                <ErrorMessage component={ErrorText} name="expiryDate" />
              </div>
              <div className="row g-2">
                <label htmlFor="investmentAmount" style={{ fontWeight: "500" }}>
                  Max. Investment Amount <sup className="text-danger">*</sup>
                </label>
                <Field
                  name="investmentAmount"
                  id="investmentAmount"
                  type="number"
                  min={0}
                />
                <ErrorMessage component={ErrorText} name="investmentAmount" />
              </div>
            
              <div className="row g-2">
                <label
                  htmlFor="minInvestmentAmount"
                  style={{ fontWeight: "500" }}
                >
                  Min Investment Amount <sup className="text-danger">*</sup>
                </label>
                <Field name="minInvestmentAmount" id="minInvestmentAmount" />
                <ErrorMessage
                  component={ErrorText}
                  name="minInvestmentAmount"
                />
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
              className="d-flex justify-content-end gap-3 p-3 mt-4"
              style={{ backgroundColor: "#F2f2f2", borderRadius:'0 0 15px 15px' }}
            >
              <button className="py-2 px-3 rounded-4 border-0 btn-md" style={{backgroundColor:'#fafafa'}} type="reset">
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

export default AddNewInvestment;
