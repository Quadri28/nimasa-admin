import React,{useState, useContext, useEffect, useMemo,} from 'react'
import { ToastContainer, toast} from 'react-toastify';
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import GeneralLedgerTable from '../ConfigurationsSubComponents/ProductSettingComponent/GeneralLedgerTable'


const Restructure = () => {
  const [accounts, setAccounts] = useState([]);
  const [gl, setGl] = useState('');
  const [gls, setGls]= useState([])
  const [details, setDetails] = useState({});
  const [status, setStatus]= useState({})
  const [settlement, setSettlement]= useState({})
  const [repaymentAccounts, setRepaymentAccounts]= useState([])
  const [input, setInput] = useState({
    account:'', 
    valueDate:'',
    topUpAmount:'',
    duration:''
  });
  const handleChange=(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setInput({...input, [name]:value})
  }
  const { credentials } = useContext(UserContext);

  const getAccounts = () => {
    axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccounts(resp.data.data));
  };
  const getStatus=()=>{
    axios(`LoanApplication/loan-top-up-pay-amount-text-changed?CurrentBalance=${details?.currentBalance}&TopUpAmount=${input.topUpAmount}&Duration=${details?.loanTerm}&LoanRate=${details?.loanRate}&ProductCode=${details?.productCode}&AccountNumber=${settlement.settlementAccountNumber}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        setStatus(resp.data.data)
        if (resp.data.data.repaymentAccounts) {
          setRepaymentAccounts(resp.data.data.repaymentAccounts)
        }
      })
  }
  useEffect(()=>{
    getStatus()
  },[input.topUpAmount, details?.loanTerm, details?.loanRate, 
    details?.currentBalance, settlement.settlementAccountNumber])

  const getGls = () => {
    axios(`LoanApplication/loan-top-up-account-number-text-changed?AccountNumber=${input.account}`, {
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
  },[input.account])

  const TopUpLoan = (e) => {
    const payload = {
  loanAccountNo: input.account,
  loanFundingSource: gl,
  valueDate: input.valueDate,
  duration: Number(details?.loanTerm),
  topUpAmount: Number(input.topUpAmount),
  newPrincipalBalance: status.newPrincipalBalance
    };
    e.preventDefault();
    axios
      .post("LoanApplication/loan-top-up", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>
        toast(resp.data.data, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
      )
      .catch((error) =>
        toast(error.response.data.data, { type: "error", autoClose: false })
      );
  };

  const getSettlementAccountDetails=()=>{
    axios(`LoanApplication/loan-de-save-account-to-repay-from-selected-changed?AccountToRepayFrom=${gl}`,
       {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setSettlement(resp.data.data.loanFundingSourceAccountNoDetails))
  }
  useEffect(()=>{
  getSettlementAccountDetails()
  }, [gl])

  const column=[
    {Header:'Principal Repayment', accessor:'principalRepayment'},
    {Header:'Interest Repayment', accessor:'interestRepayment'},
    {Header:'Total Repayment', accessor:'totalRepayment'},
    {Header:'Balance', accessor:'balance'},
    {Header:'Pay Order', accessor: 'payOrder'}
  ]

  const columns = useMemo(() => column, []);
  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
      <div className="my-3">
        <span className="active-selector">Loan Top up:</span>
      </div>
      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="p-3 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <span style={{ fontWeight: "500", fontSize: "16px" }}>Loan Top up:</span>
        </div>
        <form onSubmit={TopUpLoan}>
          <div>
            <div className="px-3 admin-task-forms  bg-white pt-3 pb-4">
              <div className="d-flex flex-column gap-2 ">
                <label htmlFor="account" style={{ fontWeight: "500" }}>
                  Select Account Number<sup className="text-danger">*</sup>
                </label>
                <select
                  name="account"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {accounts.map((account, i) => (
                    <option value={account.accountNumber} key={i}>
                      {`${account.acctName}  >> ${account.accountNumber} >> ${account.product}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-2">
                <label htmlFor="settlementAcct" style={{ fontWeight: "500" }}>
                  Select Top up Account<sup className="text-danger">*</sup>
                </label>
                <select
                  name={gl}
                  required
                  onChange={(e)=>setGl(e.target.value)}
                >
                  <option value="">Select</option>
                  {gls?.map((account, i) => (
                    <option value={account.accountNo} key={i}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-2">
                <label htmlFor="valueDate" style={{ fontWeight: "500" }}>
                  Value Date<sup className="text-danger">*</sup>
                </label>
                <input name="valueDate" type="date" onChange={handleChange}/>
              </div>
              <div className="d-flex flex-column gap-2 ">
                <label htmlFor="topUpAmount" style={{ fontWeight: "500" }}>
                  Top up Amount<sup className="text-danger">*</sup>
                </label>
                <input name="topUpAmount" type="number" onChange={handleChange}/>
              </div>
              <div className="d-flex flex-column gap-2 ">
                <label htmlFor="duration" style={{ fontWeight: "500" }}>
                  Duration<sup className="text-danger">*</sup>
                </label>
                <input name="duration" type="number" value={details?.loanTerm} disabled/>
              </div>
              <div className="d-flex flex-column gap-2 ">
                <label htmlFor="balance" style={{ fontWeight: "500" }}>
                  New Principal Balance<sup className="text-danger">*</sup>
                </label>
                <input name='newPrincipalBalance' disabled value={status?.newPrincipalBalance}/>
              </div>
            </div>
          </div>
          <div className="px-3 mb-4 mt-2">
            <div
              className="d-flex flex-column gap-2 pb-3 px-0"
              style={{
                boxShadow: "3px 3px 3px 3px #ddd",
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
              <div className="accounting-form-container ">
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
                      {new Intl.NumberFormat("en-US", {}).format(
                        details?.loanAmount
                      )}
                    </p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Current Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {}).format(details?.currentBalance)}</p>
                  </div>
                
                </div>
                <div className="d-flex flex-column gap-2 px-3">
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
                    <span>Funding Account Name:</span>
                    <p>{settlement?.settlementAccountName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Funding Account Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {}).format(settlement?.settlementAccountBalance)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
            <GeneralLedgerTable data={repaymentAccounts} columns={columns}/>
            </div>
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
              style={{ backgroundColor: "var(--custom-color)" }}
              type="submit"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Restructure
