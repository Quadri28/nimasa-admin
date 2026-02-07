import React, { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";

const EditCooperativeLoanFormOne = ({ handleChange, details }) => {
  const [currencies, setCurrencies] = useState([]);
  const [types, setTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);

  const { credentials } = useContext(UserContext);
  const getCurrencies = async () => {
    await axios("Common/get-currencies").then((resp) =>
      setCurrencies(resp.data)
    );
  };

  const getFrequencies = () => {
    axios("Common/getloanfrequencies").then((resp) =>
      setFrequencies(resp.data)
    );
  };

  const getLoanTypes = () => {
    axios("Common/getproducttype").then((resp) => setTypes(resp.data));
  };

  const getClasses = () => {
    axios("LoanProduct/list-product-class", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setClasses(resp.data.data);
    });
  };
  useEffect(() => {
    getCurrencies();
    getLoanTypes();
    getClasses();
    getFrequencies();
  }, []);

  return (
    <>
      <div className="px-4 admin-task-forms py-3">
        <div className="row g-2">
          <label htmlFor="productCode" style={{ fontWeight: "500" }}>
            Product Code:
          </label>
          <input
            name="productCode"
            id="productCode"
            value={details.productCode}
            onChange={handleChange}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="productType" style={{ fontWeight: "500" }}>
            Product Type :
          </label>
          <select
            name="productType"
            id="productType"
            value={details.productType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {types.map((type) => (
              <option value={type.productTypeId} key={type.productTypeId}>
                {type.productTypeDesc}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-2">
          <label htmlFor="productName" style={{ fontWeight: "500" }}>
            Product Name
          </label>
          <input
            name="productName"
            id="productName"
            value={details.productName}
            onChange={handleChange}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="interestRate" style={{ fontWeight: "500" }}>
            Interest Rate :
          </label>
          <input
            name="interestRate"
            id="interestRate"
            type="number"
            onChange={handleChange}
            value={details.interestRate}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="productClass" style={{ fontWeight: "500" }}>
            Product Class :
          </label>
          <select
            name="productClass"
            id="productClass"
            value={details?.productClass}
            onChange={handleChange}
          >
            <option value="">Select</option>
            {classes.map((clas) => (
              <option value={clas.moduleCode} key={clas.moduleCode}>
                {clas.moduleDescription}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-2">
          <label htmlFor="minAmount" style={{ fontWeight: "500" }}>
            Minimum Loan Amount :
          </label>
          <input
            name="minAmount"
            id="minAmount"
            onChange={handleChange}
            value={details?.minAmount}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="maxAmount" style={{ fontWeight: "500" }}>
            Maximum Loan Amount :
          </label>
          <input
            name="maxAmount"
            id="maxAmount"
            onChange={handleChange}
            value={details?.maxAmount}
          />
        </div>

        <div className="row g-2">
          <label htmlFor="minTerm" style={{ fontWeight: "500" }}>
            Minimum Term :
          </label>
          <input
            name="minTerm"
            id="minTerm"
            onChange={handleChange}
            value={details?.minTerm}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="maxTerm" style={{ fontWeight: "500" }}>
            Maximum Term :
          </label>
          <input
            name="maxTerm"
            id="maxTerm"
            onChange={handleChange}
            value={details?.maxTerm}
          />
        </div>
       <div className="row g-2">
          <label htmlFor="loanType" style={{ fontWeight: "500" }}>
            Loan Type:
          </label>
          <select name="loanType" onChange={handleChange} value={details?.loanType}>
          <option value="">Select</option>
                 <option value={1}>Non Discounted</option>
                 <option value={2}>Discounted</option>
          </select>
          </div>
        <div className="row g-2">
          <label
            htmlFor="minimumInterestPerMonth"
            style={{ fontWeight: "500" }}
          >
            Minimum Interest Per Month :
          </label>
          <input
            name="minimumInterestPerMonth"
            onChange={handleChange}
            value={details?.minimumInterestPerMonth}
          />
        </div>
        <div className="row g-2">
          <label
            htmlFor="maximumInterestPerMonth"
            style={{ fontWeight: "500" }}
          >
            Maximum Interest Per Month :
          </label>
          <input
            name="maximumInterestPerMonth"
            onChange={handleChange}
            value={details?.maximumInterestPerMonth}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="productShort" style={{ fontWeight: "500" }}>
            Short Name :
          </label>
          <input
            name="productShort"
            id="productShort"
            value={details?.productShort}
            onChange={handleChange}
          />
        </div>
        <div className="row g-2">
          <label htmlFor="loanTerm" style={{ fontWeight: "500" }}>
            Loan Frequency:
          </label>
          <select
            name="loanTerm"
            onChange={handleChange}
            value={details?.loanTerm}
          >
            <option value="">Select</option>
            {frequencies.map((frequency) => (
              <option value={frequency.freqCode} key={frequency.freqCode}>
                {frequency.freqName}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-2">
          <label htmlFor="currency" style={{ fontWeight: "500" }}>
            Currency :
          </label>
          <select
            name="currency"
            id="currency"
            as="select"
            value={details?.currencyCode}
            onChange={handleChange}
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option value={currency.countryCode} key={currency.countryCode}>
                {currency.currencyName}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-2">
          <label htmlFor="productStart" style={{ fontWeight: "500" }}>
            Current Reg. Date:
          </label>
          <DatePicker
            selected={
              details?.productStart && !isNaN(Date.parse(details.productStart))
                ? new Date(details.productStart)
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
          <label htmlFor="productExpire" style={{ fontWeight: "500" }}>
            Current Exp. Date:
          </label>
          <DatePicker
            selected={
              details?.productExpire &&
              !isNaN(Date.parse(details.productExpire))
                ? new Date(details.productExpire)
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
          <label htmlFor="guarantorReq" style={{ fontWeight: "500" }}>
            No of Guarantor required:
          </label>
          <input
            name="guarantorReq"
            id="guarantorReq"
            type="number"
            value={details?.guarantorReq}
            onChange={handleChange}
          />
        </div>
        
      </div>
    </>
  );
};

export default EditCooperativeLoanFormOne;
