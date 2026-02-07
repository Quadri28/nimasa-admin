import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditCooperativeLoanFormOne from "./EditCooperativeLoanFormOne";
import EditCooperativeLoanFormTwo from "./EditCooperativeLoanFormTwo";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

const EditLoanProduct = () => {
  const { productCode } = useParams();
  const [current, setCurrent] = useState("first");
  const [data, setData]= useState([])

  const [details, setDetails] = useState({
    productCode: "",
    productClass: "",
    productName: "",
    currencyCode: "",
    productStart: "",
    productExpire: "",
    minAmount: 0,
    productType: "",
    penalize:'',
    loanTerm: "",
    maxAmount: 0,
    productShort: "",
    numberOfGauratorRequired: 0,
    minimumInterestPerMonth: '',
    maximumInterestPerMonth: '',
    minTerm: '',
    maxTerm: '',
    interestRate: '',
    loanRepaymentId: "",
    loanInterestRepaymentType: 0,
    calcmeth: 0,
    loanType: 0,
    repaymentType2: 0,
    loanClass: 0,
    penalOption: 0,
    collateralValue: 0,
    penaltyRate: 0,
    allowODOnAccount: true,
    allowCommercialPapper: true,
    repaymentType: "",
    principalBalance: "",
    interestReceivable: "",
    suspendedInterest: "",
    suspendedPrincipal: "",
    interestAccrual: "",
    unearnedIncomeGL: "",
    interestIncome: "",
    miscIncome: "",
    interBranch: "",
  });


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };

  const getForms = () => {
    if (current === "first") {
      return (
        <EditCooperativeLoanFormOne
          handleChange={handleChange}
          details={details}
        />
      );
    } else if (current === "second") {
      return (
        <EditCooperativeLoanFormTwo
          handleChange={handleChange}
          details={details}
          setDetails={setDetails}
          data={data}
          setData={setData}
         
        />
      );
    }
  };

  const getLoanDetails=()=>{
    axios(`LoanProduct/loan-product?productCode=${productCode}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then((resp)=>{
      setDetails(resp.data.data)
    }).catch(error=>setError(error.message))
  }

  useEffect(()=>{
    getLoanDetails()
  },[])
  const navigate = useNavigate();

  const {credentials} = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastOptions = {
      pauseOnHover: true,
      autoClose: 5000,
      type: "success",
    };
    const payload = {
      productCode: details.productCode,
      productClass: String(details.productClass),
      productName: details.productName,
      currencyCode: details.currencyCode,
      productStart: details.productStart,
      productExpire: details.productExpire,
      minimumLoanAmount:Number(details.minAmount),
      productType: details.productType,
      loanFrequency: details.loanTerm,
      maximumLoanAmount: Number(details.maxAmount),
      shortName: details.productShort,
      numberOfGauratorRequired: Number(details.guarantorReq),
      minimumInterestPerMonth: details.minimumInterestPerMonth,
      maximumInterestPerMonth: details.maximumInterestPerMonth,
      minimumTerm: details.minTerm,
      maximumTerm: details.maxTerm,
      interestRate: Number(details.interestRate),
      loanRepaymentId: details.loanRepaymentId,
      repaymentMethod: details.repaymentMethod,
      loanInterestRepaymentType: Number(details.repaymentType),
      calculationMethod: Number(details.calcmethod),
      loanType: Number(details.loanType),
      principalRepaymentType: Number(details.repaymentType2),
      loanClass: details.loanClass,
      penalOption: Number(details.penalize),
      collateralValue: details.collateralValue,
      penaltyRate: details.penaltyRate,
      allowODOnAccount: details.allowODOnAccount,
      allowCommercialPapper: details.allowCommercialPapper,
      repaymentType: String(details.repaymentType),
      principalBalance: details.principalBalance,
      interestIncome: details.interestIncome,
      interestAccrual: details.interestAccrual,
      interestReceivable: details.interestReceivable,
      suspendedInterest: details.suspendedInterest,
      suspendedPrincipal: details.suspendedPrincipal,
      unearnedIncomeGL: details.unearnedIncomeGL,
      miscIncome: details.miscIncome,
      interBranch: details.interBranch
    };
    const toastErrorOptions={
      type:'error',
      autoClose:5000,
      pauseOnHover: true
    }
    axios
      .post("LoanProduct/update-loan-product", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, toastOptions);
        setTimeout(() => {
          navigate(-1)
        }, 5000);
      })
      .catch((error) =>{
        console.log(error.response.data.errors)
        error.response.data.errors.forEach(msg=>
          toast(msg.message, toastErrorOptions)
        )
      });
  };

  return (
    <>
      <div className="card rounded-4 mt-3" style={{border:'solid .5px #fafafa'}}>
        <div
          className="justify-content-center p-3"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <div className="d-flex gap-1 align-items-center">
            <BsArrowLeft
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />{" "}
            Edit Loan Product
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {getForms()}
          <div
            className="d-flex justify-content-end mt-3 p-3 gap-4"
            style={{ backgroundColor: "#FAFAFA", borderRadius:'0 0 15px 15px' }}
          >
            {current === "second" && (
              <button
                className="border-0 btn-md px-2 rounded-5"
                type="reset"
                onClick={() => setCurrent("first")}
              >
                Previous
              </button>
            )}
            {current === "first" && (
              <button
                className="border-0 member btn-md"
               
                type="button"
                onClick={() => setCurrent("second")}
              >
                Proceed
              </button>
            )}
            {current === "second" && (
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
                Submit
              </button>
            )}
          </div>
          <ToastContainer/>
        </form>
      </div>
    </>
  );
};

export default EditLoanProduct;
