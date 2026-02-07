import React, { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { LiaTimesCircle } from "react-icons/lia";
import useScreenSize from "../../ScreenSizeHook";
import Modal from "react-modal";
import GeneralLedgerTable from "./ProductSettingComponent/GeneralLedgerTable";
import DatePicker from "react-datepicker";

const EditInvestment = () => {
  const { id } = useParams();
  const [investment, setInvestment] = useState({
    productCode: "",
    productName: "",
    productClass: "",
    appType: "",
    productStart: "",
    productExpire: "",
    currencyCode: "",
    intAccrual: "",
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
    closeTDAtMature: 0,
  });
  const [currencies, setCurrencies] = useState([]);
  const [terms, setTerms] = useState([]);
  const [glTypes, setGlTypes] = useState([]);
  const [glNodes, setGlNodes] = useState([]);
  const [glClasses, setGlClasses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [gl, setGl] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [input, setInput] = useState({});
  const [accountSelector, setAccountSelector] = useState("");
  const { credentials } = useContext(UserContext);

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
      border: "solid 1px #f2f2f2",
    },
  };

  const glCategories = [
    { name: "principal", label: "Principal Balance" },
    { name: "intIncome", label: "Interest Income" },
    { name: "suspint", label: "Suspended Interest" },
    { name: "tTax", label: "Withholding Tax" },
    { name: "interestAccrual", label: "Interest Accrual" },
    { name: "maturedGL", label: "Matured Placement GL" },
    { name: "suspPrinc", label: "Suspended Principal" },
    { name: "upFront", label: "Upfront Interest(Discounted Instruments)" },
    { name: "paymentGL", label: "Cash Payment GL" },
  ];
  const handleIconClick = (glName) => {
    setGl(glName); // Store the selected GL category name
    setModalShow(true);
  };

  const handleClose = () => {
    if (gl) {
      setInvestment((prevDetails) => ({
        ...prevDetails,
        [gl]: accountSelector, // Update the specific GL category input field
      }));
    }
    setModalShow(false);
  };

  //Modal contents handling
  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const fetchGlTypes = async () => {
    await axios
      .get("GlAccount/gl-type", {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => setGlTypes(resp.data));
  };

  const fetchGlNodes = async () => {
    await axios
      .get(`GlAccount/gl-type-node?prodTypeCode=${input.glType}`, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => setGlNodes(resp.data.data));
  };

  const fetchNodeClasses = () => {
    axios(`GlAccount/gl-type-class?glTypeNodeCode=${input.glNode}`, {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => {
      setGlClasses(resp.data.data);
    });
  };

  const fetchGlAccounts = () => {
    axios(`LoanProduct/gl-account-number?glClass=${input.glClass}`, {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => {
      setAccounts(resp.data.data);
    });
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
    fetchGlAccounts();
  }, [input.glClass]);

  const column = [
    {
      Header: "Select",
      accessor: "",
      Cell: ({ cell }) => {
        const acctNumber = cell.row.original.glNumber;
        return (
          <div className="d-flex justify-content-center align-items-center">
            <input
              type="radio"
              name="accountSelector"
              onChange={() => {
                setAccountSelector(acctNumber);
              }}
            />
          </div>
        );
      },
    },
    { Header: "Gl acct No", accessor: "glNumber" },
    { Header: "Acct title", accessor: "accountName" },
    { Header: "Branch office", accessor: "branch" },
    { Header: "Date opened", accessor: "dateOpened" },
    {
      Header: "Bk balance",
      accessor: "bookBalance",
      Cell: ({ value }) => {
        return (
          <span>
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
            }).format(value)}
          </span>
        );
      },
    },
  ];

  const columns = useMemo(() => column, []);

  const getInvestment = () => {
    axios(`InvestmentProduct/get-investment-product-by-code?savingCode=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setInvestment(resp.data.data));
  };
  const getCurrencies = () => {
    axios("Common/get-currencies").then((resp) => setCurrencies(resp.data));
  };
  const getTerms = () => {
    axios("Common/getloanfrequencies").then((resp) => setTerms(resp.data));
  };
  useEffect(() => {
    getInvestment();
    getCurrencies();
    getTerms();
  }, []);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInvestment({ ...investment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      productCode: investment.productCode,
      productName: investment.productName,
      productClass: String(investment.productClass),
      productType: investment.appType,
      productStart: investment.productStart,
      productExpire: investment.productExpire,
      currencyCode: investment.currencyCode,
      intAccrual: investment.intAccrual,
      MinimumInterest: Number(investment.minTerm),
      MaximumInterest: Number(investment.maxTerm),
      MiniMumTerm: investment.mnType,
      MaximumTerm: investment.mxType,
      repayMeth: investment.repayMeth,
      term: investment.term,
      shortName: investment.shortName,
      intIncome: investment.intIncome,
      principal: investment.principal,
      tTax: investment.tTax,
      upfront: investment.upfront,
      paymentGL: investment.paymentGL,
      maturedGL: investment.maturedGL,
      suspInt: investment.suspInt,
      suspPrinc: investment.suspPrinc,
      closeTDAtMature: investment.closeTDAtMature,
    };
    const toastOptions = {
      pauseOnHover: true,
      autoClose: 5000,
      type: "success",
    };
    axios
      .post("InvestmentProduct/update-investment-product", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, toastOptions);
        setTimeout(() => {
        navigate(-1);
        }, 5000);
      })
      .catch((error) => {
        const toastErrorOptions = {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
        };
        toast(error.response.data.message, toastErrorOptions);
      });
  };

  return (
    <div
      className="card rounded-4 mt-3"
      style={{ border: "solid .5px #fafafa" }}
    >
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
      >
        <div className="d-flex gap-1 align-items-center">
          <BsArrowLeft
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          Edit Investment Product
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ borderRadius: "0 0 15px 15px" }}>
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Product Code:
            </label>
            <input
              name="productCode"
              id="productCode"
              value={investment?.productCode}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productName" style={{ fontWeight: "500" }}>
              Product Name:
            </label>
            <input
              name="productName"
              id="productName"
              value={investment?.productName}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="shortName" style={{ fontWeight: "500" }}>
              ShortName:
            </label>
            <input
              name="shortName"
              id="shortName"
              value={investment?.shortName}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productClass" style={{ fontWeight: "500" }}>
              Product Class:
            </label>
            <select
              name="productClass"
              id="productClass"
              value={investment?.productClass}
              onChange={handleChange}
            >
              <option value="6">Placement</option>
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="currencyCode" style={{ fontWeight: "500" }}>
              Currency Code:
            </label>
            <select
              name="currencyCode"
              id="currencyCode"
              value={investment?.currencyCode}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {currencies.map((currency) => (
                <option value={currency.countryCode} key={currency.countryCode}>
                  {currency.currencyName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="productStart" style={{ fontWeight: "500" }}>
              Start Date:
            </label>
            <DatePicker
              selected={
                investment?.productStart &&
                !isNaN(Date.parse(investment.productStart))
                  ? new Date(investment.productStart)
                  : null
              }
              onChange={(date) =>
                handleChange({
                  target: { name: "productStart", value: date },
                })
              }
              className="w-100"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productExpire" style={{ fontWeight: "500" }}>
              Expiry Date:
            </label>
            <DatePicker
                                             selected={
                                              investment?.productExpire && !isNaN(Date.parse(investment.productExpire))
                                                 ? new Date(investment.productExpire)
                                                 : null
                                             }
                                                onChange={(date) =>
                                                  handleChange({
                                                    target: { name: "productExpire", value: date },
                                                  })
                                                }
                                                className="w-100"
                                                dateFormat="dd-MM-yyyy"
                                              />
          </div>
          <div className="row g-2">
            <label htmlFor="productType" style={{ fontWeight: "500" }}>
              Product Type:
            </label>
            <select
              name="productType"
              id="productType"
              value={investment?.productType}
              onChange={handleChange}
            >
              <option value="6">PLACEMENTS</option>
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="mnType" style={{ fontWeight: "500" }}>
              Minimum Term:
            </label>
            <input
              name="mnType"
              id="mnType"
              value={investment?.mnType}
              onChange={handleChange}
              min={0}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="mxType" style={{ fontWeight: "500" }}>
              Maximum Term:
            </label>
            <input
              name="mxType"
              id="mxType"
              value={investment?.mxType}
              min={0}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="term" style={{ fontWeight: "500" }}>
              Term:
            </label>
            <select
              name="term"
              id="term"
              value={investment?.term}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {terms.map((term) => (
                <option value={term.freqCode} key={term.freqCode}>
                  {term.freqName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="repayMeth" style={{ fontWeight: "500" }}>
              Repayment Method:
            </label>
            <input
              name="repayMeth"
              id="repayMeth"
              value={investment?.repayMeth}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="minTerm" style={{ fontWeight: "500" }}>
              Minium Interest:
            </label>
            <input
              name="minTerm"
              id="minTerm"
              value={investment?.minTerm}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="row g-2">
            <label htmlFor="maxTerm" style={{ fontWeight: "500" }}>
              Maximum Interest:
            </label>
            <input
              name="maxTerm"
              id="maxTerm"
              value={investment?.maxTerm}
              onChange={handleChange}
              type="number"
            />
          </div>
        </div>

        <div className="px-3">
          <div className="admin-task-forms">
            <span style={{ fontWeight: "500" }}>General Ledger</span>{" "}
            <div></div>
            {glCategories.map((category) => {
              return (
                <div className="d-flex flex-column gap-1">
                  <label className="">{category.label}</label>
                  <div style={{ position: "relative" }}>
                    <CiSearch
                      size={20}
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        right: "0%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handleIconClick(category.name)}
                    />
                    <input
                      type="text"
                      name={category.name}
                      className="w-100"
                      value={investment[category.name] || ""}
                      onChange={(e) => {
                        const name = category.name;
                        const value = e.target.value;
                        setDetails((prevDetails) => ({
                          ...prevDetails,
                          [name]: value,
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Modal to get gl Account */}
          <Modal
            isOpen={modalShow}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
            <div
              style={{
                backgroundColor: "#F5F9FF",
                borderRadius: "15px  15px 0 0",
                padding: "15px 20px",
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <BsArrowLeft />{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#4D4D4D",
                    }}
                  ></span>
                  General ledger enquiry
                </div>
                <LiaTimesCircle
                  onClick={() => handleClose()}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="admin-task-forms px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glTypes">GL type</label>
                <select type="text" name="glType" onChange={changeHandler}>
                  <option value="">Select</option>
                  {glTypes.map((type) => (
                    <option value={type.prodTypeCode} key={type.prodTypeCode}>
                      {type.prodTypeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glNode">GL node</label>
                <select type="text" name="glNode" onChange={changeHandler}>
                  <option value="">Select</option>
                  {glNodes?.map((node) => (
                    <option value={node.gl_NodeCode} key={node.gl_NodeCode}>
                      {node.gl_NodeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glClass">GL class</label>
                <select type="text" name="glClass" onChange={changeHandler}>
                  <option value="">Select</option>
                  {glClasses.map((clas) => (
                    <option value={clas.gl_ClassCode} key={clas.gl_ClassCode}>
                      {clas.gl_ClassName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glAccount">GL account</label>
                <input name="glAccount" value={accountSelector} />
              </div>
            </div>
            <div className="px-3 my-2">
              <GeneralLedgerTable data={accounts} columns={columns} />
            </div>
            <div className="d-flex justify-content-end px-3 mb-4">
              <button
                onClick={() => {
                  handleClose();
                }}
                className="member border-0 btn-md"
              >
                Proceed
              </button>
            </div>
          </Modal>
        </div>

        <div
          className="d-flex justify-content-end  mt-3 p-3"
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 15px 15px" }}
        >
          <button type="submit" className="member btn-md border-0">
            Submit
          </button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default EditInvestment;
