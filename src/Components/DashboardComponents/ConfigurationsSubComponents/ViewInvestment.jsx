import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { NumericFormat } from 'react-number-format'
import { TfiAngleLeft } from 'react-icons/tfi'
import { BsArrowLeft } from 'react-icons/bs'

const ViewInvestment = () => {
    const {id} = useParams()
const [investment, setInvestment]= useState({})
const [currencies, setCurrencies]= useState([])
const [terms, setTerms]= useState([])
const {credentials} = useContext(UserContext)

    const getInvestment =()=>{
        axios(`InvestmentProduct/get-investment-product-by-code?savingCode=${id}`, {
            headers:{
                Authorization: `Bearer ${credentials.token}`
            }
        }).then((resp)=>setInvestment(resp.data.data))
    }
    const getCurrencies=()=>{
        axios('Common/get-currencies')
        .then((resp)=>setCurrencies(resp.data))
    }
    const getTerms=()=>{
        axios('Common/getloanfrequencies')
        .then((resp)=>setTerms(resp.data))
    }
useEffect(()=>{
    getInvestment()
    getCurrencies()
    getTerms()
}, [])
const navigate = useNavigate()

return (
    <div className="card rounded-4 mt-3" style={{border:'solid .5px #fafafa'}}>
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
      >
        <div className="d-flex gap-1 align-items-center">
          <BsArrowLeft
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          View Investment Product
        </div>
      </div>
      <form className="mb-4">
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="productCode" style={{ fontWeight: '500' }}>
              Product Code:
            </label>
            <input
              name="productCode"
              id="productCode"
              value={investment?.productCode}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productName" style={{ fontWeight: '500' }}>
              Product Name:
            </label>
            <input
              name="productName"
              id="productName"
              value={investment?.productName}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="shortName" style={{ fontWeight: '500' }}>
            ShortName:
            </label>
            <input
              name="shortName"
              id="shortName"
              value={investment?.shortName}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productClass" style={{ fontWeight: '500' }}>
              Product Class:
            </label>
            <select
              name="productClass"
              id="productClass"
              value={investment?.productClass}
              readOnly
            >
            <option value="6">Placement</option>
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="currencyCode" style={{ fontWeight: '500' }}>
              Currency Code:
            </label>
            <select
              name="currencyCode"
              id="currencyCode"
              value={investment?.currencyCode}
              readOnly
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
            <label htmlFor="productStart" style={{ fontWeight: '500' }}>
              Start Date:
            </label>
            <input
              name="productStart"
              id="productStart"
              value={new Date(investment?.productStart).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productExpire" style={{ fontWeight: '500' }}>
              Expiry Date:
            </label>
            <input
              name="productExpire"
              id="productExpire"
              value={new Date(investment?.productExpire).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="productType" style={{ fontWeight: '500' }}>
            Product Type:
            </label>
            <select
              name="productType"
              id="productType"
              value={investment?.productType}
              readOnly
            > 
            <option value="">Select</option>
            {/* {
              types.map((type)=>(
                <option value={type.branchCode} key={type.branchCode}>
                  {type.branchName}
                </option>
              ))
            } */}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="mnType" style={{ fontWeight: '500' }}>
            Minimum Interest:
            </label>
            <input
              name="mnType"
              id="mnType"
              value={investment?.mnType}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="mxType" style={{ fontWeight: '500' }}>
            Maximum Interest:
            </label>
            <input
              name="mxType"
              id="mxType"
              value={investment?.mxType}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="term" style={{ fontWeight: '500' }}>
            Term:
            </label>
            <select
              name="term"
              id="term"
              value={investment?.term}
              readOnly
            >
            <option value="">Select</option>
            {
               terms.map((term)=>(
                <option value={term.freqCode} key={term.freqCode}>
                  {term.freqName}
                </option>
              ))
            }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="repayMeth" style={{ fontWeight: '500' }}>
            Repayment Method:
            </label>
            <input
              name="repayMeth"
              id="repayMeth"
              value={investment?.repayMeth}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="minTerm" style={{ fontWeight: '500' }}>
            Minium Term:
            </label>
            <input
              name="minTerm"
              id="minTerm"
              value={investment?.minTerm}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="maxTerm" style={{ fontWeight: '500' }}>
            Maximum Term:
            </label>
            <input
              name="maxTerm"
              id="maxTerm"
              value={investment?.maxTerm}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="intAccrual" style={{ fontWeight: '500' }}>
            Interest Accrual GL:
            </label>
            <input
              name="intAccrual"
              id="intAccrual"
              value={investment?.intAccrual}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="principal" style={{ fontWeight: '500' }}>
            Principal GL:
            </label>
            <input
              name="principal"
              id="principal"
              value={investment?.principal}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="intIncome" style={{ fontWeight: '500' }}>
            Interest Income:
            </label>
            <input
              name="intIncome"
              id="intIncome"
              value={investment?.intIncome}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="tTax" style={{ fontWeight: '500' }}>
            WithHolding Tax:
            </label>
            <input
              name="tTax"
              id="tTax"
              value={investment?.tTax}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="maturedGL" style={{ fontWeight: '500' }}>
            Matured Placement GL:
            </label>
            <input
              name="maturedGL"
              id="maturedGL"
              value={investment?.maturedGL}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="upfront" style={{ fontWeight: '500' }}>
            Upfront Interest (Discounted instruments):
            </label>
            <input
              name="upfront"
              id="upfront"
              value={investment?.upfront}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="suspPrinc" style={{ fontWeight: '500' }}>
            Suspended Principal:
            </label>
            <input
              name="suspPrinc"
              id="suspPrinc"
              value={investment?.suspPrinc}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="suspInt" style={{ fontWeight: '500' }}>
            Suspended Interest:
            </label>
            <input
              name="suspInt"
              id="suspInt"
              value={investment?.suspInt}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="paymentGL" style={{ fontWeight: '500' }}>
            Cash Payment GL:
            </label>
            <input
              name="paymentGL"
              id="paymentGL"
              value={investment?.paymentGL}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ViewInvestment
