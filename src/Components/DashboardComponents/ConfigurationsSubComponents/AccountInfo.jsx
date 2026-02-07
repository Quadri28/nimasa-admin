import React, { useContext, useEffect, useState } from "react";
import CoopLogo from "../../../assets/CoopLogo.png";
import axios from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AccountInfo = ({
  handleChange,
  details,
  openModal,
  handleOpenModal,
}) => {
  const [currencies, setCurrencies] = useState([]);
  const { credentials } = useContext(UserContext);
  const [accounts, setAccounts]= useState([])
  const [resultDate, setResultDate]= useState('')
  const getCurrencies = () => {
    axios("Common/get-currencies").then((resp) => setCurrencies(resp.data));
  };

  const fetchGLAccounts=async()=>{
    await axios('Acounting/general-ledger-customer-enquiry?SearchOption=1', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setAccounts(resp.data.data)
 )}
  useEffect(() => {
    getCurrencies();
    fetchGLAccounts()
  }, []);


  const submitHandler = (e) => {
    e.preventDefault();
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
      nextFinancialYear: resultDate?.endDate,
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
      .then((resp) =>
        toast("Account information updated successfully", toastOptions)
      );
  };

  function getYearInterval(inputDateString) {
  const inputDate = new Date(inputDateString);

  // Add 1 year
  const nextYear = new Date(inputDate);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  return {
    endDate: nextYear.toISOString().split('T')[0]
  };
}

  const handleGetYear = () => {
    const newDate = getYearInterval(details?.lastFinancialYear, parseInt(1));
    setResultDate(newDate)}
    
useEffect(()=>{
 handleGetYear()
}, [details?.lastFinancialYear])
console.log(resultDate)

  return (
    <div
      className="card mt-4 rounded-4"
      style={{ border: "solid .5px #F2F2F2" }}
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
            {details?.bankName ? (
              <span style={{ fontWeight: "500", fontSize: "18px" }}>
                {details?.bankName}
              </span>
            ) : (
              <b>Cooperative name here </b>
            )}
            {details?.slogan ? (
              <span> {details?.slogan}</span>
            ) : (
              <span>Cooperative slogan goes here</span>
            )}
          </div>
        </div>
        <div className="btn-upload-container">
          <button
            onClick={() => openModal()}
            className="btn btn-sm"
            style={{
              backgroundColor: "#E6F0FF",
              color: "#0452C8",
              borderRadius: "1.2rem",
              fontSize: "12px",
            }}
          >
            Upload logo
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-sm p-2"
            style={{
              backgroundColor: "var(--custom-color)",
              color: "#fff",
              borderRadius: "1.2rem",
              fontSize: "12px",
            }}
          >
            Upload by-law
          </button>
        </div>
      </div>
      <form onSubmit={submitHandler}>
        <div className="px-3 admin-task-forms mt-2 py-3">
          <div className="d-flex flex-column gap-2">
            <label htmlFor="currencyCode" style={{ fontWeight: "500" }}>
              Currency:
            </label>
            <select
              name="currencyCode"
              id="currencyCode"
              as="select"
              value={details?.currencyCode}
              onChange={handleChange}
            >
              <option value="" disabled>
                select
              </option>
              {currencies.map((currency, i) => (
                <option value={currency.countryCode} key={i}>
                  {currency.currencyName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="priorpandlacct" style={{ fontWeight: "500" }}>
              End of the year P & L account:
            </label>
            <select
              name="priorpandlacct"
              id="state"
              value={details?.priorpandlacct}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber}
                 key={account.acctName}>{`${account.accountNumber} >> ${account.acctName}`}</option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="pAndLAccount" style={{ fontWeight: "500" }}>
              P & L account:
            </label>
            <select
              name="pAndLAccount"
              id="pAndLAccount"
              value={details?.pAndLAccount}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.acctName}>
                  {`${account.accountNumber} >> ${account.acctName}`}</option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="incomeAccount" style={{ fontWeight: "500" }}>
              Income account:
            </label>
            <select
              name="incomeAccount"
              id="incomeAccount"
              value={details?.incomeAccount}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.acctName}>
                  {`${account.accountNumber} >> ${account.acctName}`}</option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="payableAccount" style={{ fontWeight: "500" }}>
              Payable Account
            </label>
            <select
              name="payableAccount"
              id="payableAccount"
              value={details?.payableAccount}
              onChange={handleChange}
            >
              <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.accName}>
                  {`${account.accountNumber} >> ${account.acctName}`}
                </option>
              ))
            }
              </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="regFeeAccount" style={{ fontWeight: "500" }}>
              Registration fee account:
            </label>
            <select
              name="regFeeAccount"
              id="regFeeAccount"
              value={details?.regFeeAccount}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.acctName}>
                  {`${account.accountNumber} >> ${account.acctName}`}
                </option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="cashAccount" style={{ fontWeight: "500" }}>
              Cash account:
            </label>
            <select
              name="cashAccount"
              id="cashAccount"
              value={details?.cashAccount}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.acctName}>
                  {`${account.accountNumber} >> ${account.acctName}`}
                </option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="expenseAccount" style={{ fontWeight: "500" }}>
              Expense account:
            </label>
            <select
              name="expenseAccount"
              id="expenseAccount"
              value={details?.expenseAccount}
              onChange={handleChange}
            >
            <option value="">Select</option>
            {
              accounts.map(account=>(
                <option value={account.accountNumber} key={account.acctName}>
                  {`${account.accountNumber} >> ${account.acctName}`}
                </option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2 w-100">
            <label htmlFor="lastFinancialYear" style={{ fontWeight: "500" }}>
              Last financial year:
            </label>
            <DatePicker
              selected={details?.lastFinancialYear ? new Date(details?.lastFinancialYear): null}
              onChange={(date) =>
                handleChange({
                  target: { name: "lastFinancialYear", value: date },
                })
              }
              className="w-100"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <label style={{ fontWeight: "500" }}>
              Next financial year:
            </label>
            <input
              value={resultDate.endDate}
              className="w-100"
              dateFormat="dd-MM-yyy"
              disabled
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-end gap-3 mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 15px 15px" }}
        >
          <button
            className="btn btn-md"
            style={{
              backgroundColor: "var(--custom-color)",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: "1.5rem",
              fontSize: "14px",
            }}
            type="submit"
          >
            Save changes
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AccountInfo;
