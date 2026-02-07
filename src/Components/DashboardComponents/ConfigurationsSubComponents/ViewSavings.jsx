import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { NumericFormat } from 'react-number-format'
import { BsArrowLeft } from 'react-icons/bs'

const ViewSavings = () => {
  const {savingCode} = useParams()
  const [savings, setSavings]= useState({
    openBalance: 0,
    closeBalance: 0
  })
  const [types, setTypes] = useState([])
  const [currencies, setCurrencies] = useState([])
  const {credentials}= useContext(UserContext)
  const getSavings=()=>{
    axios(`SavingProduct/get-saving-product-by-code?savingCode=${savingCode}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp)=>{
      setSavings(resp.data.data)
    })
  }
  const navigate = useNavigate()
  const getTypes=()=>{
    axios('Common/getproducttype')
    .then((resp)=>setTypes(resp.data))
  }
const getCurrencies=()=>{
  axios('Common/get-currencies')
  .then((resp)=>setCurrencies(resp.data))
}
  useEffect(()=>{
    getSavings()
    getTypes()
    getCurrencies()
  }, [])
  return (
    <div className="card rounded-4" style={{border:'solid .5px #fafafa'}}>
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}
      >
        <div className="d-flex gap-2 align-items-center">
          <BsArrowLeft
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          View Saving Product
        </div>
      </div>
      <form className="mb-4">
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Product Code:
            </label>
            <input
              name="productCode"
              id="productCode"
              value={savings.productCode}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productClass" style={{ fontWeight: "500" }}>
              Product Class:
            </label>
            <select
              name="productClass"
              id="productClass"
              value={savings.productClass}
              readOnly
            >
              <option value="1">Demand Deposit</option>
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="productStart" style={{ fontWeight: "500" }}>
              Product Start:
            </label>
            <input
              name="productStart"
              id="productStart"
              value={new Date(savings.productStart).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="expiryDate" style={{ fontWeight: "500" }}>
              Expiry Date:
            </label>
            <input
              name="productExpire"
              id="productExpire"
              value={new Date(savings.productExpire).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="openBalance" style={{ fontWeight: "500" }}>
              Opening Balance:
            </label>
            <NumericFormat
            thousandSeparator={true}
            fixedDecimalScale
            decimalScale={2}
              name="openBalance"
              id="openBalance"
              value={savings.openBalance}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="closeBalance" style={{ fontWeight: "500" }}>
              Product Shortname:
            </label>
            <NumericFormat
            thousandSeparator={true}
            fixedDecimalScale
            decimalScale={2}
              name="closeBalance"
              id="closeBalance"
              value={savings.closeBalance}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productType" style={{ fontWeight: "500" }}>
              Product Type:
            </label>
            <select
              name="productType"
              id="productType"
              value={savings.productType}
              readOnly
              disabled
            >
            <option value="">Select</option>
            {
              types.map((type)=>(
                <option value={type.productTypeId} key={type.productTypeId}>{type.productTypeDesc}</option>
              ))
            }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Currency:
            </label>
            <select
              name="currencyCode"
              id="currencyCode"
              value={savings.currencyCode}
              readOnly
              disabled
            >
              <option value="">Select</option>
            {
              currencies.map((currency)=>(
                <option value={currency.countryCode} key={currency.countryCode}>
                  {currency.currencyName}
                </option>
              ))
            }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="minimumInterestBalance" style={{ fontWeight: "500" }}>
            Minimum Interest Balance:
            </label>
            <input
              name="minimumInterestBalance"
              id="minimumInterestBalance"
              value={savings.minimumInterestBalance}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Credit Interest Rates:
            </label>
            <input
              name="crRate"
              id="crRate"
              value={savings.crRate}
              readOnly
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="drRate" style={{ fontWeight: "500" }}>
              Debit Interest Rates:
            </label>
            <input
              name="drRate"
              id="drRate"
              value={savings.drRate}
              readOnly
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Interest Calculation Basis (days):
            </label>
            <input
              name="interestCalc"
              id="productCode"
              value={savings.productCode}
              readOnly
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Interest Days:
            </label>
            <input
              name="dailyInterest"
              id="dailyInterest"
              value={savings.dailyInterest}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: "500" }}>
              Max. Withdrawal (Allowed for interest):
            </label>
            <input
              name="maximumAmount"
              id="maximumAmount"
              value={savings.maximumAmount}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ViewSavings
