import React, { useContext, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import GeneralLedgerTable from '../ConfigurationsSubComponents/ProductSettingComponent/GeneralLedgerTable'
import { Combobox } from "react-widgets/cjs";
import UnpaginatedTable from "../Reports/UnpaginatedTable";

const PartialDesave = () => {
  const [accounts, setAccounts] = useState([]);
  const [gls, setGls] = useState([]);
  const [details, setDetails] = useState({});
  const [balance, setBalance] = useState({})
  const [schedules, setSchedules]= useState([])
  const [account, setAccount] = useState('')
  const [input, setInput] = useState({
    settlementAcct:'',
    valueDate:'',
    payOffAmount:'',
    duration:''
  });
  const handleChange=(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setInput({...input, [name]:value})
  }

  const changeHandler=(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setDetails({...details, [name]:value})
  }
  const { credentials } = useContext(UserContext);

  const getBalance=()=>{
    axios(`LoanApplication/loan-de-save-partial-pay-off-amount-text-changed?CurrentBalance=${details?.currentBalance}&PayOffAmount=${input.payOffAmount}&Duration=${details?.remainingTerm}&LoanRate=${details?.loanRate}&ProductCode=${details?.productCode}&AccountNumber=${account}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }})
      .then(resp=>{
        if (resp.data.data.repaymentAccounts) {
          setSchedules(resp.data.data.repaymentAccounts)
        }
        setBalance(resp.data.data)
      })
  }

  useEffect(()=>{
getBalance()
  },[input.payOffAmount, details?.currentBalance, details?.remainingTerm, details?.loanRate, account])
  const getAccounts = () => {
    axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccounts(resp.data.data));
  };
  const getGls = () => {
    axios(`LoanApplication/loan-de-save-partial-account-number-text-changed?AccountNumber=${account}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setGls(resp.data.data.repaymentAccounts)
      setDetails(resp.data.data.loanAccountDetails)
    });
  };
  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(()=>{
    getGls();
  },[account])

  const postPartialDesave = (e) => {
    const payload = {
  accountNumber: account,
  accountToRepayFrom: input.settlementAcct,
  valueDate: input.valueDate,
  duration: Number(details?.remainingTerm),
  payOffAmount: Number(input.payOffAmount),
  newPrincipalBalance: balance.newPrincipalBalance
    };
    e.preventDefault();
    axios
      .post("LoanApplication/loan-de-save-partial", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
      )
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

const column =[
  {Header:'Principal Repayment', accessor:'principalRepayment', Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
  })},
  {Header:'Interest Repayment', accessor:'interestRepayment',  Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
  })},
  {Header:'Total Repayment', accessor:'totalRepayment', Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
  })},
  {Header:'Balance', accessor:'balance', Cell:(({value})=>{
    return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
  })},
  {Header:'Pay Order', accessor:'payOrder'},
  {Header:'Due Date', accessor:'dueDate', Cell:(({value})=>{
    return <span>{new Date(value).toLocaleDateString('en-US')}</span>
  })},
]
const columns = useMemo(() => column, []);

 const formattedAccounts = accounts.map((e) => ({
  ...e,
  label: `${e.acctName}  >> ${e.accountNumber} >> ${e.product}`,
}));
  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
      <div className="mb-4 mt-2">
        <span className="active-selector">Partial Liqudation</span>
      </div>
      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="py-3 px-3 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <span style={{ fontWeight: "500", fontSize: "16px", color:'#333' }}>Loan Partial Liqudation</span>
        </div>
        <form onSubmit={postPartialDesave}>
          <div>
            <div className="px-3 admin-task-forms  bg-white py-4">
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="account" style={{ fontWeight: "500" }}>
                  Select Account Number<sup className="text-danger">*</sup>
                </label>
               <Combobox
                      data={formattedAccounts}
                      value={account}
                      onChange={(val) => setAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                       />
              </div>
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="settlementAcct" style={{ fontWeight: "500" }}>
                  Select Settlement Account<sup className="text-danger">*</sup>
                </label>
                <select
                  name="settlementAcct"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {gls?.map((account, i) => (
                    <option value={account.accountNo} key={i}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="valueDate" style={{ fontWeight: "500" }}>
                  Value Date<sup className="text-danger">*</sup>
                </label>
                <input name="valueDate" type="date" onChange={handleChange}/>
              </div>
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="payOffAmount" style={{ fontWeight: "500" }}>
                  Payoff Amount <sup className="text-danger">*</sup>
                </label>
                <input name="payOffAmount" type="number" onChange={handleChange}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="duration" style={{ fontWeight: "500" }}>
                 Remaining Duration <sup className="text-danger">*</sup>
                </label>
                <input name="remainingTerm" type="number" value={details?.remainingTerm} onChange={changeHandler}/>
              </div>
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="balance" style={{ fontWeight: "500" }}>
                  New Principal Balance <sup className="text-danger">*</sup>
                </label>
                <input name='balance' disabled value={new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(balance.newPrincipalBalance)}/>
              </div>
            </div>
          </div>

          <div className="px-3 mb-4 admin-task-forms">
            <div
              className="d-flex flex-column gap-2 pb-3 px-0"
              style={{
                boxShadow: "3px 3px 3px 3px #fafafa",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#EDF4FF",
                  paddingTop: "10px",
                  paddingInline: "15px",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <p>Loan Account Details</p>
              </div>
              <>
                <div className="d-flex flex-column gap-2 px-3">
                  <div className="d-flex gap-3 discourse">
                    <span>Loan Type:</span>
                    <p>{details?.lonType}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Branch:</span>
                    <p>{details?.branch}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Account Name:</span>
                    <p>{details?.accountName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Loan Amount:</span>
                    <p>
                      {new Intl.NumberFormat("en-US", {minimumFractionDigits:2}).format(
                        details?.loanAmount
                      )}
                    </p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Current Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.currentBalance)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Loan Term:</span>
                    <p>{details?.loanTerm}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Loan Rate:</span>
                    <p>{details?.loanRate}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Remaining Term:</span>
                    <p>{details?.remainingTerm}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Frequency Type:</span>
                    <p>{details?.frequencyName}</p>
                  </div>
                </div>
              </>
            </div>
            <UnpaginatedTable data={schedules} columns={columns} filename={'Amortization schedule'}/>
          </div>
          <div
            className="d-flex justify-content-end gap-3 py-4 px-2"
            style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button
              className="btn btn-md rounded-5 py-1 px-3"
              style={{ backgroundColor: "#F7F7F7" }}
              type="reset"
            >
              Discard
            </button>
            <button
              className="btn btn-md text-white rounded-5"
              style={{ backgroundColor: "#0452C8" }}
              type="submit"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PartialDesave;
