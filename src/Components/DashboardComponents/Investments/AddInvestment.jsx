import React, { useContext, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const AddInvestment = () => {
  const [input, setInput] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [noOfDays, setNoOFDays]= useState(null)
  const [generalDetails, setGeneralDetails]= useState({})
  const [banks, setBanks] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [gls, setGLs] = useState([]);
  const [tax, setTax] = useState(true);
  const navigate = useNavigate();
  const { credentials } = useContext(UserContext);

const getAccountDetails=()=>{
    axios(`Investment/funding-account-selected-index-change?FundingAccount=${input.fundingAccount}`, {
        headers:{Authorization: `Bearer ${credentials.token}`}
    }).then(resp=>setAccountDetails(resp.data.data.fundingAccountDetail))
}
useEffect(()=>{
getAccountDetails()
}, [input.fundingAccount])
  const getProductDetail = () => {
    axios(
      `Investment/investment-product-select-changed?ProductCode=${String(
        input.product
      )}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setProductDetails(resp.data.data.productDetail));
  };
  const getInstruments = () => {
    axios(
      `Investment/instrument-type-selected-index-change?ProductCode=${String(
        input.product
      )}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setInstruments(resp.data.data.instrumentTypes));
  };
  useEffect(() => {
    getProductDetail();
    getInstruments();
  }, [input.product]);

  const getFrequencies = () => {
    axios("Common/getloanfrequencies", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setFrequencies(resp.data));
  };
  const getBranches = () => {
    axios("Common/get-branches", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBranches(resp.data));
  };
  const getProducts = () => {
    axios("Investment/get-investment-product-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProducts(resp.data.data));
  };
  const getBanks = () => {
    axios("Investment/get-investment-bank-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBanks(resp.data.data));
  };

  const fetchGLs = () => {
    axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${1}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setGLs(resp.data.data));
  };

  useEffect(() => {
    getFrequencies();
    fetchGLs();
    getProducts();
    getBranches();
    getBanks();
  }, []);

  const getGeneralDetails=()=>{
    axios(`Investment/general-selected-change?InvestmentProduct=${input.product}&InvestmentAmount=
        ${input.amount}&Term=${input.term}&Frequency=${input.frequency}&NoOfDays=${noOfDays}&InvestmentRate=${input.investmentRate}&PaymentType=${input.paymentType}&IncludeTax=${tax}&StartDate=${input.startDate}`, {headers:{
          Authorization: `Bearer ${credentials.token}`
        }})
        .then(resp=>setGeneralDetails(resp.data.data))
  }
  useEffect(()=>{
    getGeneralDetails()
  }, [input.product, input.amount, input.term, input.frequency, 
    input.noOfDays, input.investmentRate, input.paymentType, tax, input.startDate])
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };
  const addInvestment = (e) => {
    e.preventDefault();
    const payload = {
      investmentProduct: input.product,
      investmentAmount: input.amount,
      branch: input.branch,
      term: Number(input.term),
      frequency: input.frequency,
      noOfDays: noOfDays,
      investmentRate: Number(input.investmentRate),
      paymentType: Number(input.paymentType),
      postingDate: input.postingDate ? input.postingDate : new Date().toLocaleDateString('en-CA'),
      instrumentType: Number(input.instrumentType),
      startDate: input.startDate,
      firstPaymentDate: input.firstPaymentDate,
      maturityDate: generalDetails.maturityDate,
      investmentBank: input.investmentBank,
      totalInterestAmount: generalDetails.interestAmount,
      fundingAccount: input.fundingAccount,
      totalTaxAmount: generalDetails.taxAmount,
      includeTax: tax,
      maturityAmount: generalDetails.maturityAmount,
      narration: input.narration,
      minimumInvestmentAmount: productDetails.minimumInvestmentAmount,
      maximumInvestmentAmount: productDetails.maximumInvestmentAmount,
    };
    axios.post("Investment/add-placement", payload, {
      headers:{Authorization: `Bearer ${credentials.token}`,},
    }).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
        navigate(-1)
      }, 5000); 
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  };

  const getNoOfDays= ()=>{
    if (input.frequency === '001') {
      setNoOFDays(7)
    }else if (input.frequency === '002') {
      setNoOFDays(7 * input.term)
    }else if (input.frequency === '003') {
       setNoOFDays(14 * input.term)
    }else if (input.frequency === '004') {
      setNoOFDays(30 * input.term)
    }else if (input.frequency === '005') {
        setNoOFDays(120 * input.term)
    }else if (input.frequency === '006') {
        setNoOFDays(240 * input.term)
    }else if (input.frequency === '007') {
        setNoOFDays(365 * input.term)
      }
  }
  useEffect(()=>{
getNoOfDays()
  }, [input.term, input.frequency])
  return (
    <div className="bg-white p-3 rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4
          style={{ fontSize: "16px", color: "#1d1d1d" }}
          className="active-selector"
        >
          Investments
        </h4>
      </div>
      <form onSubmit={addInvestment}>
        <div
          className="p-3"
          style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
        >
          <div
            className=" d-flex align-items-center gap-2 title-link"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft />{" "}
            <span style={{ fontSize: "16px" }}>Add new investment </span>
          </div>
        </div>
        <div
          className="px-3 pt-2 pb-4"
          style={{ borderInline: "1px solid #ddd" }}
        >
          <div className="admin-task-forms my-4">
            <div
              className=""
              style={{
                boxShadow: "3px 3px 3px 3px #ddd",
                borderRadius: "1rem 1rem 0 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#EDF4FF",
                  padding: "10px 15px 2px",
                  borderRadius: "1rem 1rem 0 0",
                }}
              >
                <p style={{ fontSize: "14px" }}>Product Info</p>
              </div>
              <div
                className="px-3 d-flex flex-column gap-2 py-2"
                style={{ fontSize: "14px" }}
              >
                <div className="d-flex gap-3 discourse">
                  <span>Product Name:</span>
                  <p>{productDetails?.productName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Start date:</span>
                  <p>{productDetails?.productStart}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Expiry date:</span>
                  <p>{productDetails?.productExpire}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Currency:</span>
                  <p>{productDetails?.productCurrency}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Minimum investment amount</span>
                  <p>{new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(productDetails?.minimumInvestmentAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Maximum investment amount</span>
                  <p>{new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(productDetails?.maximumInvestmentAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Minimum interest rate:</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(productDetails?.minimumInterestRate)}
                  </p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Maximum interest rate:</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(productDetails?.maximumInterestRate)}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="d-flex flex-column gap-2 p-0"
              style={{
                boxShadow: "3px 3px 3px 3px #ddd",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#FEF3E6",
                  paddingTop: "10px",
                  paddingInline: "15px",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <p style={{ fontSize: "14px" }}>Investment Account Info</p>
              </div>
              <div className="px-3 d-flex flex-column gap-2 py-2">
                <div className="d-flex gap-3 discourse">
                  <span>Account Number:</span>
                  <p>{accountDetails?.accountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Name:</span>
                  <p>{accountDetails?.accountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{accountDetails?.branchName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Book Balance:</span>
                  <p>{accountDetails?.bookBalance}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Status:</span>
                  <p>{accountDetails?.status}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-task-forms">
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="">
                Select investment product <sup className="text-danger">*</sup>
              </label>
              <select name="product" onChange={handleChange} required>
                <option value="">Select</option>
                {products.map((product) => (
                  <option value={product.productCode} key={product.productCode}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="">
                Investment amount<sup className="text-danger">*</sup>
              </label>
              <input name="amount" onChange={handleChange} required />
            </div>
            <div className="d-flex gap-1 flex-column">
              <label htmlFor="">
                Select branch<sup className="text-danger">*</sup>
              </label>
              <select name="branch" onChange={handleChange}>
                <option value="">Select</option>
                {branches.map((branch) => (
                  <option value={branch.branchCode} key={branch.branchCode}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">
                Term<sup className="text-danger">*</sup>
              </label>
              <input type="number" name="term" id="term" onChange={handleChange} required/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="frequency">
                Frequency<sup className="text-danger">*</sup>
              </label>
              <select type="number" name="frequency" required onChange={handleChange}>
                <option value="">Select</option>
                {frequencies.map((frequency) => (
                  <option value={frequency.freqCode} key={frequency.freqCode}>
                    {frequency.freqName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="noOfDays">
                No of days
              </label>
              <input type="number" name="noOfDays"  disabled value={noOfDays}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="investmentRate">
                Investment rate (%)<sup className="text-danger">*</sup>
              </label>
              <input type="number" name="investmentRate" onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="paymentType">
                Payment type<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="paymentType" onChange={handleChange}>
                <option value="">Select</option>
                <option value="1">Non Discounted</option>
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="postingDate">
                Posting date<sup className="text-danger">*</sup>
              </label>
              <input
                value={new Date().toLocaleDateString("en-US")}
                name="postingDate"
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="instrumentType">
                Instrument type<sup className="text-danger">*</sup>
              </label>
              <select type="text" name="instrumentType" onChange={handleChange}>
                <option value="">Select</option>
                {instruments.map((instrument) => (
                  <option
                    value={instrument.tdTypeCode}
                    key={instrument.tdTypeCode}
                  >
                    {instrument.tdTypeDesc}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="startDate">
                Start date<sup className="text-danger">*</sup>
              </label>
              <input name="startDate" onChange={handleChange} type="date"/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="firstPaymentDate">
                First payment date<sup className="text-danger">*</sup>
              </label>
              <input onChange={handleChange} name="firstPaymentDate" type="date" />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="maturityDate">
                Maturity date<sup className="text-danger">*</sup>
              </label>
              <input
                name="maturityDate"
                disabled
                value={new Date(generalDetails?.maturityDate).toLocaleDateString('en-US')}
              />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="investmentBank">
                Investment bank<sup className="text-danger">*</sup>
              </label>
              <select name="investmentBank" onChange={handleChange} required>
                <option value="">Select</option>
                {banks.map((bank) => (
                  <option value={bank.bankCode} key={bank.bankName}>
                    {bank.bankName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="totalInterest">
                Total interest amount<sup className="text-danger">*</sup>
              </label>
              <input name="totalInterest" disabled value={new Intl.NumberFormat('en-US',
                 {minimumFractionDigits:2}).format(generalDetails?.interestAmount)}/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="fundingAccount">
                Funding account<sup className="text-danger">*</sup>
              </label>
              <select name="fundingAccount" onChange={handleChange} required>
                <option value="">Select</option>
                {gls.map((gl) => (
                  <option value={gl.accountNumber} key={gl.accountNumber}>
                    {gl.acctName} {`>> ${gl.accountNumber}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="totalTax">
                Total tax amount<sup className="text-danger">*</sup>
              </label>
              <input name="totalTax" disabled value={new Intl.NumberFormat('en-US',
                 {minimumFractionDigits:2}).format(generalDetails?.taxAmount)} />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="maturityAmount">
                Maturity amount<sup className="text-danger">*</sup>
              </label>
              <input name="maturityAmount" disabled value={new Intl.NumberFormat('en-US',
                 {minimumFractionDigits:2}).format(generalDetails?.maturityAmount)} />
            </div>
            </div>
            <div className="statutory-list">
            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="">Include tax?</label>{" "}
              <input
                type="checkbox"
                name="tax"
                checked={tax}
                onChange={(e) => setTax(e.target.checked)}
              />
            </div>
            </div>
            <div className="mt-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="narration">
                Narration<sup className="text-danger">*</sup>
              </label>
              <textarea name="narration" required onChange={handleChange} className="p-2"
               style={{height:'5rem', borderRadius:'.8rem', border:'none', backgroundColor:'#F5F5F5'}}/>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }}
          className="d-flex justify-content-end gap-3 p-3"
        >
          <button
            type="reset"
            className="btn btn-sm rounded-5"
            style={{ backgroundColor: "#f7f7f7" }}
          >
            Discard
          </button>
          <button type="submit" className="border-0  btn-md member">
            Proceed
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default AddInvestment;
