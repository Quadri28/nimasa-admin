import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";

const LoanRestructure = () => {
  const [sources, setSources] = useState([]);
  const [loans, setLoans] = useState([]);
  const [calcMethods, setCalcMethods] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [loanSources, setLoanSources] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [colTypes, setColTypes] = useState([]);
  const [repayTypes, setRepayTypes] = useState([]);
  const [members, setMembers] = useState([]);
  const [noOfDays, setNoOFDays] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loanAccount, setLoanAccount]= useState('')
  const [details, setDetails] = useState({
    customerId: "",
    group: "",
    loanProduct: "",
    loanFundingSource: "",
    loanRate: "",
    calcMethod: "",
    repaymentType: "",
    collateralValue: "",
    collateralType: "",
    drawDownDate: "",
    startDate: "",
    firstPaymentDate: "",
    loanSource: "",
    collateralDetail: "",
    loanPurpose: "",
  });
  const { credentials } = useContext(UserContext);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
 
  const addMonths = (startDate, monthsToAdd) => {
  const date = new Date(startDate);
  if (isNaN(date) || isNaN(monthsToAdd)) return null;
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
};
const futureDate = addMonths(details?.firstPaymentDate, details?.term -1);

  const getMembers = () => {
    axios("MemberManagement/get-member-detail-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setMembers(resp.data.data));
  };
  const getRepaymentTypes = () => {
    axios("LoanApplication/loan-repayment-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setRepayTypes(resp.data.data));
  };
  const getCollateralTypes = () => {
    axios("LoanApplication/get-collateral-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setColTypes(resp.data.data));
  };

  const getLoanSources = () => {
    axios("LoanApplication/get-loan-source-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setLoanSources(resp.data.data));
  };
  const getFrequencies = () => {
    axios("LoanApplication/loan-frequency-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setFrequencies(resp.data.data));
  };
  const getCalculationMethods = () => {
    axios("Common/calculation-method", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCalcMethods(resp.data));
  };

  const getSources = () => {
    axios("LoanApplication/get-loan-funding-source", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setSources(resp.data.data));
  };
  const getLoans = () => {
    axios("LoanApplication/get-loan-product", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setLoans(resp.data.data));
  };

  const getNoOfDays = () => {
    if (details?.frequency === "001") {
      setNoOFDays(7);
      setTerm(7);
    } else if (details?.frequency === "002") {
      setNoOFDays(7 * details?.term);
    } else if (details?.frequency === "003") {
      setNoOFDays(14 * details?.term);
    } else if (details?.frequency === "004") {
      setNoOFDays(30 * details?.term);
    }
  };

  
  useEffect(() => {
    getNoOfDays();
  }, [details?.term, details?.frequency]);
  useEffect(() => {
    getLoans();
    getSources();
    getFrequencies();
    getCollateralTypes();
    getLoanSources();
    getRepaymentTypes();
    getMembers();
    getCalculationMethods();
  }, []);

  const getLoanAccounts = async () => {
    await axios(
      `LoanApplication/get-member-loan-account-numbers?customerId=${details?.customerId}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setAccounts(resp.data.data));
  };

  useEffect(() => {
    getLoanAccounts();
  }, [details?.customerId]);

  const getDetails = async () => {
    await axios(
      `LoanApplication/get-loan-account-detail-by-loan-account-number?AccountNumber=${loanAccount}`,
      { headers: { Authorization: `Bearer ${credentials.token}` } }
    ).then((resp) => setDetails(resp.data.data));
  };
  useEffect(() => {
    getDetails();
  }, [loanAccount]);

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      loanAccountNumber: loanAccount,
      customerId: details.customerId,
      group: details.group,
      loanProduct: details.loanProduct,
      loanFundingSource: details.loanFundingSource,
      branch: "001",
      loanAmount: Number((details?.loanAmount || "").toString().replace(/,/g, "")),
      loanRate: details.loanRate,
      term: String(details.term),
      frequency: details.frequency,
      noOfDays: Number(noOfDays),
      postingDate: new Date(),
      calculationMethod: String(details.calculationMethod),
      repaymentType: String(details.repaymentType),
      collateralValue: String(details.collateralValue),
      collateralType: String(details.collateralType),
      drawDownDate: details.drawDownDate,
      startDate: details.startDate,
      firstPaymentDate: details.firstPaymentDate,
      maturityDate: futureDate,
      loanSource: String(details.loanSource),
      collateralDetail: details.collateralDetail,
      loanPurpose: details.loanPurpose,
      lending: details?.lending,
      lien: details.lien
    };
    setLoading(true);
    axios
      .post("LoanApplication/loan-restructure", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setLoading(false);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
        setLoading(false);
      });
  };

  return (
    <>
      <form
        className="bg-white rounded-4"
        style={{ border: "solid .5px #fafafa" }}
        onSubmit={onSubmit}
      >
        <div
          className="p-3 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <span
          
            style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}
          >
            Loan Restructuring
          </span>
        </div>
        <div className="p-3 admin-task-forms">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="customerId" style={{ fontWeight: "500" }}>
              Customer ID<sup className="text-danger">*</sup>
            </label>
            <select
              name="customerId"
              onChange={handleChange}
              className="text-lowercase"
            >
              <option value="">Select</option>
              {members.map((member) => (
                <option
                  value={member.customerId}
                  key={member.customerId}
                  className="text-lowercase"
                >
                  {member.fullname}{" "}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="loanAccount" style={{ fontWeight: "500" }}>
              Loan Account<sup className="text-danger">*</sup>
            </label>
            <select
              name="loanAccount"
              onChange={(e)=>setLoanAccount(e.target.value)}
              className="text-lowercase"
            >
              <option value="">Select</option>
              {accounts.map((account) => (
                <option
                  value={account.accountNumber}
                  key={account.accountNumber}
                  className="text-lowercase"
                >
                  {account.accountProduct}{" "}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="loanProduct" style={{ fontWeight: "500" }}>
              Loan product<sup className="text-danger">*</sup>
            </label>
            <select name="loanProduct" value={details?.loanProduct} disabled>
              <option value="">Select</option>
              {loans.map((loan) => (
                <option value={loan.productCode} key={loan.productCode}>
                  {loan.productName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="loanFundingSource" style={{ fontWeight: "500" }}>
              Loan funding source<sup className="text-danger">*</sup>
            </label>
            <select name="loanFundingSource" value={details?.loanFundingSource} disabled>
              <option value="">Select</option>
              {sources.map((source) => (
                <option value={source.glNumber} key={source.glNumber}>
                  {source.accountName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="loanAmount" style={{ fontWeight: "500" }}>
              Loan Amount<sup className="text-danger">*</sup>
            </label>
            <NumericFormat
              name="loanAmount"
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={2}
              value={details?.loanAmount}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="loanRate" style={{ fontWeight: "500" }}>
              Loan Rate<sup className="text-danger">*</sup>
            </label>
            <input
              name="loanRate"
              value={details?.loanRate}
              min={0}
              type="decimal"
              onChange={handleChange}
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="frequency" style={{ fontWeight: "500" }}>
              Frequency<sup className="text-danger">*</sup>
            </label>
            <select
              name="frequency"
              value={details?.frequency}
              disabled
            >
              <option value="">Select</option>
              {frequencies.map((freq) => (
                <option value={freq.frequencyCode} key={freq.frequencyCode}>
                  {freq.frequencyName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="postingDate" style={{ fontWeight: "500" }}>
              Posting date<sup className="text-danger">*</sup>
            </label>
            <input
              name="postingDate"
              disabled
              value={new Date().toLocaleDateString("en-US")}
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="calculationMethod" style={{ fontWeight: "500" }}>
              Calculation method<sup className="text-danger">*</sup>
            </label>
            <select
              name="calculationMethod"
              value={details?.calculationMethod}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {calcMethods.map((method) => (
                <option value={method.value} key={method.value}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="term" style={{ fontWeight: "500" }}>
              Term<sup className="text-danger">*</sup>
            </label>
            <input name="term" type="number" value={details?.term} onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="repaymentType" style={{ fontWeight: "500" }}>
              Repayment type<sup className="text-danger">*</sup>
            </label>
            <select
              name="repaymentType"
              value={details?.repaymentType}
            onChange={handleChange}              
            >
              <option value="">Select</option>
              {repayTypes.map((type) => (
                <option value={type.repaymentId} key={type.repaymentId}>
                  {type.repaymentName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="collateralType" style={{ fontWeight: "500" }}>
              Collateral type<sup className="text-danger">*</sup>
            </label>
            <select
              name="collateralType"
              value={details?.collateralType}
              disabled
            >
              <option value="">Select</option>
              {colTypes.map((type) => (
                <option value={type.collateralId} key={type.collateralId}>
                  {type.collateralName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="collateralValue" style={{ fontWeight: "500" }}>
              Collateral value<sup className="text-danger">*</sup>
            </label>
            <NumericFormat
              name="collateralValue"
              value={details.collateralValue}
              fixedDecimalScale={true}
              decimalScale={2}
              thousandSeparator={true}
              disabled
            />
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="startDate" style={{ fontWeight: "500" }}>
              Start date<sup className="text-danger">*</sup>
            </label>
            <DatePicker
              selected={
                details?.startDate ? new Date(details?.startDate) : null
              }
              onChange={(date) =>
                handleChange({
                  target: { name: "startDate", value: date },
                })
              }
              className="w-100"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="collateralDetail" style={{ fontWeight: "500" }}>
              Collateral detail<sup className="text-danger">*</sup>
            </label>
            <input name="collateralDetail" value={details?.collateralDetail} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="drawDownDate" style={{ fontWeight: "500" }}>
              Drawdown date<sup className="text-danger">*</sup>
            </label>
            <DatePicker
              selected={
                details?.drawDownDate ? new Date(details?.drawDownDate) : null
              }
              onChange={(date) =>
                handleChange({
                  target: { name: "drawDownDate", value: date },
                })
              }
              className="w-100"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="noOfDays" style={{ fontWeight: "500" }}>
              Number of days<sup className="text-danger">*</sup>
            </label>
            <input name={noOfDays} value={noOfDays} disabled />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="firstPaymentDate" style={{ fontWeight: "500" }}>
              First payment date<sup className="text-danger">*</sup>
            </label>
            <DatePicker
              selected={
                details?.firstPaymentDate
                  ? new Date(details?.firstPaymentDate)
                  : null
              }
              onChange={(date) =>
                handleChange({
                  target: { name: "firstPaymentDate", value: date },
                })
              }
              className="w-100"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="maturityDate" style={{ fontWeight: "500" }}>
              Maturity date<sup className="text-danger">*</sup>
            </label>
             <DatePicker
  selected={futureDate instanceof Date ? futureDate : null}
  dateFormat="dd-MM-yyyy"
/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="loanSource" style={{ fontWeight: "500" }}>
              Loan source<sup className="text-danger">*</sup>
            </label>
            <select name="loanSource" value={details?.loanSource} disabled>
              <option value="">Select</option>
              {loanSources.map((source) => (
                <option value={source.loanSourceId} key={source.loanSourceId}>
                  {source.loanSourceName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="loanPurpose" style={{ fontWeight: "500" }}>
              Loan purpose<sup className="text-danger">*</sup>
            </label>
            <input name="loanPurpose" value={details?.loanPurpose} disabled/>
          </div>
        </div>
        <div
          className="d-flex justify-content-end gap-3 py-4 px-2"
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 15px 15px" }}
        >
          <button
            className="btn btn-md text-white rounded-5"
            style={{ backgroundColor: "var(--custom-color)" }}
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </form>

      <ToastContainer />
    </>
  );
};

export default LoanRestructure;
