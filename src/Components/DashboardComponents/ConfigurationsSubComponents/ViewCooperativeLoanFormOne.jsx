import React, { useContext, useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'

const ViewCooperativeLoanFormOne = ({details}) => {
  const [currencies, setCurrencies] = useState([])
  const [types, setTypes] = useState([])
  const [classes, setClasses]= useState([])
  const [frequencies, setFrequencies] = useState([])

  const {credentials}= useContext(UserContext)
  const getCurrencies= async()=>{
    await axios('Common/get-currencies')
    .then((resp)=>setCurrencies(resp.data))
  }

  const getFrequencies=()=>{
    axios('Common/getloanfrequencies')
    .then((resp)=>setFrequencies(resp.data))
  }

  const getLoanTypes =()=>{
    axios('Common/getproducttype')
    .then((resp)=>setTypes(resp.data))
  }

  const getClasses=()=>{
    axios('LoanProduct/list-product-class', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then((resp)=>{
      setClasses(resp.data.data)
    })
  }
  useEffect(()=>{
    getCurrencies()
    getLoanTypes()
    getClasses()
    getFrequencies()
  }, [])
  
  return (
    <>
    <div className="px-4 admin-task-forms py-3">
    <div className="row g-2">
      <label htmlFor="productCode">
        Product Code
      </label>
      <input name="productCode" id="productCode" value={details.productCode} readOnly/>
    </div>
    <div className="row g-2">
      <label htmlFor="productType">
        Product Type
      </label>
      <select name="productType" id="productType" value={details.productType} readOnly >
      <option value="">Select</option>
      {
        types.map((type)=>(
         <option value={type.productTypeId} key={type.productTypeId}>{type.productTypeDesc}</option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="productName">
        Product Name 
      </label>
      <input name="productName" id="productName" value={details.productName} readOnly/>
    </div>
    <div className="row g-2">
      <label htmlFor="interestRate">
        Interest Rate
      </label>
      <input name="interestRate" id="interestRate" type="number" value={details.interestRate}/>
    </div>
    <div className="row g-2">
      <label htmlFor="productStart">
        Registration Date
      </label>
      <input name="productStart" id="productStart" 
       value={new Date(details?.productStart)?.toLocaleDateString('en-us')} readOnly/>
    </div>
    <div className="row g-2">
      <label htmlFor="productShort">
        Short Name 
      </label>
      <input name="productShort" id="productShort" value={details?.productShort} readOnly/>
    </div>
    <div className="row g-2">
      <label htmlFor="minAmount">
        Minimum Loan Amount
      </label>
      <NumericFormat decimalScale={2} fixedDecimalScale thousandSeparator={true}
       name="minAmount" id="minAmount" readOnly value={details?.minAmount} />
    </div>
    <div className="row g-2">
      <label htmlFor="productClass">
        Product Class
      </label>
      <select name="productClass" id="productClass" value={details?.productClass} readOnly>
        <option value="">Select</option>
        {
          classes.map((clas)=>(
            <option value={clas.moduleCode} key={clas.moduleCode}>
              {clas.moduleDescription}</option>
          ))
        }
        </select>
    </div>
    <div className="row g-2">
      <label htmlFor="maxAmount">
        Maximum Loan Amount
      </label>
      <NumericFormat decimalScale={2} fixedDecimalScale thousandSeparator={true}
       name="maxAmount" id="maxAmount" readOnly value={details?.maxAmount}/>
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
            value={details?.maximumInterestPerMonth}
          />
        </div>
    <div className="row g-2">
      <label htmlFor="currency">
        Currency
      </label>
      <select name="currency" id="currency" as='select' value={details?.currencyCode}>
        <option value="">Select Currency</option>
        {
          currencies.map((currency)=>(
            <option value={currency.countryCode} key={currency.countryCode}>
              {currency.currencyName}</option>
          ))
        }
        </select>
    </div>
    <div className="row g-2">
      <label htmlFor="loanTerm">
     Loan Frequency 
      </label>
      <select name="loanTerm" id="loanTerm" value={details?.loanTerm}>
        <option value="">Select</option>
        {
          frequencies.map((frequency)=>(
            <option value={frequency.freqCode} key={frequency.freqCode}>{frequency.freqName}</option>
          ))
        }
        </select>
    </div>
    <div className="row g-2">
      <label htmlFor="productExpire">
     Expiry Date
      </label>
      <input name="productExpire" id="productExpire" readOnly value={new Date(details?.productExpire)?.toLocaleDateString('en-us')}/>
    </div>
  </div>
  </>
  )
}

export default ViewCooperativeLoanFormOne
